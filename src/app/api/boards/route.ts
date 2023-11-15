export const runtime = "edge";

export const GET = async () => {
  const { results } = await process.env.DB.prepare(
    "SELECT * FROM boards"
  ).all();

  return new Response(JSON.stringify(results));
};
