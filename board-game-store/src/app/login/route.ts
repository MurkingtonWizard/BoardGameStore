import {cookies} from "next/headers";
import {NextResponse} from "next/server";

const JWT_SECRET = "placeholder";

export async function POST(request: Request) {
	try {
		const	res = await request.json()
		console.log(res)

		const userResponse = await fetch("https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Login",
																		 {
			method: 'POST',
			body: JSON.stringify({
				"email": res.email,
				"password": res.password
			})
		});
		const resultData = await userResponse.json();
		console.log(resultData);

		if (resultData.statusCode != 200) {
			throw new Error("Incorrect username or password!");
		}

		const token = resultData.body.token;			
	
		const isProduction = process.env.NODE_ENV === "production";
		return NextResponse.json(
			{message: "Logged in!", token},
			{status: 200,
				headers : {
					"Set-Cookie": `token=${token}; HttpOnly;Path=/;Max-Age=86400;SameSite=Strict;${isProduction ? "Secure" : ""}`,
				},
			}
		);

	} catch (err) {
		console.log("Login error:", err);
		return Response.json({message: "Login error" }, {status: 500});
	}
}
