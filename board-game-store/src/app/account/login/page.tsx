"use client"
import {LoginPage, PageWrapper} from "@/app/Components";

export default function Login() {
	return (
		<PageWrapper>
		{(props)=> <LoginPage {...props} />}
		</PageWrapper>
	);
}
