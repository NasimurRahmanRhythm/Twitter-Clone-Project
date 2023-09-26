import serverAuth from "@/src/libs/serverAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    //console.log({req});
    //console.log({res});
    const { currentUser } = await serverAuth(req,res);
    console.log("Current.js Current user is ", + currentUser);
    return res.status(200).json(currentUser);
  } catch (error) {
    console.log("My error is " + error);
    return res.status(400).end();
  }
}