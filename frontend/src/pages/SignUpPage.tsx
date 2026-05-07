const SignUpPage = () => {
  return (
    <div className="border border-neutral-200 w-115 flex flex-col bg-white p-5">
      {/* Header */}
      <h1 className="text-xl font-bold mb-1 tracking-tight">Sign Up</h1>
      <p className="tracking-tight">
        Enter your email below to create an account
      </p>
      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <p className="text-sm font-medium mt-4 mb-1.5">First name</p>
          <input
            type="text"
            placeholder="John"
            className="border border-neutral-200 px-3 py-1.5 tracking-tight bg-neutral-50"
          />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium mt-4 mb-1.5">Last name</p>
          <input
            type="text"
            placeholder="Doe"
            className="border border-neutral-200 px-3 py-1.5 tracking-tight bg-neutral-50"
          />
        </div>
      </div>
      <p className="text-sm font-medium mt-4 mb-1.5">Email</p>
      <input
        type="email"
        placeholder="you@example.com"
        className="border border-neutral-200 px-3 py-1.5 tracking-tight bg-neutral-50"
      />
      <p className="text-sm font-medium mt-4 mb-1.5">Password</p>
      <input
        type="password"
        placeholder="Password"
        className="border border-neutral-200 px-3 py-1.5 tracking-tight bg-neutral-50"
      />
      <p className="text-sm font-medium mt-4 mb-1.5">Confirm Password</p>
      <input
        type="password"
        placeholder="Confirm Password"
        className="border border-neutral-200 px-3 py-1.5 tracking-tight bg-neutral-50"
      />

      <button className="bg-black hover:bg-neutral-900 text-white p-1.5 mt-3 tracking-tight transition-colors">
        Create an account
      </button>
      {/* Divider */}
      <div className="border-t border-neutral-200 my-6" />
      <p className="text-xs text-center text-muted-foreground">
        By signing in, you agree to the Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default SignUpPage;
