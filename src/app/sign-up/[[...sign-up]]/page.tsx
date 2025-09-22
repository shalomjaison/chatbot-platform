import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="min-h-screen flex justify-center items-center p-6">
      <SignUp forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard"/>
    </main>
  );
}