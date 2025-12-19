import { SvelteKitAuth } from "@auth/sveltekit";
import { ZodError } from "zod";
import Credentials from "@auth/sveltekit/providers/credentials";
import { signInSchema } from "$lib/zod";

async function getUserFromWS(email, password) {

  const response = await fetch("https://dealeredge.docscloud.net/auth/sign_in", {
  // const response = await fetch("http://localhost:3000/auth/sign_in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: { email, password } }),
  });
  
  const result = await response;
  const body = await result.json();
  const headers = result.headers;
  console.log("Headers:", headers);
  console.log("Body:", body);
  const accessToken = headers.get('authorization').split(' ')[1];
  
  if (!response.ok) {
    throw new Error("Invalid credentials.");
  }
  
  const user = body.user;
  if (!user) {
    throw new Error("Invalid credentials.");
  }

  // Ensure user.scopeable_type is valid
  const userTypes = ["User", "Admin", "Tenant", "Workspace"];
  if (!userTypes.includes(user.scopeable_type)) {
    throw new Error("Invalid user type.");
  }

  const expiry = headers.get('expiry');

  // Return user data along with tokens as flat fields
  return {
    id: user.id,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    first_name: user.first_name,
    last_name: user.last_name,
    scopeable_type: user.scopeable_type,
    accessToken: accessToken, // Flat field
    expiry: expiry,           // Flat field
  };

}

const providers = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "text", placeholder: "Email" },
      password: { label: "Password", type: "password", placeholder: "Password" },
    },
    authorize: async (credentials) => {
      try {
        const { email, password } = await signInSchema.parseAsync(credentials);

        const user = await getUserFromWS(email, password);
        if (!user) {
          throw new Error("Invalid credentials.");
        }
        console.log("User returned by authorize:", user); // Debugging log
        const userTypes = ["User", "Admin", "Tenant", "Workspace"];
        if (!userTypes.includes(user.scopeable_type)) {
          console.log("User type:", user.scopeable_type);
          throw new Error("Invalid user type.");
        }

        const userData = {
          id: user.id,
          email: user.email,
          name: user.name,
          first_name: user.first_name,
          last_name: user.last_name,
          user_type: user.scopeable_type,
          accessToken: user.accessToken,
          expiry: user.expiry
        };

        console.log("User data returned by authorize:", userData); // Debugging log
        return userData;

      } catch (error) {
        if (error instanceof ZodError) {
          return null;
        }
        console.error("Error in authorize:", error);
        return null;
      }
    },
  }),
];

export const { handle, signIn, signOut } = SvelteKitAuth({
  providers,
  session: {
    strategy: "jwt",
    // set the maxAge max of 30 minutes
    maxAge: 1800
  },
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.accessToken = user.accessToken;
        token.scopeable_type = user.scopeable_type;
        token.expiry = user.expiry;
      }
      
      return token;
    },
    async session({ session, token }) {      
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.first_name = token.first_name;
        session.user.last_name = token.last_name;
        session.user.accessToken = token.accessToken;
        session.user.scopeable_type = token.scopeable_type;
        session.user.expiry = token.expiry;
        
        // Calculate the remaining time until token expiration
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const maxAge = token.expiry - currentTime > 0 ? token.expiry - currentTime : 0;
        
        // Set session.maxAge and session.expires based on token.expiry
        session.maxAge = maxAge; // Duration in seconds
        session.expires = new Date(token.expiry * 1000).toISOString(); // Convert to ISO string
      }
      
      return session;
    },
  },    
});
