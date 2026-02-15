import { NextResponse } from 'next/server';
import { leadsService } from '@/modules/leads/leads.service';
import { createLeadSchema } from '@/modules/leads/leads.validation';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const result = createLeadSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Submit lead with email notifications
    const response = await leadsService.submitLead(result.data);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    logger.error({ error }, 'Failed to create lead');
    return NextResponse.json(
      { error: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}
