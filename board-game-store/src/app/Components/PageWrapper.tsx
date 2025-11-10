"use client"
import { ReactElement, useEffect, useState } from "react";
import { Footer, Header, LibraryPage, StorePage } from "@/app/Components";
import { IBoardGame } from "@/model";
import { DefaultFilter, FetchLibraryData, FetchStoreData, } from "@/Controllers"

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
        if(type == "store") {
            const data = await FetchStoreData(search, filters, pages[0]);
            setGames(data.games);
            setPages([pages[0],data.total_pages]);
        } else {
            const data = await FetchLibraryData(search, filters);
            console.log(data);
            setGames(data === null ? [] : data.games);
        }
    })

    useEffect(() => {
        FetchGames();
        console.log("Store: Get page 1");
    }, []);

    useEffect(() => {
        FetchGames();
        console.log("Rerender Store");
    }, [pages[0], filters, search, refresh]);

    return (
        <div>
            <Header search={[search, setSearch]} filter={[filters, setFilters]}/>
            {child}
            <Footer/>
        </div>
    );
}

