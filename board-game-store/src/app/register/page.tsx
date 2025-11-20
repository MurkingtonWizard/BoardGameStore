"use client"
import {Signup, PageWrapper} from "@/app/Components";

export default function Register() {
	return (
		<PageWrapper>
		{(props)=> <Signup {...props} />}
		</PageWrapper>
	);
}
