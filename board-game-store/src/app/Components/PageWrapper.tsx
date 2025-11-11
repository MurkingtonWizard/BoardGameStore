"use client"
import { ReactElement, useEffect, useRef, useState } from "react";
import { Footer, Header, LibraryPage, StorePage } from "@/app/Components";
import { IBoardGame } from "@/model";
import { DefaultFilter, FetchGameSearch, } from "@/Controllers"

export interface ChildProps {
    boardGames: IBoardGame[];
    pages: [[number, number], React.Dispatch<React.SetStateAction<[number, number]>>],
};
export interface RefreshProp {
    onRefresh: () => void; 
}
type AllowedChildPage = ReactElement<typeof StorePage> | ReactElement<typeof LibraryPage>;
interface PageWrapperProps {
  children: (props: ChildProps & RefreshProp) => AllowedChildPage;
}

export function PageWrapper({ children }: PageWrapperProps) {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState(DefaultFilter);
    const [pages, setPages] = useState<[number, number]>([1,0]);
    const [games, setGames] = useState<IBoardGame[]>([]);
    const [refresh, setRefresh] = useState(0);
    const fetchIndex = useRef(0); 

    const child = children({
        boardGames: games,       
        pages: [pages, setPages],
        onRefresh: () => { setRefresh(refresh === 1 ? 0 : 1); }, 
    });

    const type: "store" | "library" | "unknown" = 
        child.type === StorePage ? "store" :
        child.type === LibraryPage ? "library" :
        "unknown";

    const FetchGames = (async () => {
        const currentFetch = ++fetchIndex.current; // increment generation
        console.log("Fetching index:", currentFetch);

        try {
            let data;
            if (type === "store") {
                data = await FetchGameSearch(search, filters, "store", pages[0]);
            } else {
                data = await FetchGameSearch(search, filters, "library");
            }

            if (currentFetch === fetchIndex.current) {
                if (type === "store") {
                    setGames(data.games);
                    setPages([pages[0], data.total_pages]);
                } else {
                    setGames(data.games || []);
                }
            } else {
                console.log("Ignored outdated fetch", currentFetch);
            }
        } catch (err) {
            console.error(err);
        }
    })

    useEffect(() => {
        FetchGames();
    }, [pages[0], filters, search, refresh]);

    return (
        <div>
            <Header search={[search, setSearch]} filter={[filters, setFilters]}/>
            {child}
            <Footer/>
        </div>
    );
}

