import Link from "next/link";
import { Filters, Icon, SearchBar } from "@/app/Components"


export type HeaderProps = {
    search: [string, React.Dispatch<React.SetStateAction<string>>],
    filter: [Filters, React.Dispatch<React.SetStateAction<Filters>>],
}

export function Header({
        search,
        filter,
        }: HeaderProps) {
		const handleLoginPlaceholder = async () => {
			console.log("Logging in")
			try {
				const response = await fetch("/login", {
					method: "POST",
					headers: {"Content-Type": "application/json"},
					body: JSON.stringify({
						email: "test@test.com",
						password: "password"
					}),
					credentials: "include",
				});
				const data = await response.json();
				console.log("Login response", data);
			} catch (err) {
				console.error("Login error", err);
			}
		}

    return (
    <header>
        <nav className="header">
            <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
            <Link href={"/library"} className="link"><Icon type="Library" size="2em"/></Link>
            <SearchBar search={search} filter={filter}/>
            <Link href={"/account"} className="link"><Icon type="Account" size="2em"/></Link>
						<button type = "button" onClick = {handleLoginPlaceholder}>Login Test</button>
        </nav>
    </header>
    );
}
