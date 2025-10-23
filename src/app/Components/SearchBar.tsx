'use client'
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import { Icon } from "./IconLibrary";

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);

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
                <button className="link" onClick={() => setFiltersOpen((v) => !v)}><Icon className="link" type="Filter" size="2em"/></button>
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
                <FilterMenu/>
            )}
        </form>
    );
}

function FilterMenu () {
    type range = [number, number];
    // Age
    const ageRange: range = [0,100];
    const [minAge, setMinAge] = useState(ageRange[0]);
    const [maxAge, setMaxAge] = useState(ageRange[1]);
    // num players
    const playerRange: range = [1,100];
    const [minPlayers, setMinPlayers] = useState(playerRange[0]);
    const [maxPlayers, setMaxPlayers] = useState(playerRange[1]); // max?
    // year published
    const yearRange: range = [-3000,2025];
    const [minYear, setMinYear] = useState(yearRange[0]);
    const [maxYear, setMaxYear] = useState(yearRange[1]); // max?
    // playtime
    const playtimeRange: range = [5,2025];
    const [minPlaytime, setMinPlaytime] = useState(playtimeRange[0]);
    const [maxPlaytime, setMaxPlaytime] = useState(playtimeRange[1]); // max?
    // BGG score
    const bggScoreRange: range = [1,10];
    const [minBGGScore, setMinBGGScore] = useState(bggScoreRange[0]);
    const [maxBGGScore, setMaxBGGScore] = useState(bggScoreRange[1]);
    // Store rating
    const storeScoreRange: range = [1,10];
    const [minStoreScore, setMinStoreScore] = useState(storeScoreRange[0]);
    const [maxStoreScore, setMaxStoreScore] = useState(storeScoreRange[1]);

    return (
        <div className="filter-menu">
            <FilterPair label="Age" values={[minAge, maxAge]} onChanges={[setMinAge, setMaxAge]} range={ageRange} />
            <FilterPair label="Players" values={[minPlayers, maxPlayers]} onChanges={[setMinPlayers, setMaxPlayers]} range={playerRange} />
            <FilterPair label="Year Published" values={[minYear, maxYear]} onChanges={[setMinYear, setMaxYear]} range={yearRange} />
            <FilterPair label="Playtime (min)" values={[minPlaytime, maxPlaytime]} onChanges={[setMinPlaytime, setMaxPlaytime]} range={playtimeRange} />
            <FilterPair label="BGG Score" values={[minBGGScore, maxBGGScore]} onChanges={[setMinBGGScore, setMaxBGGScore]} range={bggScoreRange} />
            <FilterPair label="Store Rating" values={[minStoreScore, maxStoreScore]} onChanges={[setMinStoreScore, setMaxStoreScore]} range={storeScoreRange} />
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
                <button className="link" onClick={reset}><Icon type="Reset"/></button>
            </div>
        </label>
    </div>
  );
}