import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

// NextAuth 설정
export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // 세션에 사용자 정보 추가
    async session({ session, token }) {
      if (session.user) {
        // GitHub 사용자명 추가
        session.user.id = token.sub!;
        // @ts-ignore - GitHub 프로필 정보 추가
        session.user.username = token.username || session.user.email?.split('@')[0];
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      // 첫 로그인시 GitHub 프로필 정보 저장
      if (account && profile) {
        // @ts-ignore - GitHub 프로필 정보
        token.username = profile.login;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };