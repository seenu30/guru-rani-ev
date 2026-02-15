import { bookingsQueries } from './bookings.queries';
import { NotFoundError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email';
import type { CreateBookingInput, QueryBookingsInput, UpdateBookingStatusInput } from './bookings.validation';

export const bookingsService = {
  /**
   * Submit a new test ride booking from website form
   */
  async submitBooking(data: CreateBookingInput) {
    logger.info({ email: data.email, dealerId: data.dealerId }, 'New test ride booking');

    const booking = await bookingsQueries.create(data);

    // Get dealer info for the email
    const dealer = await bookingsQueries.getDealerById(data.dealerId);

    // Send confirmation email to customer
    const emailData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.bookingDate,
      timeSlot: data.timeSlot,
      dealer: dealer ? {
        name: dealer.name,
        city: dealer.city,
        address: dealer.address,
        phone: dealer.phone,
      } : null,
    };

    // Send confirmation to customer
    const { subject, html } = testRideConfirmationEmail(emailData);
    sendEmail({ to: data.email, subject, html }).catch((err) => {
      logger.error({ err, bookingId: booking.id }, 'Failed to send booking confirmation');
    });

    // Send notification to dealer if they have an email
    if (dealer?.email) {
      const { subject: dealerSubject, html: dealerHtml } = dealerNotificationEmail(emailData);
      sendEmail({ to: dealer.email, subject: dealerSubject, html: dealerHtml }).catch((err) => {
        logger.error({ err, bookingId: booking.id }, 'Failed to send dealer notification');
      });
    }

    return {
      id: booking.id,
      message: 'Your test ride has been booked! Check your email for confirmation.',
    };
  },

  /**
   * Get all bookings with pagination (admin)
   */
  async getBookings(params: QueryBookingsInput) {
    return bookingsQueries.getAll(params);
  },

  /**
   * Get a single booking by ID (admin)
   */
  async getBookingById(id: string) {
    const booking = await bookingsQueries.getById(id);

    if (!booking) {
      throw new NotFoundError('Booking');
    }

    return booking;
  },

  /**
   * Update booking status (admin)
   */
  async updateBookingStatus(id: string, data: UpdateBookingStatusInput) {
    const booking = await bookingsQueries.getById(id);

    if (!booking) {
      throw new NotFoundError('Booking');
    }

    logger.info({ bookingId: id, newStatus: data.status }, 'Booking status updated');

    return bookingsQueries.updateStatus(id, data);
  },

  /**
   * Delete a booking (admin)
   */
  async deleteBooking(id: string) {
    const booking = await bookingsQueries.getById(id);

    if (!booking) {
      throw new NotFoundError('Booking');
    }

    await bookingsQueries.delete(id);

    logger.info({ bookingId: id }, 'Booking deleted');
  },
};

// Email templates
function testRideConfirmationEmail(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  dealer: { name: string; city: string; address: string; phone: string } | null;
}) {
  const formattedDate = new Date(data.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    subject: 'Test Ride Booking Confirmed - Guru Rani Electric',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #00A86B; margin: 0;">Guru Rani Electric</h1>
        </div>

        <div style="background: linear-gradient(135deg, #00A86B 0%, #00C853 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0;">Test Ride Confirmed!</h2>
          <p style="margin: 0; opacity: 0.9;">Get ready for an electrifying experience</p>
        </div>

        <p>Hi ${data.name},</p>

        <p>Your test ride has been booked successfully! Here are your booking details:</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 0 0 10px 0;"><strong>Time:</strong> ${data.timeSlot}</p>
          ${data.dealer ? `
          <p style="margin: 0 0 10px 0;"><strong>Dealer:</strong> ${data.dealer.name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${data.dealer.address}, ${data.dealer.city}</p>
          <p style="margin: 0;"><strong>Contact:</strong> ${data.dealer.phone}</p>
          ` : ''}
        </div>

        <h3 style="color: #00A86B;">What to bring:</h3>
        <ul>
          <li>Valid driving license</li>
          <li>A helmet (we have spares if needed)</li>
        </ul>

        <p>If you need to reschedule, please contact the dealer directly or reply to this email.</p>

        <p>We look forward to seeing you!</p>

        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>Team Guru Rani</strong>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 12px; color: #666; text-align: center;">
          Guru Rani Electric Scooters<br>
          Gangavaram, Andhra Pradesh<br>
          <a href="https://gururani.in" style="color: #00A86B;">www.gururani.in</a>
        </p>
      </body>
      </html>
    `,
  };
}

function dealerNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  dealer: { name: string; city: string; address: string; phone: string } | null;
}) {
  const formattedDate = new Date(data.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    subject: `New Test Ride Booking - ${data.name} on ${formattedDate}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #00A86B;">New Test Ride Booking</h2>

        <p>A new test ride has been booked at your location:</p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0;">Customer Details</h3>
          <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> <a href="tel:+91${data.phone}">+91 ${data.phone}</a></p>
          <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        </div>

        <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0;">Booking Details</h3>
          <p style="margin: 0 0 10px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 0;"><strong>Time Slot:</strong> ${data.timeSlot}</p>
        </div>

        <p>Please ensure the scooter is ready and available for the test ride.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

        <p style="font-size: 12px; color: #666;">
          This is an automated notification from Guru Rani Electric booking system.
        </p>
      </body>
      </html>
    `,
  };
}

export default bookingsService;
