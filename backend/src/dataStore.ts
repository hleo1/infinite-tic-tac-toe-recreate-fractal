
import { TicTacToe } from "./tictactoe";

import { eq } from "drizzle-orm";
import { db } from "./db";
import { games } from "./schema";



export class DataStore {
    object: Record<number, TicTacToe> = {};
    id: number;
    
    constructor() {
        this.object = {};
        this.id = 1;
    }

    async create() : TicTacToe {
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

        return { ...inserted, board: JSON.parse(inserted.board) }
    }

    read(id: number) : TicTacToe | undefined{
        return(this.object[id]);
    }

    update(id: number, GameState : TicTacToe) : TicTacToe | undefined {
        this.object[id] = GameState;
        return(this.object[id])
    }
}