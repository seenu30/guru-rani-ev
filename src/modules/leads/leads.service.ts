import { leadsQueries } from './leads.queries';
import { NotFoundError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { sendEmail } from '@/lib/email';
import { newLeadNotificationEmail, customerConfirmationEmail } from '@/lib/email/templates';
import type { CreateLeadInput, QueryLeadsInput, UpdateLeadStatusInput } from './leads.validation';

export const leadsService = {
  /**
   * Submit a new lead from website form
   */
  async submitLead(data: CreateLeadInput) {
    logger.info({ email: data.email, source: data.source }, 'New lead submission');

    const lead = await leadsQueries.create(data);

    // Send emails in the background (don't block the response)
    const emailData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      model: data.modelId,
      message: data.message,
      source: data.source,
    };

    // Send notification to sales team
    const salesEmail = process.env.SALES_TEAM_EMAIL;
    if (salesEmail) {
      const { subject, html } = newLeadNotificationEmail(emailData);
      sendEmail({ to: salesEmail, subject, html }).catch((err) => {
        logger.error({ err, leadId: lead.id }, 'Failed to send sales notification');
      });
    }

    // Send confirmation to customer
    const { subject, html } = customerConfirmationEmail(emailData);
    sendEmail({ to: data.email, subject, html }).catch((err) => {
      logger.error({ err, leadId: lead.id }, 'Failed to send customer confirmation');
    });

    return {
      id: lead.id,
      message: 'Thank you for your enquiry! Our team will contact you shortly.',
    };
  },

  /**
   * Get all leads with pagination (admin)
   */
  async getLeads(params: QueryLeadsInput) {
    return leadsQueries.getAll(params);
  },

  /**
   * Get a single lead by ID (admin)
   */
  async getLeadById(id: string) {
    const lead = await leadsQueries.getById(id);

    if (!lead) {
      throw new NotFoundError('Lead');
    }

    return lead;
  },

  /**
   * Update lead status (admin)
   */
  async updateLeadStatus(id: string, data: UpdateLeadStatusInput) {
    const lead = await leadsQueries.getById(id);

    if (!lead) {
      throw new NotFoundError('Lead');
    }

    logger.info({ leadId: id, newStatus: data.status }, 'Lead status updated');

    return leadsQueries.updateStatus(id, data);
  },

  /**
   * Delete a lead (admin)
   */
  async deleteLead(id: string) {
    const lead = await leadsQueries.getById(id);

    if (!lead) {
      throw new NotFoundError('Lead');
    }

    await leadsQueries.delete(id);

    logger.info({ leadId: id }, 'Lead deleted');
  },
};

export default leadsService;
