import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const app = express();
const port = 8080;

app.use(cors());

const upload = multer({ dest: "uploads/" });

// interface CSVRow {
//   id: number;
//   name: string;
//   code: string;
//   description: string;
//   subCategoryId: number;
//   supplierId: number;
//   tipoItem: number;
//   tipoDeItem: string;
//   uniMedida: string;
//   unidaDeMedida: string;
//   stock: number;
//   minimumStock: number;
//   costoUnitario: number;
//   branchId: number;
//   price: number;
//   priceA: number;
//   priceB: number;
//   priceC: number;
// }
interface CSVRow {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  cost: number;
  code: string;
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
        name: String(row.name).trim(),
        description: String(row.description).trim(),
        stock: Number(row.stock),
        price: parseFloat(parseFloat(row.price).toFixed(2)),
        cost: 1,
        code: '',
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
