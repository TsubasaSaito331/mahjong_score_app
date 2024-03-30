// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Player = {
  id: number;
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
};