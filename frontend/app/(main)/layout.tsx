import Sidebar from "./sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <main className="flex-1 flex overflow-auto justify-center border">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
