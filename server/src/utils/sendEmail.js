import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

// Pre-built templates used across the app
export const emailTemplates = {
  bookingConfirmed: (booking, property) => ({
    subject: `Booking Confirmed: ${property.title}`,
    html: `
      <h2>Your booking is confirmed!</h2>
      <p><strong>${property.title}</strong></p>
      <p>Check-in: ${new Date(booking.checkIn).toDateString()}</p>
      <p>Check-out: ${new Date(booking.checkOut).toDateString()}</p>
      <p>Total paid: ${booking.priceBreakdown.currency} ${booking.priceBreakdown.total}</p>
      <p>We hope you have a wonderful stay!</p>
    `,
  }),
  bookingCancelled: (booking, property) => ({
    subject: `Booking Cancelled: ${property.title}`,
    html: `
      <h2>Your booking has been cancelled</h2>
      <p><strong>${property.title}</strong></p>
      <p>Check-in: ${new Date(booking.checkIn).toDateString()}</p>
      <p>Refund amount: ${booking.priceBreakdown.currency} ${booking.refundAmount}</p>
    `,
  }),
  newBookingForHost: (booking, property, guest) => ({
    subject: `New Booking Request: ${property.title}`,
    html: `
      <h2>You have a new booking!</h2>
      <p>${guest.name} booked <strong>${property.title}</strong></p>
      <p>Check-in: ${new Date(booking.checkIn).toDateString()}</p>
      <p>Check-out: ${new Date(booking.checkOut).toDateString()}</p>
    `,
  }),
};
