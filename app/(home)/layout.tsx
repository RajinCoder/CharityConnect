import HomeNavBar from "./Navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <HomeNavBar />

      <main className="flex-1">{children}</main>
    </div>
  );
}
