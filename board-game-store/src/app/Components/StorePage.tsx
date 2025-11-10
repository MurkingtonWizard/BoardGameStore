import { IBoardGame } from "@/model";
import { GameCard } from "./GameCard";
import { ChildProps, RefreshProp } from "./PageWrapper";

export function StorePage({boardGames, pages: [[currentPage = 0, maxPage], setPages], onRefresh} : ChildProps & RefreshProp) {
    
    return (
    <main className="pt-24 p-8">
        <h1 className="text-3xl font-bold mb-6">Browse Board Games</h1>
        <div className="grid grid-cols-3 gap-6">
          {boardGames.map((game) => (
            <div key={game.id}>
              {/* Clicking card goes to detail page */}
              <GameCard game={game} onRefresh={onRefresh}/>
            </div>
          ))}
        </div>
        {boardGames.length === 0 ? <p className="text-gray-500">No results.</p> : (
        <div className="page-row">
          {Array.from({ length: maxPage }, (_, i) => i + 1).map((pageNumber, index, arr) => (
            <div key={pageNumber} className="page-link">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPages([pageNumber, maxPage]);
                }}
                className={currentPage === pageNumber ? 'active' : ''}
              >
                {pageNumber}
              </a>
              {index < arr.length - 1 && <span>,</span>}
            </div>
          ))}
        </div>)}
      </main>
    );
}