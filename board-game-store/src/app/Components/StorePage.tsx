import { IBoardGame } from "@/model";
import { GameCard } from "./GameCard";
import { ChildProps, RefreshProp } from "./PageWrapper";
import { PageNumber } from "./PageNumber";

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
        <PageNumber boardGames={boardGames} pages={[[currentPage, maxPage], setPages]} onRefresh={onRefresh}/>
      </main>
    );
}