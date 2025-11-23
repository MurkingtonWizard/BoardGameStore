"use client"
import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { Footer, Header, LibraryPage, StorePage, Signup } from "@/app/Components";
import { IBoardGame } from "@/model";
import { DefaultFilter, FetchGameSearch, Filters, } from "@/Controllers"
import { useSearchParams } from "next/navigation";

export interface ChildProps {
    boardGames: IBoardGame[];
    maxPage: number// [[number, number], React.Dispatch<React.SetStateAction<[number, number]>>],
};
export interface RefreshProp {
    onRefresh: () => void; 
}
export type PageType = "store" | "library" | "other";
type AllowedChildPage = ReactElement<typeof StorePage> | ReactElement<typeof LibraryPage> | ReactElement<any>;
interface PageWrapperProps {
  children: (props: ChildProps & RefreshProp) => AllowedChildPage;
}


export function PageWrapper({ children }: PageWrapperProps) {
    const [prevSearch, setPrevSearch] = useState("");
    const [prevFilters, setPrevFilters] = useState(DefaultFilter);
    //const [search, setSearch] = useState("");
    //const [filters, setFilters] = useState(DefaultFilter);
    //const [pages, setPages] = useState<[number, number]>([1,0]);
    const [games, setGames] = useState<IBoardGame[]>([]);
    const [refresh, setRefresh] = useState(0);
    const fetchIndex = useRef(0); 

    const searchParams = useSearchParams();
    const searchMemo = useMemo(() => ({
        search: searchParams.get("search") || "",
        page: Number(searchParams.get("page") || 1),
        filters: {
        ...DefaultFilter,
        minAge: Number(searchParams.get("minAge") ?? DefaultFilter.minAge),
        maxAge: Number(searchParams.get("maxAge") ?? DefaultFilter.maxAge),
        minPlayers: Number(searchParams.get("minPlayers") ?? DefaultFilter.minPlayers),
        maxPlayers: Number(searchParams.get("maxPlayers") ?? DefaultFilter.maxPlayers),
        minYear: Number(searchParams.get("minYear") ?? DefaultFilter.minYear),
        maxYear: Number(searchParams.get("maxYear") ?? DefaultFilter.maxYear),
        minPlaytime: Number(searchParams.get("minPlaytime") ?? DefaultFilter.minPlaytime),
        maxPlaytime: Number(searchParams.get("maxPlaytime") ?? DefaultFilter.maxPlaytime),
        minBGGScore: Number(searchParams.get("minBGGScore") ?? DefaultFilter.minBGGScore),
        maxBGGScore: Number(searchParams.get("maxBGGScore") ?? DefaultFilter.maxBGGScore),
        minStoreScore: Number(searchParams.get("minStoreScore") ?? DefaultFilter.minStoreScore),
        maxStoreScore: Number(searchParams.get("maxStoreScore") ?? DefaultFilter.maxStoreScore),
        } as Filters
    }), [searchParams.toString()]);

    const [maxPages, setMaxPages] = useState<number>(1);
    
    const child = children({
        boardGames: games,       
        maxPage: maxPages,
        onRefresh: () => { setRefresh(refresh === 1 ? 0 : 1); }, 
    });

    const type: PageType = 
        child.type === StorePage ? "store" :
        child.type === LibraryPage ? "library" :
        "other";

    const FetchGames = (async () => {
        console.log("FetchGames called with:", searchMemo);
        let currentPage = searchMemo.page;

        const currentFetch = ++fetchIndex.current; // increment generation
        console.log("Fetching index:", currentFetch);
		if (type === "other") return;

        if(searchMemo.search !== prevSearch || JSON.stringify(searchMemo.filters) !== JSON.stringify(prevFilters)) {
            setMaxPages(0);
            currentPage = 1;
        }

        try {
            let data;
            if (type === "store") {
                data = await FetchGameSearch(searchMemo.search, searchMemo.filters, "store", currentPage);
			} else {
                data = await FetchGameSearch(searchMemo.search, searchMemo.filters, "library");
            }

            if (currentFetch === fetchIndex.current) {
                if (type === "store") {
                    setGames(data.games);
                    setMaxPages(data.total_pages);
                } else {
                    setGames(data.games || []);
                }
                setPrevSearch(searchMemo.search)
                setPrevFilters(searchMemo.filters)
            } else {
                console.log("Ignored outdated fetch", currentFetch);
            }
        } catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        FetchGames();
    }, [searchMemo, refresh]);
    

    return (
        <div>
            <Header /*search={[search, setSearch]} filter={[filters, setFilters]}*/ pageType={type}/>
            {child}
            <Footer/>
        </div>
    );
}

