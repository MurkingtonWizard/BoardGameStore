import { Register } from "@/Controllers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent} from "react";

export function RegisterPage(props: any) {
	const router = useRouter();

	async function handleSignup(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const email = (document.getElementById("email") as HTMLInputElement).value;
			const username = (document.getElementById("username") as HTMLInputElement).value;
			const password = (document.getElementById("password") as HTMLInputElement).value;
			await Register(email, username, password);
			console.log("successful registration!");
			router.push("/");
		} catch (err) {
			console.log("Registration error:", err);
		}
	}

	return (
		<main className="page-col account">
      		<form
        	id="createAccount"
        	onSubmit={handleSignup}>
				<label htmlFor="email">Email</label>
				<input type="email" id="email" name="email" style ={{border: "1px solid #000"}} required />
				<label htmlFor="username">Username</label>
				<input type="text" id="username" name="username" style ={{border: "1px solid #000"}} required />
				<label htmlFor="password">Password</label>
				<input type="password" id="password" name="password" style ={{border: "1px solid #000"}} required />
				<button type="submit">Sign up</button>
			</form>
		
			<div>
				Already have an account? <Link href="/login" className="inline-link">Login</Link>
			</div>
		</main>
	);
}
