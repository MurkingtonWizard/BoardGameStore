import { useRouter, useSearchParams } from "next/navigation";
import { ChildProps, RefreshProp } from "./PageWrapper";
import { useEffect, useState } from "react";

export function PageNumber({boardGames, maxPage} : ChildProps) {
    const searchParams = useSearchParams();
    const pageParam = searchParams.get("page");
    const router = useRouter();
    const [internalPage, setInternalPage] = useState([1,0]);

    function goToPage(page: number) {
        if (page > maxPage) page = 1;
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));

        router.push(`?${params.toString()}`);
        setInternalPage([page, maxPage]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        if (!searchParams) return;
        let pageNum = pageParam ? Number(pageParam) : 1;
        if (pageNum > maxPage) pageNum = 1;
        setInternalPage([pageNum, maxPage]);
    }, [pageParam]);

    return (
        <div className="page-row" style={{justifyContent: "center", height: "3em"}}> 
            {
                boardGames.length !== 0 && (
                    <div className="page-row" style={{width: "30%",justifyContent: "space-between"}}>
                        <div className="page-link">
                            <a
                                href="#"
                                className={internalPage[0] === 1 ? "disabled" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (internalPage[0] === 1) return;
                                    goToPage(internalPage[0]-1)
                                }}
                            >
                                &lt;&lt;&lt;
                            </a>
                        </div>
                        {Array.from({ length: maxPage }, (_, i) => i + 1).map((pageNumber, index, arr) => (
                            <div key={pageNumber} className="page-link">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        goToPage(pageNumber)
                                    }}
                                    className={internalPage[0] === pageNumber ? 'active' : ''}
                                >
                                    {pageNumber}
                                </a>
                            </div>
                        ))}
                        <div className="page-link">
                        <a
                            href="#"
                            className={internalPage[0] === maxPage ? "disabled" : ""}
                            onClick={(e) => {
                                e.preventDefault();
                                if (internalPage[0] === maxPage) return;
                                goToPage(internalPage[0]+1);
                            }}
                        >
                            &gt;&gt;&gt;
                        </a>
                        </div>
                    </div>
                )
            }
        </div>
    );
}