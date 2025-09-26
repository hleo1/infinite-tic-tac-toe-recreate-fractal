type Player = "X" | "O"

type Cell = Player | undefined

type gameStatus = "ongoing" | "tied" | "X" | "O"

export class TicTacToe {
    id: number;
    board : Cell[][];
    gameStatus : gameStatus;
    currentPlayer : Player;

    constructor(id: number) {
        this.id = id
        this.board = Array(3).fill(null).map(() => Array(3).fill(undefined))
        this.gameStatus = "ongoing";
        this.currentPlayer = "X";
    }

    getGameState() {
        return {...this}
    }

    reset()  {
        this.board = Array(3).fill(null).map(() => Array(3).fill(undefined))
        this.gameStatus = "ongoing";
        this.currentPlayer = "X";
    }

    makeMove(row: number, col: number) {
        if (!this.board[row]![col]) {
            return;
        }

        if (this.gameStatus !== "ongoing") {
            return;
        }

        if ( !(row >= 0 && row <= 2 && col >= 0 && col <= 2) ) {
            throw new Error ("Index Out of Bounds!");
        }

        this.board[row]![col] = this.currentPlayer;
   
        //detect its row
        if (this.board[row]?.every((elem) => elem === this.currentPlayer)) {
            this.gameStatus = this.currentPlayer;
        }

        //detect winner in its column
        if (this.board.map((row) => row[col]).every((elem) => elem === this.currentPlayer)) {
            this.gameStatus = this.currentPlayer;
        }

        let left_diagonal = [
            [0, 0],
            [1, 1],
            [2, 2]
        ]


        let right_diagonal = [
            [0, 2],
            [1, 1],
            [2, 0]
        ]

        if (left_diagonal.map(([r, c]) => this.board[r]?.[c]).every(elem => elem === this.currentPlayer)) {
            this.gameStatus = this.currentPlayer;
        }

        if (right_diagonal.map(([r, c]) => this.board[r]?.[c]).every(elem => elem === this.currentPlayer)) {
            this.gameStatus = this.currentPlayer;
        }
        
        //detect Tie
        if (this.gameStatus != "O" && this.gameStatus != "X") {
            if (this.board.every(row => row.every(cell => cell !== undefined))) {
                this.gameStatus = "tied";
            }
        }
        if (this.gameStatus === "ongoing") { 
            this.currentPlayer = (this.currentPlayer === "X") ? "O" : "X";
        }
    }
}