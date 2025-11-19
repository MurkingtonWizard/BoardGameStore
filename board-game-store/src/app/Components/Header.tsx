import Link from "next/link";
import { Icon, PageType, SearchBar } from "@/app/Components"
import { Filters, DefaultFilter, Login, IsLoggedIn } from "@/Controllers"



export type HeaderProps = {
    search: [string, React.Dispatch<React.SetStateAction<string>>],
    filter: [Filters, React.Dispatch<React.SetStateAction<Filters>>],
}

export function Header({
        search,
        filter,
        pageType,
        }: HeaderProps & {
            pageType: PageType
        }) {

    return (
    <header>
        <nav className="header">
            <div className="header-group">
                <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
                <Link href={"/library"} className="link"><Icon type="Library" size="2em"/></Link>
            </div>
            {pageType !== "other" && (
                <SearchBar search={search} filter={filter}/>
            )}
            <Link href={IsLoggedIn() ? "/account" : "/register"} className="link"><Icon type="Account" size="2em"/></Link>
        </nav>
    </header>
    );
}
