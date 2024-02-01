import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createEventSchema = z.object({
  title: z.string().min(3).max(255),
  start: z.string().min(20),
  end: z.string().min(20),
});

export async function GET(response: NextResponse) {
  try {
    const events = await prisma.event.findMany();

    if (!events) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching event from the database:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createEventSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.errors, { status: 400 });
  }

  const newEvent = await prisma.event.create({
    data: { title: body.title, start: body.start, end: body.end },
  });

  return NextResponse.json(newEvent, { status: 201 });
}
