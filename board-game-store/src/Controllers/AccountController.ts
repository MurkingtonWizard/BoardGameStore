export const Login = async (email: string, password: string): Promise<boolean> => {
	try {
		const userResponse = await fetch("https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Login", {
			method: 'POST',
			body: JSON.stringify({
				"email": email,
				"password": password
			})
		});
		const resultData = await userResponse.json();

		if (resultData.statusCode != 200) {
			throw new Error("Incorrect username or password!");
		}

		const token = resultData.body.token;
		console.log(token);			
	
		localStorage.setItem("token", token);
		return true;
	} catch (err) {
		console.log("Login error:", err);
		return false;
	}
}
