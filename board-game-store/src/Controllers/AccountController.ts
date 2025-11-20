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

export const Register = async(email: string, username: string, password: string): Promise<boolean> => {
	try {
		const userResponse = await fetch("https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/Signup", {
			method: 'POST',
			body: JSON.stringify({
				"email": email,
				"password": password,
				"username": username
			})
		});
		const resultData = await userResponse.json();
		if (resultData.statusCode != 200) {
			throw new Error("Could not create account!");
		}
		return true;
	} catch (err) {
		console.log("Account creation error:", err);
		return false;
	}

}

export const RecordFunds = async (amount: number): Promise<boolean> => {
	if(!IsLoggedIn()) return false;
	try {
		const userResponse = await fetch("https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/RecordFunds", {
			method: 'POST',
			body: JSON.stringify({
				"token": localStorage.getItem('token'),
				amount
			})
		});
		const resultData = await userResponse.json();

		return resultData.statusCode === 200;
	} catch (err) {
		console.log("Login error:", err);
		return false;
	}
}

export const IsLoggedIn = () => {
	let token = localStorage.getItem('token');
	return token !== null ? true : false
}

export const GetAccountInfo = async () => {
	if (!IsLoggedIn()) return null;

	try {
		const response = await fetch("https://gndbiwggpk.execute-api.us-east-2.amazonaws.com/Initial/AccountInfo", {
			method: "POST",
			body: JSON.stringify({
				token: localStorage.getItem("token")
			})
		});

		const result = await response.json();
		if (result.statusCode !== 200) return null;

		return result.body;

	} catch (err) {
		console.log("AccountInfo error:", err);
		return null;
	}
};

export const Logout = () => {
	localStorage.removeItem("token");
};
