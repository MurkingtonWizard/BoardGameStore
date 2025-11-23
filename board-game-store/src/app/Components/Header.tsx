import Link from "next/link";
import { Icon, PageType, SearchBar } from "@/app/Components"
import { Filters, DefaultFilter, Login, IsLoggedIn } from "@/Controllers"
import { useEffect, useState } from "react";



export type HeaderProps = {
}

export function Header({
        pageType,
        }: HeaderProps & {
            pageType: PageType
        }) {

    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        // Only run on client
        setLoggedIn(IsLoggedIn());
    }, []);

    return (
    <header>
        <nav className="header">
            <div className="header-group">
                <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
                <Link href={"/library"} className="link"><Icon type="Library" size="2em"/></Link>
            </div>
            {pageType !== "other" && (
                <SearchBar/>
            )}
            <div className="header-group">
                <Link href={"/checkout"} className="link"><Icon type="ShoppingCart" size="2em"/></Link>
                { loggedIn ?
                    <Link href="/account" className="link"><Icon type="Account" size="2em"/></Link>
                    :
                    <Link href="/login" className="link"><Icon type="Account" size="2em"/></Link>
                }
            </div>
        </nav>
    </header>
    );
}
