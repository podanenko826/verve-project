import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export async function GET(response: NextResponse) {
  const session = await getServerSession();

  try {
    const allEvents = await prisma.event.findMany();

    if (session) {
      if (allEvents.length) {
        const openEvents = allEvents.filter(
          (event) => event.status !== Status.CLOSED
        );

        const userEvents = openEvents.filter(
          (event) => event.accountId === session?.user.id
        );

        if (userEvents.length) {
          return NextResponse.json(userEvents);
        }
      } else {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('Error fetching event from the database:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
