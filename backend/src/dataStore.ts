
import { TicTacToe } from "./tictactoe";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { games } from "./schema";



export class DataStore {
    async create() : Promise<TicTacToe> {
        // let GameState = new TicTacToe(this.id);
        // this.object[this.id] = GameState;
        // this.id++;
        // return GameState

        let GameState = new TicTacToe();

        const [inserted] = await db
            .insert(games)
            .values({
                board: JSON.stringify(GameState.board),
                currentPlayer: GameState.currentPlayer,
                gameStatus: GameState.gameStatus
            })
            .returning()
        if (!inserted) {
            throw new Error("Insert did not return a row");
        }

        return new TicTacToe({
            id: inserted.id,
            board: JSON.parse(inserted.board),
            currentPlayer: inserted.currentPlayer as TicTacToe["currentPlayer"],
            gameStatus: inserted.gameStatus as TicTacToe["gameStatus"],
        })
  
    }

    async read(id: number) : Promise<TicTacToe | undefined>{

        const [fetched] = await db
        .select()
        .from(games)
        .where(eq(games.id, id));

        if (!fetched) {
            throw new Error("Insert did not return a row");
        }

        return new TicTacToe({
            id: fetched.id,
            board: JSON.parse(fetched.board),
            currentPlayer: fetched.currentPlayer as TicTacToe["currentPlayer"],
            gameStatus: fetched.gameStatus as TicTacToe["gameStatus"],
        })
    }

    async update(id: number, GameState: TicTacToe): Promise<TicTacToe | undefined> {
        const [updated] = await db
            .update(games)
            .set({
                board: JSON.stringify(GameState.board),
                currentPlayer: GameState.currentPlayer,
                gameStatus: GameState.gameStatus
            })
            .where(eq(games.id, id))
            .returning();


        if (!updated) {
            throw new Error("Insert did not return a row");
        }        
        
        return new TicTacToe({
            id: updated.id,
            board: JSON.parse(updated.board),
            currentPlayer: updated.currentPlayer as TicTacToe["currentPlayer"],
            gameStatus: updated.gameStatus as TicTacToe["gameStatus"],
        });
    }
}