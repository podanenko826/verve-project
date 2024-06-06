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

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: 'User is not authenticated' },
      { status: 401 }
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
      } else {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    } else {
      return NextResponse.json(
        { error: 'Email is not provided in session' },
        { status: 400 }
      );
    }

    const allEvents = await prisma.event.findMany();

    if (allEvents.length) {
      const openEvents = allEvents.filter(
        (event) => event.status !== Status.OPEN
      );

      const userEvents = openEvents.filter(
        (event) => event.accountId === session.user.id
      );

      if (userEvents.length) {
        return NextResponse.json(userEvents);
      } else {
        return NextResponse.json([], { status: 200 });
      }
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching event from the database:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
