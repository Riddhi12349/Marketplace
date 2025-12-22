import Papa from "papaparse";
import * as XLSX from "xlsx";

const parseFile = ({ file, mode }) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
      return;
    }

//  CSV
    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const rows = res.data.filter(row =>
            Object.values(row).some(
              val => val !== null && val !== "" && val !== undefined
            )
          );

          if (mode === "rows") {
            resolve({ rows });
          } else {
            resolve({
              columns: res.meta?.fields || [],
              rowCount: rows.length
            });
          }
        },
        error: (err) => reject(err)
      });
    }
//  EXCEL 
    else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          if (mode === "rows") {
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            resolve({ rows });
          } else {
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            resolve({
              columns: jsonData[0] || [],
              rowCount: Math.max(jsonData.length - 1, 0)
            });
          }
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = () => reject("FileReader error");
      reader.readAsArrayBuffer(file);
    } else {
      reject("Unsupported file type");
    }
  });
};

export default parseFile;
