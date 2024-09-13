import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// export default clerkMiddleware((auth,req) => {
//     if(isProtectedRoute(req)){
//         auth().protect()
//     }
// });

const isPublicRoute = createRouteMatcher(["/", "/sitemap.xml", "/robots.txt"]);
// const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Match the PayPal webhook route
const isWebhookRoute = createRouteMatcher(["/api/paypal-webhook"]);

const isCheckCancellationsRoute = createRouteMatcher([
  "/api/check-cancellations",
]);

export default clerkMiddleware((auth, req) => {
  // Allow webhook, cancellation, sitemap, and robots.txt routes to bypass authentication
  if (
    isWebhookRoute(req) ||
    isCheckCancellationsRoute(req) ||
    isPublicRoute(req)
  ) {
    return;
  }

  if (!auth().userId && !isPublicRoute(req)) {
    return auth().redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
