import { HttpStatusCode } from 'axios';

export async function POST(request: Request) {
  const { key } = await request.json();

  if (key === process.env.ACCESS_KEY) {
    return Response.json({ valid: true }, { status: HttpStatusCode.Ok });
  }

  return Response.json(
    { valid: false, message: 'Invalid key' },
    { status: HttpStatusCode.BadRequest }
  );
}
