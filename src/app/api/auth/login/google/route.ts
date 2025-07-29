export async function GET() {
  console.log('GET request to /api/auth/login/google');
  return Response.json({ success: true });
}
