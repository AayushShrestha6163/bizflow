import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Topbar />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}