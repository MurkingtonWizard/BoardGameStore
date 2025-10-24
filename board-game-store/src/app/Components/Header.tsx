import Link from "next/link";
import { BoardGameStateProps, Icon, PageStateProps, SearchBar } from "@/app/Components"

export function Header({ results, setResults, page, setPage }: BoardGameStateProps & PageStateProps) {
    return (
    <header>
        <nav className="header">
            <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
            <Link href={"/library"} className="link"><Icon type="Library" size="2em"/></Link>
            <SearchBar results={results} setResults={setResults} page={page} setPage={setPage}/>
            <Link href={"/account"} className="link"><Icon type="Account" size="2em"/></Link>
        </nav>
    </header>
    );
}