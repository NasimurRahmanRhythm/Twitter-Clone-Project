import { dbConnect } from "@/main/libs/db";
import { createOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
export function handleRequest({ GET, POST, DELETE, PATCH, PUT }) {
  const unknownHandler = (_, res) => res.status(404).send("method not found");
  return async (req, res) => {
    await dbConnect();
    const session = await getServerSession(req, res, createOptions(req));
    const isUserRegistration = req.url === "/api/user" && req.method === "POST";
    if (!session && req.method !== "GET" && !isUserRegistration) {
      return res
        .status(401)
        .json({ error: "you must be logged in to perform this request" });
    }
    let handler;
    switch (req.method) {
      case "GET":
        handler = GET || unknownHandler;
        break;
      case "POST":
        handler = POST || unknownHandler;
        break;
      case "DELETE":
        handler = DELETE || unknownHandler;
        break;
      case "PATCH":
        handler = PATCH || unknownHandler;
        break;
      case "PUT":
        handler = PUT || unknownHandler;
        break;
      default:
        handler = unknownHandler;
    }
    try {
      await handler(req, res);
    } catch (err) {
      console.log(err);
      res.status(err.status || 500).json({
        success: false,
        error: err.error || "something went wrong",
        data: err.data || {},
      });
    }
  };
}
