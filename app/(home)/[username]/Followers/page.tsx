export default async function FollowersPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  return <h1>{username}s Followers Page</h1>;
}
