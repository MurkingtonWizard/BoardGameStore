import Link from "next/link";
import { Icon, SearchBar } from "@/app/Components"

export function Header() {
    return (
    <header>
        <nav className="header">
            <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
            <Link href={"/library"} className="link"><Icon type="Library" size="2em"/></Link>
            <SearchBar/>
            <Link href={"/account"} className="link"><Icon type="Account" size="2em"/></Link>
        </nav>
    </header>
    );
}