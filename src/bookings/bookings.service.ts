import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { bookings, fields, Booking } from '../data/store';

@Injectable()
export class BookingsService {

  // Membuat reservasi baru
  createBooking(data: any) {

    const {
      userId,
      fieldId,
      date,
      startTime,
      endTime,
      customerName,
    } = data;

    // Memeriksa data wajib
    if (
      !userId ||
      !fieldId ||
      !date ||
      !startTime ||
      !endTime ||
      !customerName
    ) {
      throw new BadRequestException(
        'Semua data reservasi wajib diisi',
      );
    }

    // Memeriksa format tanggal
    if (
      typeof date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      new Date(`${date}T00:00:00`).toISOString().slice(0, 10) !== date
    ) {
      throw new BadRequestException('Format tanggal tidak valid');
    }

    // Memeriksa format jam
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      typeof startTime !== 'string' ||
      typeof endTime !== 'string' ||
      !timePattern.test(startTime) ||
      !timePattern.test(endTime)
    ) {
      throw new BadRequestException('Format jam harus HH:mm');
    }

    // Jam selesai harus lebih besar dari jam mulai
    if (startTime >= endTime) {
      throw new BadRequestException(
        'Jam selesai harus lebih besar dari jam mulai',
      );
    }

    // Mencari lapangan
    const field = fields.find(
      item => item.id === Number(fieldId),
    );

    if (!field) {
      throw new NotFoundException('Lapangan tidak ditemukan');
    }

    // Memeriksa status lapangan
    if (field.status !== 'ACTIVE') {
      throw new ConflictException('Lapangan tidak tersedia');
    }

    // Memeriksa jadwal yang bertabrakan
    const conflict = bookings.some(booking =>
      booking.fieldId === Number(fieldId) &&
      booking.date === date &&
      booking.status !== 'CANCELLED' &&
      startTime < booking.endTime &&
      endTime > booking.startTime
    );

    if (conflict) {
      throw new ConflictException(
        'Jadwal lapangan sudah dipesan',
      );
    }

    // Membuat ID booking baru
    const newId =
      bookings.length > 0
        ? Math.max(...bookings.map(item => item.id)) + 1
        : 1;

    // Membuat data reservasi
    const newBooking: Booking = {
      id: newId,
      userId: String(userId),
      fieldId: Number(fieldId),
      date,
      startTime,
      endTime,
      customerName,
      status: 'BOOKED',
    };

    // Menyimpan ke array
    bookings.push(newBooking);

    return {
      message: 'Reservasi berhasil dibuat',
      data: newBooking,
    };
  }

  // Melihat detail reservasi
  getBookingById(id: number) {

    const booking = bookings.find(
      item => item.id === id,
    );

    if (!booking) {
      throw new NotFoundException(
        'Reservasi tidak ditemukan',
      );
    }

    return booking;
  }

  // Melihat reservasi berdasarkan pengguna
  getUserBookings(userId: string) {

    return bookings.filter(
      item => item.userId === userId,
    );
  }

  // Membatalkan reservasi
  cancelBooking(id: number) {

    const booking = this.getBookingById(id);

    if (booking.status === 'CANCELLED') {
      throw new ConflictException(
        'Reservasi sudah dibatalkan',
      );
    }

    if (booking.status === 'COMPLETED') {
      throw new ConflictException(
        'Reservasi yang sudah selesai tidak dapat dibatalkan',
      );
    }

    booking.status = 'CANCELLED';

    return {
      message: 'Reservasi berhasil dibatalkan',
      data: booking,
    };
  }
}