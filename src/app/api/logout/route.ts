import { deleteSession } from '@/services/auth.service';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  await deleteSession();
  return NextResponse.redirect(new URL('/login', request.url), {
    status: 303, // See Other (forces a GET redirect)
  });
}
