// utils
import { hashPassword } from "../auth/hash-password";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    omit: {
      user: {
        password: true,
      },
    },
  }).$extends({
    query: {
      user: {
        // create
        async create({ model, operation, args, query }) {
          if (args.data.password) {
            const hashedPassword = await hashPassword(
              args.data.password as string
            );
            args.data.password = hashedPassword;
          }
          return query(args);
        },

        // update
        async update({ model, operation, args, query }) {
          if (args.data.password) {
            const hashedPassword = await hashPassword(
              args.data.password as string
            );
            args.data.password = hashedPassword;
          }
          args.data.updatedAt = new Date();
          return query(args);
        },
      },
    },
  });
};

export type ExtendedPrismaClient = ReturnType<typeof prismaClientSingleton>;

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
