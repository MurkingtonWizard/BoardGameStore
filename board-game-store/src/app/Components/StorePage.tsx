import { IBoardGame } from "@/model";
import { GameCard } from "./GameCard";
import { ChildProps } from "./PageWrapper";

export function StorePage({boardGames, pages: [[currentPage = 0, maxPage], setPages]} : ChildProps) {

    return (
    <main className="pt-24 p-8">
        <h1 className="text-3xl font-bold mb-6">Browse Board Games</h1>
        <div className="grid grid-cols-3 gap-6">
          {boardGames.map((game) => (
            <div key={game.id}>
              {/* Clicking card goes to detail page */}
              <GameCard game={game}/>

              {/* Add to Library button */}
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {
                  const saved = localStorage.getItem("library");
                  const current = saved ? JSON.parse(saved) : [];
                  const exists = current.some(
                    (g: IBoardGame) => g.id === game.id
                  );
                  if (!exists) {
                    current.push(game);
                    localStorage.setItem("library", JSON.stringify(current));
                    alert(`${game.name} added to your library!`);
                  } else {
                    alert(`${game.name} is already in your library.`);
                  }
                }}
              >
                Add to Library
              </button>
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