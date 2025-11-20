import { Register } from "@/Controllers";
import { useRouter } from "next/navigation";

export function Signup(props: any) {
	const router = useRouter();

	async function handleSignup(e) {
		e.preventDefault();
		const email = document.getElementById("email").value;
		const username = document.getElementById("username").value;
		const password = document.getElementById("password").value;

		try {
			await Register(email, username, password);
			console.log("successful registration!");
			router.push("/");
		} catch (err) {
			console.log("Registration error:", err);
		}
	}

	return (
		<div style={{
      		minHeight: "80vh",
      		display: "flex",
      		justifyContent: "center",
      		alignItems: "center",
      		padding: "2rem",
    		}}>
      		<form
        	id="createAccount"
        	onSubmit={handleSignup}
        	style={{
          	display: "flex",
          	flexDirection: "column",
          	gap: "1rem",
          	padding: "2rem",
          	backgroundColor: "#fff",
          	borderRadius: "8px",
          	boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          	width: "100%",
          	maxWidth: "400px",
       		 }}
      		>
		<label htmlFor="email">Email</label>
		<input type="email" id="email" name="email" style ={{border: "1px solid #000"}} required />
		<label htmlFor="username">Username</label>
		<input type="text" id="username" name="username" style ={{border: "1px solid #000"}} required />
		<label htmlFor="password">Password</label>
		<input type="password" id="password" name="password" style ={{border: "1px solid #000"}} required />
		<button type="submit">Sign up</button>
		</form>
		</div>
	);
}
