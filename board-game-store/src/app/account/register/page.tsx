"use client"
import {RegisterPage, PageWrapper} from "@/app/Components";

export default function Register() {
	return (
		<PageWrapper>
		{(props)=> <RegisterPage {...props} />}
		</PageWrapper>
	);
}
