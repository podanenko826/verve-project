import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, response: NextResponse) {
  const prisma = new PrismaClient();
  const session = await getServerSession();

  const { currentPassword, newPassword } = await request.json();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user.email!,
    },
  });
  if (!user)
    return NextResponse.json(
      { error: 'User is not authenticated' },
      { status: 401 }
    );
  if (!user.hashedPassword) {
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.hashedPassword = newPasswordHash;
  } else {
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.hashedPassword!
    );
    if (!isPasswordCorrect) {
      return new Response(
        JSON.stringify({ message: 'Current password is incorrect' }),
        { status: 401 }
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      hashedPassword: user.hashedPassword,
    },
  });

  return NextResponse.json(updatedUser, { status: 200 });
}
