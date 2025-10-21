import Link from "next/link";
import { Icon } from "@/app/Components"

export function Header() {
    return (
    <header>
        <nav className="header">
            <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
            <Link href="/store">Store</Link>
            <Link href="/library">Library</Link> 
            <Link href={"/account"}><Icon type="Account" size="2em"/></Link>
        </nav>
    </header>
    );
}