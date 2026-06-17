export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8F7FF] via-[#FAFAFA] to-[#F3F0FF] px-4">
      {children}
    </div>
  );
}