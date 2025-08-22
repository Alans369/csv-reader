import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";



const app = express();
const port = 8081;

app.use(cors());

const upload = multer({ dest: "uploads/" });

type  productos =  {
  name:string,
  description:string,
  minimumStock:0,
  propertyId:1,
  equipmentId:1,
  categoryId:0,
  modelId:1,
  price:number,
  priceA:number,
  priceB:number,
  priceC:number,
  priceD:number,
  code:"",
  number:string,
  supplierId: 1,
  branch: [
    {"id":1, "stock": 1}
  ],
  mainProducts: []
}



app.post("/csv", upload.single("file"), (req: Request, res: Response) => {

    const results: Array<productos> = [];

     if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
    let index = 0;
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row: any) => {

        console.log(row);
        index++;
        results.push({
        name:String( row.DESCRIPCION_EQUIPOS.trim()),
        description:"",
        minimumStock:0,
        propertyId:1,
        equipmentId:1,
        categoryId:0,
        modelId:1,
        price:row.HORA ? parseFloat(row.HORA.replace(".", "").replace(/[^0-9.-]+/g,"")) : 0,
        priceA:row.DIA ? parseFloat(row.DIA.replace(".", "").replace(/[^0-9.-]+/g,"")) : 0,
        priceB:row.SEMANA ? parseFloat(row.SEMANA.replace(".", "").replace(/[^0-9.-]+/g,"")) : 0,
        priceC:row["15DIAS"] ? parseFloat(row["15DIAS"].replace(".", "").replace(/[^0-9.-]+/g,"")) : 0,
        priceD:row.MES ? parseFloat(row.MES.replace(".", "").replace(/[^0-9.-]+/g,"")) : 0,
        code: "",
        number: index.toString(),
        supplierId: 1,
        branch: [
            {"id":1, "stock": 1}
        ],
        mainProducts: []
     
      });
       
      })
      .on("end", () => {
         fs.unlinkSync(filePath);
        console.log(results);
        res.json(results);
  
      })
      .on("error", (error: Error) => {
        res.status(500).json({ error: error.message });
      });
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
