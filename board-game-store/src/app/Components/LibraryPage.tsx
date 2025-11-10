import { GameCard } from "./GameCard";
import { ChildProps, RefreshProp } from "./PageWrapper";

export function LibraryPage({boardGames, onRefresh} : ChildProps & RefreshProp) {
    return (
    <main className="pt-24 p-8">
    <h1 className="text-3xl font-bold mb-6">My Library</h1>
    {boardGames.length === 0 ? (
        <p className="text-gray-500">You haven’t added any games yet.</p>
    ) : (
        <div className="grid grid-cols-3 gap-6">
        {boardGames.map((game) => (
            <div key={game.id}>
              <GameCard game={game} onRefresh={onRefresh}/>
            </div>
        ))}
        </div>
    )}
    </main>
    );
}