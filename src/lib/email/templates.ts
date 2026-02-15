interface LeadData {
  name: string;
  email: string;
  phone: string;
  city?: string;
  model?: string;
  message?: string;
  source?: string;
}

export function newLeadNotificationEmail(lead: LeadData): { subject: string; html: string } {
  const subject = `New Lead: ${lead.name} - ${lead.city || 'Unknown City'}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Lead Received</h1>
  </div>

  <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #64748b;">Name</strong><br>
          <span style="font-size: 16px;">${lead.name}</span>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #64748b;">Email</strong><br>
          <a href="mailto:${lead.email}" style="color: #2563eb; text-decoration: none;">${lead.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #64748b;">Phone</strong><br>
          <a href="tel:${lead.phone}" style="color: #2563eb; text-decoration: none;">${lead.phone}</a>
        </td>
      </tr>
      ${lead.city ? `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #64748b;">City</strong><br>
          <span>${lead.city}</span>
        </td>
      </tr>
      ` : ''}
      ${lead.model ? `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #64748b;">Interested In</strong><br>
          <span>${lead.model}</span>
        </td>
      </tr>
      ` : ''}
      ${lead.message ? `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #64748b;">Message</strong><br>
          <span>${lead.message}</span>
        </td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 12px 0;">
          <strong style="color: #64748b;">Source</strong><br>
          <span>${lead.source || 'Website'}</span>
        </td>
      </tr>
    </table>

    <div style="margin-top: 24px; text-align: center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/leads"
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
        View in Admin Panel
      </a>
    </div>
  </div>

  <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
    This is an automated notification from Guru Rani EV
  </p>
</body>
</html>
  `.trim();

  return { subject, html };
}

export function customerConfirmationEmail(lead: LeadData): { subject: string; html: string } {
  const subject = 'Thank you for your enquiry - Guru Rani EV';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Guru Rani EV</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Ride the Future</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #1a365d; margin-top: 0;">Hi ${lead.name},</h2>

    <p>Thank you for your interest in Guru Rani electric scooters! We've received your enquiry and our team will get back to you within 24 hours.</p>

    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <h3 style="margin-top: 0; color: #1a365d;">Your Enquiry Details</h3>
      <p style="margin: 8px 0;"><strong>Email:</strong> ${lead.email}</p>
      <p style="margin: 8px 0;"><strong>Phone:</strong> ${lead.phone}</p>
      ${lead.model ? `<p style="margin: 8px 0;"><strong>Model:</strong> ${lead.model}</p>` : ''}
      ${lead.city ? `<p style="margin: 8px 0;"><strong>City:</strong> ${lead.city}</p>` : ''}
    </div>

    <p>In the meantime, feel free to:</p>
    <ul style="padding-left: 20px;">
      <li>Explore our <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/models" style="color: #2563eb;">scooter models</a></li>
      <li>Find a <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dealers" style="color: #2563eb;">dealer near you</a></li>
      <li>Book a <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/test-ride" style="color: #2563eb;">test ride</a></li>
    </ul>

    <p>If you have any urgent questions, feel free to call us at <a href="tel:+911234567890" style="color: #2563eb;">+91 12345 67890</a>.</p>

    <p style="margin-bottom: 0;">Best regards,<br><strong>The Guru Rani Team</strong></p>
  </div>

  <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
    <p>© ${new Date().getFullYear()} Guru Rani EV. All rights reserved.</p>
    <p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #64748b;">Website</a> |
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/support" style="color: #64748b;">Support</a>
    </p>
  </div>
</body>
</html>
  `.trim();

  return { subject, html };
}
