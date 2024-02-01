import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createEventSchema = z.object({
  title: z.string().min(3).max(255),
  start: z.string().min(20),
  end: z.string().min(20),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        event_id: parseInt(params.id),
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
  const body = await request.json();
  const validation = createEventSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, {
      status: 400,
    });
  }

  const event = await prisma.event.findUnique({
    where: { event_id: parseInt(params.id) },
  });

  const updatedEvent = await prisma.event.update({
    where: { event_id: event?.event_id },
    data: {
      title: event?.title,
      start: event?.start,
      end: event?.end,
    },
  });

  return NextResponse.json(updatedEvent);
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
