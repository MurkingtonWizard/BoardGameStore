'use client'
import { ChangeEvent, ChangeEventHandler, FormEvent, useEffect, useRef, useState } from "react";
import { Icon } from "./IconLibrary";

export type Filters = {
  minAge: number; maxAge: number;
  minPlayers: number; maxPlayers: number;
  minYear: number; maxYear: number;
  minPlaytime: number; maxPlaytime: number;
  minBGGScore: number; maxBGGScore: number;
  minStoreScore: number; maxStoreScore: number;
};

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        minAge: 0,
        maxAge: 100,
        minPlayers: 1,
        maxPlayers: 100,
        minYear: -3000,
        maxYear: 2025,
        minPlaytime: 5,
        maxPlaytime: 1440,
        minBGGScore: 1,
        maxBGGScore: 10,
        minStoreScore: 1,
        maxStoreScore: 10,
    });

    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const filterMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!filtersOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        const button = filterButtonRef.current;
        const menu = filterMenuRef.current;

        if (menu && !menu.contains(target) && button && !button.contains(target)) {
            setFiltersOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [filtersOpen]);

    function handleSearch(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const queryJSON = {
            query,
            filters,
        };
        console.log("Searching for:", queryJSON);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    return (
        <form className="search-bar" role="search" aria-label="Site search" onSubmit={handleSearch}>
            <div className="left">
                <button className="link" ref={filterButtonRef} onClick={() => setFiltersOpen((v) => !v)}><Icon className="link" type="Filter" size="2em"/></button>
                <input
                    type="search"
                    id="site-search"
                    name="q"
                    placeholder="Search..."
                    value={query}
                    onChange={handleChange}/>
            </div>
            <button className="link" type="submit"><Icon type="Search" size="2em"/></button>
            {filtersOpen && (
                <div ref={filterMenuRef}  className="filter-menu-container">
                    <FilterMenu filters={filters} setFilters={setFilters} />
                </div>
            )}
        </form>
    );
}

type FilterMenuProps = {
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

function FilterMenu ({ filters, setFilters }: FilterMenuProps) {
    const update = (key: string, val: number) =>
        setFilters((f) => ({ ...f, [key]: val }));

    return (
        <div className="filter-menu">
            <FilterPair
                label="Age"
                range={[0, 100]}
                values={[filters.minAge, filters.maxAge]}
                onChanges={[
                (v) => update("minAge", v),
                (v) => update("maxAge", v),
                ]}
            />
            <FilterPair
                label="Players"
                range={[1, 100]}
                values={[filters.minPlayers, filters.maxPlayers]}
                onChanges={[
                (v) => update("minPlayers", v),
                (v) => update("maxPlayers", v),
                ]}
            />
            <FilterPair
                label="Year Published"
                range={[-3000, 2025]}
                values={[filters.minYear, filters.maxYear]}
                onChanges={[
                (v) => update("minYear", v),
                (v) => update("maxYear", v),
                ]}
            />
            <FilterPair
                label="Playtime (min)"
                range={[5, 1440]}
                values={[filters.minPlaytime, filters.maxPlaytime]}
                onChanges={[
                (v) => update("minPlaytime", v),
                (v) => update("maxPlaytime", v),
                ]}
            />
            <FilterPair
                label="BGG Score"
                range={[1, 10]}
                values={[filters.minBGGScore, filters.maxBGGScore]}
                onChanges={[
                (v) => update("minBGGScore", v),
                (v) => update("maxBGGScore", v),
                ]}
            />
            <FilterPair
                label="Store Rating"
                range={[1, 10]}
                values={[filters.minStoreScore, filters.maxStoreScore]}
                onChanges={[
                (v) => update("minStoreScore", v),
                (v) => update("maxStoreScore", v),
                ]}
            />
        </div>
    );
}

type FilterPairProps = {
    className?: string;
    label: string;
    range: [number, number]
    values: [number, number];
    onChanges: [(val: number) => void, (val: number) => void];
};

export function FilterPair({className="",label, range:[min, max], values: [minVal, maxVal], onChanges: [onMinChange, onMaxChange]}:FilterPairProps/*{ label, input1, input2 }: FilterPairProps*/) {
    const [canReset, setCanReset] = useState(false);

    useEffect(() => {
        setCanReset(!(minVal == min && maxVal == max));
    }, [minVal, maxVal]);
    
    const reset = () => {
        onMinChange(min);
        onMaxChange(max);
    }
  
    return (
        <div className={`${className} filter-section`}>
            <label className="filter-pair">
                {label}
                <div className="filter-pair-input">
                    <input type="number" min={min} max={max} value={minVal} onChange={(e) => onMinChange(Number(e.target.value))}/>
                    <p> - </p> 
                    <input type="number" min={min} max={max} value={maxVal} onChange={(e) => onMaxChange(Number(e.target.value))}/>
                    <button className={`link ${canReset ? "" : "disabled"}`} disabled={!canReset} onClick={reset}><Icon type="Reset"/></button>
                </div>
            </label>
        </div>
    );
}