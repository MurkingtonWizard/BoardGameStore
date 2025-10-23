'use client'
import { ChangeEvent, FormEvent, useState } from "react";
import { Icon } from "./IconLibrary";

export function SearchBar() {
    const [query, setQuery] = useState("");

    function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log("Searching for:", query);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <form className="search-bar" role="search" aria-label="Site search" onSubmit={handleSearch}>
            <div className="left">
                <Icon className="link" type="Filter" size="2em"/>
                <input
                    type="search"
                    id="site-search"
                    name="q"
                    placeholder="Search..."
                    value={query}
                    onChange={handleChange}/>
            </div>
            <button className="link" type="submit"><Icon type="Search" size="2em"/></button>
        </form>
    );
}