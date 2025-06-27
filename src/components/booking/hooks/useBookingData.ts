
import { useState } from 'react';
import { Service, StaffMember } from '@/types/database';

export interface BookingData {
  service?: Service;
  staffMember?: StaffMember;
  date?: Date;
  time?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export const useBookingData = () => {
  const [bookingData, setBookingData] = useState<BookingData>({});

  const updateBookingData = (updates: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...updates }));
  };

  const resetBookingData = () => {
    setBookingData({});
  };

  return {
    bookingData,
    setBookingData,
    updateBookingData,
    resetBookingData
  };
};
