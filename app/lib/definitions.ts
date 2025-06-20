// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  userId: string;
  password: string;
};

export type Result = {
  id: string;
  score: string;
};

export type Player = {
  id: string;
  name: string;
  totalscore: number;
  rawscore: number;
  games: number;
  firstnum: number;
  secondnum: number;
  thirdnum: number;
  fourthnum: number;
  maxscore: number;
  rank: number;
  deposition: number;
};

export type GameResult = {
  id: string;
  date: Date;
  eastplayer: string;
  eastplayerscore: number;
  southplayer: string;
  southplayerscore: number;
  westplayer: string;
  westplayerscore: number;
  northplayer: string;
  northplayerscore: number;
};

export type HeadToHeadResult = {
  opponentId: string;
  opponentName: string;
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  pointDifference: number;
};
