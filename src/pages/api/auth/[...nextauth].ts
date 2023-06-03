//any requests made to this file will be handled by next-autj

import { authOptions } from "@component/lib/validations/auth";
import NextAuth from "next-auth/next";

export default NextAuth(authOptions)