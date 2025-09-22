// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)", 
  "/sign-up(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  console.log('Route passing through middleware', req.nextUrl.pathname);
  if (!isPublicRoute(req)) {
    console.log('Protecting this Route', req.nextUrl.pathname);
    await auth.protect();
  } else {
    console.log('That Route is public, nothing to worry about', req.nextUrl.pathname);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}