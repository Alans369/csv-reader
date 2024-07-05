import express from "express";
import cors from "cors";
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(cors());

const upload = multer({ dest: "uploads/" });

interface CSVRow {
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  bankAccount: string;
  nit: string;
  dui: string;
  branch: string;
  isss: string;
  charge: string;
}
app.post("/upload-csv", upload.single("file"), (req, res) => {
  const results: Array<CSVRow> = [];

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  let index = 0;
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      index++;
      results.push({
        firstName : row.firstName,
        secondName : row.secondName,
        firstLastName : row.firstLastName,
        secondLastName : row.secondLastName,
        bankAccount : row.bankAccount,
        nit : row.nit,
        dui : row.dui,
        branch : row.branch,
        isss : row.isss,
        charge : row.charge,
      });
    })
    .on("end", () => {
      fs.unlinkSync(filePath);

      res.json(results);
    })
    .on("error", (error) => {
      res.status(500).json({ error: error.message });
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
