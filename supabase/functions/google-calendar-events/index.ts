import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { startDate, endDate, staffId } = await req.json();

    // Obtener tokens de Google del usuario
    const { data: tokens, error: tokensError } = await supabaseClient
      .from('user_google_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', user.id)
      .single();

    if (tokensError || !tokens) {
      return new Response(
        JSON.stringify({ events: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar si el token ha expirado y renovarlo si es necesario
    let accessToken = tokens.access_token;
    const now = new Date();
    const expiresAt = new Date(tokens.expires_at);
    
    if (now >= expiresAt && tokens.refresh_token) {
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: Deno.env.get('GOOGLE_CLIENT_ID')!,
          client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET')!,
          refresh_token: tokens.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (refreshResponse.ok) {
        const newTokens = await refreshResponse.json();
        accessToken = newTokens.access_token;
        
        // Actualizar tokens en la base de datos
        await supabaseClient
          .from('user_google_tokens')
          .update({
            access_token: newTokens.access_token,
            expires_at: new Date(Date.now() + newTokens.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
      }
    }

    // Obtener eventos de Google Calendar en el rango de fechas
    const timeMin = new Date(startDate).toISOString();
    const timeMax = new Date(endDate).toISOString();
    
    const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `singleEvents=true&` +
      `orderBy=startTime`;

    const response = await fetch(calendarUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error obteniendo eventos: ${response.statusText}`);
    }

    const calendarData = await response.json();
    
    // Filtrar eventos que no sean creados por nuestra aplicación
    const { data: syncedEvents } = await supabaseClient
      .from('google_calendar_events')
      .select('google_event_id');

    const syncedEventIds = syncedEvents?.map(e => e.google_event_id) || [];
    
    // Filtrar solo eventos externos (no creados por nuestra app)
    const externalEvents = calendarData.items?.filter((event: any) => 
      !syncedEventIds.includes(event.id) && event.start?.dateTime
    ) || [];

    // Convertir eventos a formato compatible con nuestra lógica de disponibilidad
    const busyTimes = externalEvents.map((event: any) => ({
      start: event.start.dateTime,
      end: event.end.dateTime,
      title: event.summary || 'Evento de Google Calendar',
      isGoogleEvent: true,
    }));

    return new Response(
      JSON.stringify({ events: busyTimes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error obteniendo eventos de Google Calendar:', error);
    return new Response(
      JSON.stringify({ events: [], error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});