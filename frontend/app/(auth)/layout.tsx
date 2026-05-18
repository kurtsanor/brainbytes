import AuthNav from "./auth-nav";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen items-center p-5 justify-center bg-white/50 bg-[linear-gradient(#f9f9f9_1px,transparent_1px),linear-gradient(to_right,#f9f9f9_1px,#ffffff_1px)] bg-size-[54px_54px]">
      {/* Sign In & Sign Up Switch */}
      <AuthNav />
      {/* Inner Form */}
      {children}
    </div>
  );
};

export default AuthLayout;
