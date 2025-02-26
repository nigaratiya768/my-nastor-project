const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");
const Leads = require("../schema/leadModel");
const readXlsxFile = require("read-excel-file/node");

const uploadExcelFile = (req, res) => {
  try {
    const filePath = path.join(global.rootPath, req.file.path);
    readXlsxFile(fs.createReadStream(filePath)).then(async (rows) => {
      // `rows` is an array of rows
      // each row being an array of cells.
      //console.log("rows", rows[0]);
      const results = rows.map((v) => {
        const data = {
          full_name: v[0],
          contact_no: v[1],
        };
        return data;
      });

      await Leads.insertMany(results, { ordered: false });
      return res
        .status(201)
        .json({ data: results, msg: "file uploaded successfully" });
    });
  } catch (error) {
    console.log("error in uploadExcelFile", error);
    return res.status(500).json({ msg: "server error" });
  }
};

const uploadFile = (req, res) => {
  try {
    // const file = req.file;
    // console.log(file);
    // res.send("process ok");
    console.log("dirName", __dirname);
    console.log("file path", req.file.path);
    const filePath = path.join(global.rootPath, req.file.path);
    const results = [];
    // Reading the CSV file
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data)) // Push each row into results array
      .on("end", async () => {
        console.log("CSV Data:", results);
        try {
          await Leads.insertMany(results, { ordered: false });
          res.json(results); // Send parsed data as JSON response
        } catch (error) {
          console.log("error", error);
          return res.status(500).json({ msg: "server error" });
        }
      });
  } catch (error) {
    console.log("error in uplaodFile", error);
    return res.status(500).json({ msg: "server error" });
  }
};

module.exports = { uploadExcelFile, uploadFile };
