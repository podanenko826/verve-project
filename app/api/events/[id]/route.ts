import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

const Status = z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']);

const schema = z.object({
  title: z.string().min(3).max(255),
  start: z.string().min(20).max(50),
  end: z.string().min(20).max(50),
  status: Status.default('OPEN'),
  accountId: z.string(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

    const event = await prisma.event.findUnique({
      where: {
        event_id: parseInt(params.id),
        accountId: session?.user.id,
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event from the database:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    const body = await request.json();

    // Check if request body is present and valid JSON
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid or missing request body' },
        { status: 400 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: 'User is not authenticated' },
        { status: 201 }
      );
    }

    body.accountId = session.user.id;

    const validation = schema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const eventId = parseInt(params.id);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'Invalid event ID' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { event_id: parseInt(params.id), accountId: session.user.id },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Update the event with the new data from the request body
    const updatedEvent = await prisma.event.update({
      where: { event_id: parseInt(params.id) },
      data: {
        title: body.title,
        start: body.start,
        end: body.end,
        status: body.status,
        accountId: body.accountId,
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const event = await prisma.event.findUnique({
    where: { event_id: parseInt(params.id) },
  });
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }

  await prisma.event.delete({
    where: { event_id: event.event_id },
  });

  return NextResponse.json({});
}
