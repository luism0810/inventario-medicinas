import { json } from '@sveltejs/kit';

export const GET = ({ locals }: any) => {
  return json({ user: locals?.user ?? null });
};