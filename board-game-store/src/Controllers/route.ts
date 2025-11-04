import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
				"email": res.email
			})
		});
		const resultData = await userResponse.json();
		console.log(resultData);

		const validPass = await bcrypt.compare(res.password, resultData.body.password);
		if (validPass) {
			console.log("valid password");
		} else {
			console.log("invalid password");
			return Response.json({message: "Invalid password!"}, {status: 401});
		}

		const token = jwt.sign(
			{
				username: resultData.body.username,
				email: resultData.body.email,
				loggedIn: true
			},
			JWT_SECRET,
			{ expiresIn: "24h" }
		);
	
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
