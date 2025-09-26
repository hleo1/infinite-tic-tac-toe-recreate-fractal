import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  board: text("board").notNull(),  // store Cell[][] as JSON
  currentPlayer: varchar("current_player", { length: 1 }).notNull(), // "X" or "O"
  gameStatus: varchar("status", { length: 20 }).notNull(), // "ongoing" | "tied" | "X" | "O"
});
