import { postHelper } from '@/api/helpers/request';
import { postUser } from '@/api/services/userService';
import { User } from '@prisma/client';
import { NextResponse } from 'next/server';


// POST request

export async function POST(req: Request): Promise<NextResponse> {

  const body = await req.json();
  const user: Omit<User, 'user_id'> = body;

  return await postHelper('user', postUser, user);

}