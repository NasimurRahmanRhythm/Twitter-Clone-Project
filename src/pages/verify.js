import UserModel from "@/main/models/user.schema";
import Link from "next/link";

export async function getServerSideProps(ctx) {
  const { id, token } = ctx.query;
  console.log(id, token);
  let user = await UserModel.findById(id);
  let verified = false;
  if (!user.isVerified && user && user.verificationToken === token) {
    console.log("hello");
    try {
      user.verificationToken = null;
      user.isVerified = true;
      await user.save();
      verified = true;
    } catch (err) {
      console.log(err);
    }
  }
  return {
    props: JSON.parse(
      JSON.stringify({
        verified,
      })
    ),
  };
}

export default function verify({ verified }) {
  return (
    <div className="center screen">
      {verified ? (
        <div className="col center">
          <h1>verified successfully</h1>
          <br />
          <Link href="/?page=login" className="btn btn-bordered btn-ghost">
            LOGIN
          </Link>
        </div>
      ) : (
        <h1>404 Not found</h1>
      )}
    </div>
  );
}
