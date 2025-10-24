import { IBoardGame } from "@/model";

export type BoardGameStateProps = {
  results: IBoardGame[];
  setResults: React.Dispatch<React.SetStateAction<IBoardGame[]>>;
};
export type PageStateProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};