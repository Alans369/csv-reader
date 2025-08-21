import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

import {helper}from "./helper.ts";

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

type CSVRowWithOptionalFields = Pick<CSVRow, 'code' | 'name' |  'price' | 'stock' > 
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
  const results: Array<CSVRowWithOptionalFields> = [];

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  let index = 0;
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row: any) => {
      index++;
     
      const cleanedValue = row.precio.replace(/[$,]/g, '');
     
      
      let code = row.code === undefined ? generateCode(row.desc) : row.code;
      results.push({
        code: code,
        name: String(row.desc.trim() ),
        price: Number(cleanedValue || 0),
        stock: Number(row.stock.trim()) ?? 0,
     
      });
    })
    .on("end", () => {
      fs.unlinkSync(filePath);

      var resultado  = helper(results);
      
      console.log(resultado);

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(resultado);

    })
    .on("error", (error: Error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
