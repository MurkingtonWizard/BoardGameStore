import Link from "next/link";
import { Icon, SearchBar } from "@/app/Components"
import { Filters, DefaultFilter, Login } from "@/Controllers"



export type HeaderProps = {
    search: [string, React.Dispatch<React.SetStateAction<string>>],
    filter: [Filters, React.Dispatch<React.SetStateAction<Filters>>],
}

export function Header({
        search,
        filter,
        }: HeaderProps) {

    return (
    <header>
        <nav className="header">
            <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
            <Link href={"/library"} className="link"><Icon type="Library" size="2em"/></Link>
            <SearchBar search={search} filter={filter}/>
            <Link href={"/account"} className="link"><Icon type="Account" size="2em"/></Link>
			<button type = "button" onClick = {async () => Login("test@test.com", "password")}>Login Test</button>
            <Link href={"/checkout"} className="link"><Icon type="ShoppingCart" size="2em"/></Link>
        </nav>
    </header>
    );
}
