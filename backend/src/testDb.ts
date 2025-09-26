import { eq } from "drizzle-orm";
import { db } from "./db";
import { games } from "./schema";

async function main() {
  try {
    const sampleBoard = JSON.stringify([
      ["X", "O", "X"],
      ["O", "X", "O"],
      ["X", " ", " "]
    ]);

    const [inserted] = await db
      .insert(games)
      .values({ board: sampleBoard, currentPlayer: "X", gameStatus: "ongoing" })
      .returning();

    if (!inserted) {
      throw new Error("Insert did not return a row");
    }

    console.log("Inserted:", inserted);

    const [fetched] = await db
      .select()
      .from(games)
      .where(eq(games.id, inserted.id));

    console.log("Fetched:", fetched);
  } catch (error) {
    console.error("Error during DB test:", error);
    process.exitCode = 1;
  }
}

main().then(() => {
  // Ensure Bun/Node exits when done
  setTimeout(() => process.exit(process.exitCode ?? 0), 0);
});


