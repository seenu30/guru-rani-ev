import { NextResponse } from 'next/server';
import { bookingsService } from '@/modules/bookings/bookings.service';
import { createBookingSchema } from '@/modules/bookings/bookings.validation';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = createBookingSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Submit booking with email notifications
    const response = await bookingsService.submitBooking(result.data);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create booking');
    return NextResponse.json(
      { error: 'Failed to book test ride' },
      { status: 500 }
    );
  }
}
