import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const app = express();
const port = 8000;

app.use(cors());

const upload = multer({ dest: "uploads/" });

interface CSVRow {
  id: number,
  name: string,
  comercial: string,
  nit: string,
  dui: string,
  tel: string,
  email: string,
  giro: string,
  nrc: string,
  address: string,
}

app.post("/upload-csv", upload.single("file"), (req: Request, res: Response) => {
  const results: Array<CSVRow> = [];

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  let index = 0;
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row: any) => {
      index++;
      results.push({
        id: index,
        name: row.name.trim(),
        comercial: row.comercial.trim(),
        nit: row.nit.trim(),
        dui: row.dui.trim(),
        tel: row.tel.trim(),
        email: row.email.trim(),
        giro: row.giro.trim(),
        nrc: row.nrc.trim(),
        address: row.address.trim(),
      });
    })
    .on("end", () => {
      fs.unlinkSync(filePath);
      console.log('Done');
      res.json(results);
    })
    .on("error", (error: Error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
