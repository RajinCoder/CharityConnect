export default async function FollowingPage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  return <h1>{username}s Following Page</h1>;
}
