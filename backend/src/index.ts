import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
// import "bun:dotenv"
import { db } from "./db";
import { games } from "./schema";

import { TicTacToe } from "./tictactoe";

import { DataStore } from "./dataStore";

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


const dataStore = new DataStore();

app.get("/create-game", async (req: Request, res: Response) => {
    let newGameState = await dataStore.create();
    res.send(newGameState.getGameState());
});

app.get("/join-game/:id", async (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(400).send("No id");
        return;
    }
    let join_id = parseInt(req.params.id);

    let state = await dataStore.read(join_id);

    res.send(state?.getGameState())
})

app.get("/make-move/:id/:x/:y", async (req: Request, res: Response) => {
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

        let newstate = await dataStore.read(join_id);

        if (!newstate) {
            res.status(404).send("Game not found");
            return;
        }
        
        newstate.makeMove(x, y);

        let updatedState = await dataStore.update(join_id, newstate)


        let state = updatedState?.getGameState();

        // 👇 notify everyone in the same room
        io.to(`game-${join_id}`).emit("game-update", state);

        res.send(state);
    } catch (error) {
        res.status(400).send({error})
    }
    
    
})

app.get("/reset/:id", async (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(400).send("No id");
        return;
    }
    let join_id = parseInt(req.params.id);

    let newstate = await dataStore.read(join_id);
    if (!newstate) {
        res.status(404).send("Game not found");
        return;
    }
    newstate?.reset();
    let updatedState = await dataStore.update(join_id, newstate);


    let state = updatedState?.getGameState();
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