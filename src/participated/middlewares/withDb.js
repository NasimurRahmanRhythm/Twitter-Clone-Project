import { dbConnect } from "@/main/libs/db";

export function withDb(func) {
  return async (...args) => {
    await dbConnect();
    return func(...args);
  };
}
