import { NextResponse } from 'next/server';

export const badRequest = (message: string) => NextResponse.json({ error: 'bad_request', message, statusCode: 400 }, { status: 400 });
export const unauthorized = () => NextResponse.json({ error: 'unauthorized', message: 'Please log in to continue.', statusCode: 401 }, { status: 401 });
export const forbidden = () => NextResponse.json({ error: 'forbidden', message: 'You do not have permission to perform this action.', statusCode: 403 }, { status: 403 });
export const notFound = (message = 'Resource not found.') => NextResponse.json({ error: 'not_found', message, statusCode: 404 }, { status: 404 });

