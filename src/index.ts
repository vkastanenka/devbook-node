import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "success!" });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
