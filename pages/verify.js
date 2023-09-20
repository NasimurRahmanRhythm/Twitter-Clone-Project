import User from "@/src/models/User";
import Link from "next/link";


export async function getServerSideProps(ctx){
    const { id,token } = ctx.query;
    console.log("The id is " + id);
    console.log("The token is " + token);
    let user = await User.findById(id);
    let verified = false;
    console.log("User is " + user);
    if(!user.isVerified && user && user.verificationToken === token){
        console.log("I am herree");
        try{
            user.verificationToken = null,
            user.isVerified = true,
            await user.save(),
            verified = true
        }
        catch(error){
            console.log("Verify.js error " + error);
        }
    }
    return {
        props: JSON.parse(
            JSON.stringify({
                verified
            })
        ),
    };
}

export default function verify({verified}) {
    return <div className="center fullhw">
        {verified ? <div className="flex-col center">
            <h1>
                Account verification is sucessful...
            </h1>
            <br/>
            <Link href="/?page=login" className="button">Log In</Link>
            </div> : <h1>404 not found</h1>}
    </div>;
}