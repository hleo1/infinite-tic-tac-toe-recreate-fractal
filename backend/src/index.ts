import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import cors from "cors"



import { TicTacToe } from "./tictactoe";

const app = express();

const server = createServer(app); // 👈 wrap express
const io = new Server(server, {
  cors: {
    origin: "*", // your React dev URL
    methods: ["GET", "POST"]
  }
});



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
        let y = parseInt(req.params.y);
        
        if (!object[join_id]) {
            res.status(404).send("Game not found");
            return;
        }
        
        object[join_id].makeMove(x, y);
        let state = object[join_id].getGameState();

        // 👇 notify everyone in the same room
        io.to(`game-${join_id}`).emit("game-update", state);

        res.send(state);
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


    let state = object[join_id]?.getGameState();

    // 👇 notify everyone in the same room
    io.to(`game-${join_id}`).emit("game-update", state);

    res.send(state);

})

io.on("connection", (socket) => {
    // console.log("⚡ New client connected", socket.id);
  
    socket.on("join-game", (gameId: number) => {
      socket.join(`game-${gameId}`);
      console.log(`Client ${socket.id} joined game ${gameId}`);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });