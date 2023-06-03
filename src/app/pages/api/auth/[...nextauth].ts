//any requests made to this file will be handled by next-auth
import { authOptions } from "@component/app/lib/validations/auth";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions)