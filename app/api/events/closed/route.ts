import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export async function GET(response: NextResponse) {
  try {
    const allEvents = await prisma.event.findMany();
    let events = [];

    for (let i = 0; i < allEvents.length; i++) {
      if (allEvents[i].status === Status.CLOSED) {
        events.push(allEvents[i]);
      }
    }

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
