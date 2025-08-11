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

interface CSVRow {
  id: number;
  name: string;
  code: string;
  barcode: string;
  sub: string;
  desc: string;
  cat: string;
  supplier: string;
  stock: number;
  min: number;
  cost: number;
  price: number;
  priceA: number;
  priceB: number;
  priceC: number;
}
// interface CSVRow {
//   id: number,
//   code: string,
//   pcode: string,
//   nombreDelProducto: string,
//   descripcion: string,
//   stockActual: number,
//   costoUnitarioSinIva: number,
//   supplier: string,
//   precioDeVenta: number,
//   conversion: number,
// }

function generateCode(name: string): string {
  const firstFourLetters = name.replace(/\s/g, '').slice(0, 4).toUpperCase();
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${firstFourLetters}${randomNumber}`;
}

app.post("/csv", upload.single("file"), (req: Request, res: Response) => {
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
      let code = row.code.trim() === "" ? generateCode(row.name.trim()) : row.code.trim();
      results.push({
        id: Number(index),
        code: code,
        barcode: String(row.barcode.trim()) ?? "",
        name: String(row.name.trim() + " " + row.brand.trim()),
        cost: Number(row.COSTO.trim()) ?? 0,
        desc: "",
        price: Number(row.price.trim()) ?? 0,
        stock: Number(row.stock.trim()) ?? 0,
        sub: String(row.sub.trim()) ?? "",
        cat: String(row.cat.trim()) ?? "",
        supplier: String(row.supplier.trim()) ?? "",
        min: Number(row.min.trim()) ?? 0,
        priceA: Number(row.priceA.trim()) ?? 0,
        priceB: Number(row.priceB.trim()) ?? 0,
        priceC: Number(row.priceC.trim()) ?? 0,
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
