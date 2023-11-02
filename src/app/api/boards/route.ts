export const GET = async () => {
  return new Response(
    JSON.stringify({
      name: "なんでも実況エッヂ",
      id: 1,
      boardKey: "liveedge",
    })
  );
};
