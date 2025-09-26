import express, { Request, Response } from "express";
import cors from "cors"


import { TicTacToe } from "./tictactoe";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

let id = 1;

let object: Record<number, TicTacToe> = {};

app.get("/create-game", (req: Request, res: Response) => {
    let newGameState = new TicTacToe(id);
    object[id] = newGameState;
    id++;
    res.send(newGameState.getGameState())
});

app.get("/join-game/:id", (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(400).send("No id");
        return;
    }
    let join_id = parseInt(req.params.id);
    res.send(object[join_id]?.getGameState())
})

app.get("/make-move/:id/:x/:y", (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(400).send("No id");
        return;
    }
    

    if (!req.params.x) {
        res.status(400).send("No x");
        return;
    }
    

    if (!req.params.y) {
        res.status(400).send("No y");
        return;
    }


    

    try {
        let join_id = parseInt(req.params.id);
        let x = parseInt(req.params.x);
        let y = parseInt(req.params.id);
        object[join_id]?.makeMove(x, y);
        res.send(object[join_id]?.getGameState())
    } catch (error) {
        res.status(400).send({error})
    }
    
    
})

app.get("/reset/:id", (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(400).send("No id");
        return;
    }
    let join_id = parseInt(req.params.id);
    object[join_id]?.reset();
    res.send(object[join_id]?.getGameState())

})

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
