import NextAuth from "next-auth";
import spotifyProvider from "next-auth/providers/spotify";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    spotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async sessionStorage({ token, account, user }) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, //we are handling expiry times in Milliseconds hence * 1000
        };
      }

      //return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }
      //Access token has expired, so we need to refresh it
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      console.log("ASYNC IN NEXTAUTH SETTING")
      session.user.accessToken = token.accessToken;
      console.log('A- Your access token is ' + token.accessToken);
      session.user.refreshToken = token.refreshToken;
      console.log('A- Your refresh token is ' + token.refreshToken);
      session.user.username = token.username;
      console.log('A- Your username token is ' + token.username);

      return session;
    },
  },
});