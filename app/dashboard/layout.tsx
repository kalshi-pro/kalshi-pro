import { NavBar } from '../components/nav-bar';

export default function DashboardLayout({
  children,
  trades,
}: Readonly<{
  children: React.ReactNode;
  trades: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      {/* Fixed navigation sidebar */}

      <div className="flex-none">
        <NavBar />
      </div>

      {/* Main content area - scrollable */}
      <main className="bg-dashboard-background flex-1 overflow-y-auto border-l-1 border-black/10 border-opacity-85 dark:border-white/10">
        {children}
        {trades}
      </main>
    </div>
  );
}
