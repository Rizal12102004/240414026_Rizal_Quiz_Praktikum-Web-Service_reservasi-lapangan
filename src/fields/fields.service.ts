import { Injectable, NotFoundException } from '@nestjs/common';
import { fields, bookings } from '../data/store';

@Injectable()
export class FieldsService {

  // Menampilkan semua lapangan
  getAllFields() {
    return fields;
  }

  // Menampilkan detail lapangan
  getFieldById(id: number) {
    const field = fields.find(item => item.id === id);

    if (!field) {
      throw new NotFoundException('Lapangan tidak ditemukan');
    }

    return field;
  }

  // Mengecek ketersediaan jadwal
  getAvailability(id: number, date: string) {

    this.getFieldById(id);

    const reservedSlots = bookings.filter(booking =>
      booking.fieldId === id &&
      booking.date === date &&
      booking.status !== 'CANCELLED'
    );

    return {
      fieldId: id,
      date: date,
      bookedSlots: reservedSlots.map(booking => ({
        bookingId: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime,
      })),
    };
  }
}