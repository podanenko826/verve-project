import { NextResponse } from 'next/server';
import React from 'react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Props {
  params: { id: number };
}

export const get = async ({ params: { id } }: Props) => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        event_id: id,
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
};
