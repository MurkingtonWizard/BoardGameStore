import { ChildProps, RefreshProp } from "./PageWrapper";

export function PageNumber({boardGames, pages: [[currentPage = 0, maxPage], setPages], onRefresh} : ChildProps & RefreshProp) {
    return (
        <div className="page-row" style={{justifyContent: "center", height: "3em"}}> 
            {
                boardGames.length !== 0 && (
                    <div className="page-row" style={{width: "30%",justifyContent: "space-between"}}>
                        {Array.from({ length: maxPage }, (_, i) => i + 1).map((pageNumber, index, arr) => (
                            <div key={pageNumber} className="page-link">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setPages([pageNumber, maxPage]);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={currentPage === pageNumber ? 'active' : ''}
                                >
                                    {pageNumber}
                                </a>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    );
}