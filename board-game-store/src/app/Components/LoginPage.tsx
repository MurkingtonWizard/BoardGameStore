import { Login } from "@/Controllers";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent} from "react";

export function LoginPage(props: any) {
	const router = useRouter();

	async function handleLogin(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		try {
			const email = (document.getElementById("email") as HTMLInputElement).value;
			const password = (document.getElementById("password") as HTMLInputElement).value;
			await Login(email, password);
			console.log("successful login!");
			router.push("/");
		} catch (err) {
			console.log("Login error:", err);
		}
	}

	return (
		<main className="page-col account" >
      		<form id="createAccount" onSubmit={handleLogin}>
				<label htmlFor="email">Email</label>
				<input type="email" id="email" name="email" style ={{border: "1px solid #000"}} required />
				<label htmlFor="password">Password</label>
				<input type="password" id="password" name="password" style ={{border: "1px solid #000"}} required />
				<button type="submit">Log In</button>
			</form>
			<div>
				Don't have an account? <Link href="/register" className="inline-link">Create Account</Link>
			</div>
		</main>
	);
}
