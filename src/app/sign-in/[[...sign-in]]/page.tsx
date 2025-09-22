import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <main className="min-h-screen flex justify-center items-center p-6">
      <SignIn forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard"/>
    </main>
);
}