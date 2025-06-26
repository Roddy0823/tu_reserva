
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useBusiness } from '@/hooks/useBusiness';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import BookingFlow from '@/components/BookingFlow';

const BookingPublic = () => {
  const { businessSlug } = useParams<{ businessSlug: string }>();
  
  if (!businessSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">URL no válida</h1>
          <p className="text-gray-600">La URL de reserva no es válida.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <BookingFlow businessSlug={businessSlug} />
      </div>
    </div>
  );
};

export default BookingPublic;
