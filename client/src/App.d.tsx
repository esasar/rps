export type Move = 'rock' | 'paper' | 'scissors';

export interface Room {
  id: string;
  playerIds: string[];
  moves?: { [playerId: string]: Move };
};