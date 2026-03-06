import session from "express-session";
import prisma from "../db/prisma.js"
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const sessionConfig = () =>
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdFunction: undefined,
        dbRecordIdIsSessionId: true,
      }
    )
  });

export default sessionConfig;