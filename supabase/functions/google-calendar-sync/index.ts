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

    const { action, appointmentId, appointmentData } = await req.json();

    // Obtener tokens de Google del usuario
    const { data: tokens, error: tokensError } = await supabaseClient
      .from('user_google_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', user.id)
      .single();

    if (tokensError || !tokens) {
      return new Response(
        JSON.stringify({ error: 'Google Calendar no conectado' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    switch (action) {
      case 'create':
        return await createGoogleCalendarEvent(accessToken, appointmentData, supabaseClient);
      
      case 'update':
        return await updateGoogleCalendarEvent(accessToken, appointmentId, appointmentData, supabaseClient);
      
      case 'delete':
        return await deleteGoogleCalendarEvent(accessToken, appointmentId, supabaseClient);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Acción no válida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('Error en sincronización:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function createGoogleCalendarEvent(accessToken: string, appointmentData: any, supabaseClient: any) {
  const event = {
    summary: `${appointmentData.service_name} - ${appointmentData.client_name}`,
    description: `Cliente: ${appointmentData.client_name}\nServicio: ${appointmentData.service_name}\nPersonal: ${appointmentData.staff_name}\nPrecio: $${appointmentData.price}\nTeléfono: ${appointmentData.client_phone || 'No proporcionado'}\nEmail: ${appointmentData.client_email}`,
    start: {
      dateTime: new Date(appointmentData.start_time).toISOString(),
      timeZone: 'America/Bogota',
    },
    end: {
      dateTime: new Date(appointmentData.end_time).toISOString(),
      timeZone: 'America/Bogota',
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error(`Error creando evento: ${response.statusText}`);
  }

  const googleEvent = await response.json();

  // Guardar la relación en la base de datos
  await supabaseClient
    .from('google_calendar_events')
    .insert({
      appointment_id: appointmentData.appointment_id,
      google_event_id: googleEvent.id,
      business_id: appointmentData.business_id,
    });

  return new Response(
    JSON.stringify({ success: true, eventId: googleEvent.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateGoogleCalendarEvent(accessToken: string, appointmentId: string, appointmentData: any, supabaseClient: any) {
  // Obtener el ID del evento de Google
  const { data: eventRecord, error } = await supabaseClient
    .from('google_calendar_events')
    .select('google_event_id')
    .eq('appointment_id', appointmentId)
    .single();

  if (error || !eventRecord) {
    throw new Error('Evento no encontrado en Google Calendar');
  }

  const event = {
    summary: `${appointmentData.service_name} - ${appointmentData.client_name}`,
    description: `Cliente: ${appointmentData.client_name}\nServicio: ${appointmentData.service_name}\nPersonal: ${appointmentData.staff_name}\nPrecio: $${appointmentData.price}\nTeléfono: ${appointmentData.client_phone || 'No proporcionado'}\nEmail: ${appointmentData.client_email}`,
    start: {
      dateTime: new Date(appointmentData.start_time).toISOString(),
      timeZone: 'America/Bogota',
    },
    end: {
      dateTime: new Date(appointmentData.end_time).toISOString(),
      timeZone: 'America/Bogota',
    },
  };

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventRecord.google_event_id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error(`Error actualizando evento: ${response.statusText}`);
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function deleteGoogleCalendarEvent(accessToken: string, appointmentId: string, supabaseClient: any) {
  // Obtener el ID del evento de Google
  const { data: eventRecord, error } = await supabaseClient
    .from('google_calendar_events')
    .select('google_event_id')
    .eq('appointment_id', appointmentId)
    .single();

  if (error || !eventRecord) {
    throw new Error('Evento no encontrado en Google Calendar');
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventRecord.google_event_id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error eliminando evento: ${response.statusText}`);
  }

  // Eliminar la relación de la base de datos
  await supabaseClient
    .from('google_calendar_events')
    .delete()
    .eq('appointment_id', appointmentId);

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}