import { IBoardGame } from "@/model";

type BoardGameStateProps = {
  results: IBoardGame[];
  setResults: React.Dispatch<React.SetStateAction<IBoardGame[]>>;
};
type PageStateProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};
type MaxPageStateProps = {
  maxPage: number;
  setMaxPage: React.Dispatch<React.SetStateAction<number>>;
};

export type LibraryHeaderProps = {
  type: "library";
  results: IBoardGame[];
  setResults: React.Dispatch<React.SetStateAction<IBoardGame[]>>;
};

export type StoreHeaderProps = {
  type: "store";
  results: IBoardGame[];
  setResults: React.Dispatch<React.SetStateAction<IBoardGame[]>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  maxPage: number;
  setMaxPage: React.Dispatch<React.SetStateAction<number>>;
};

export type HeaderProps = LibraryHeaderProps | StoreHeaderProps;
