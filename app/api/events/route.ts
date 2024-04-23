import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

const createEventSchema = z.object({
  title: z.string().min(3).max(255),
  start: z.string().min(20),
  end: z.string().min(20),
  accountId: z.string(),
});

export async function GET(response: NextResponse) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: 'User is not authenticated' },
      { status: 201 }
    );
  }

  console.log('Session: ', session);

  try {
    if (session.user.email !== null) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (user) {
        session.user.id = user.id;
      }
    }
    // Fetch all events related to the user's account
    const allEvents = await prisma.event.findMany();

    console.log('User Events:', allEvents); // Log the user events for debugging

    console.log(session.user.id);
    if (allEvents.length) {
      const openEvents = allEvents.filter(
        (event) => event.status !== Status.CLOSED
      );

      const userEvents = openEvents.filter(
        (event) => event.accountId === session.user.id
      );

      if (userEvents.length) {
        return NextResponse.json(userEvents);
      }
    } else {
      return NextResponse.json({});
    }
    // Filter events based on status

    // console.log('openEvents: ', openEvents);

    // console.log('userEvents: ', userEvents);
  } catch (error) {
    console.error('Error fetching events from the database:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: 'User is not authenticated' },
      { status: 201 }
    );
  }

  try {
    if (session.user.email !== null) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      if (user) {
        session.user.id = user.id;
      }

      console.log(session.user.id);
    }

    const body = await request.json();

    body.accountId = session.user.id.toString();
    console.log(body);

    const validation = createEventSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title: body.title,
        start: body.start,
        end: body.end,
        accountId: session.user.id,
      },
    });
    if (!newEvent) {
      return NextResponse.json('Something went wrong', { status: 404 });
    }

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error fetching events from the database:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
