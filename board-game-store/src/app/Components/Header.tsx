import Link from "next/link";
import { HeaderProps, Icon, SearchBar } from "@/app/Components"

export function Header(props: HeaderProps) {
    const { results, setResults } = props;
    return (
    <header>
        <nav className="header">
            <Link href={"/"} className="link"><Icon type="Home" size="2em"/></Link>
            <Link href={"/library"} className="link"><Icon type="Library" size="2em"/></Link>
            {props.type === "store" ? (
                <SearchBar type={props.type}
                    results={results}
                    setResults={setResults}
                    page={props.page}
                    setPage={props.setPage}
                    maxPage={props.maxPage}
                    setMaxPage={props.setMaxPage}
                />
            ) : (
                <SearchBar type={props.type} results={results} setResults={setResults} />
            )}
            <Link href={"/account"} className="link"><Icon type="Account" size="2em"/></Link>
        </nav>
    </header>
    );
}