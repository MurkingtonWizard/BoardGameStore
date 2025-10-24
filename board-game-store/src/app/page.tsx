"use client"
import Image from "next/image";
import { Footer, Header } from "@/app/Components";
import StorePage from "./store/page";
import { IBoardGame } from "@/model";
import { useEffect, useState } from "react";

export default function Home() {
  const [games, setGames] = useState<IBoardGame[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    console.log(games[0]);
  },[games]);

  return (
    <div>
      <Header results={games} setResults={setGames} page={page} setPage={setPage}/>
      <StorePage results={games} setResults={setGames} page={page} setPage={setPage}/>
      <Footer/>
    </div>
  );
}
