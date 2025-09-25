import express, { Request, Response } from "express";
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors())

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Bun + Express + TypeScript!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
