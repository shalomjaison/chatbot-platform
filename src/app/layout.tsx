import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata = { title: "Chatbot Platform" };

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-neutral-100 text-neutral-900">{children}</body>
      </html>
    </ClerkProvider>
  );
} 
