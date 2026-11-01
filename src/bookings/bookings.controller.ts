import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';

@Controller()
export class BookingsController {

  constructor(
    private readonly bookingsService: BookingsService,
  ) {}

  // POST /bookings
  @Post('bookings')
  createBooking(@Body() body: any) {
    return this.bookingsService.createBooking(body);
  }

  // GET /bookings/:id
  @Get('bookings/:id')
  getBookingById(@Param('id') id: string) {
    return this.bookingsService.getBookingById(Number(id));
  }

  // GET /users/:userId/bookings
  @Get('users/:userId/bookings')
  getUserBookings(@Param('userId') userId: string) {
    return this.bookingsService.getUserBookings(userId);
  }

  // PATCH /bookings/:id/cancel
  @Patch('bookings/:id/cancel')
  cancelBooking(@Param('id') id: string) {
    return this.bookingsService.cancelBooking(Number(id));
  }
}