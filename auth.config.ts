import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnScoreDisplay = nextUrl.pathname.startsWith('/score-display');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnScoreDisplay) {
        return true; // Allow access to score-display for all users
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: [],
  secret: 'LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=',
} satisfies NextAuthConfig;
