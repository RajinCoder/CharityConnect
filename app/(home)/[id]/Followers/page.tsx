export default async function FollowersPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <h1>{id}s Followers Page</h1>;
}
