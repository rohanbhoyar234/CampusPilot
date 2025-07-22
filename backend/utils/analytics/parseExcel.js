import xlsx from "xlsx";

export const parseExcel = (fileBuffer) => {
  try {
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    return rows.map((row, index) => {
      const studentId =
        row["Student ID"] || row["StudentID"] || row["ID"] || `Unknown_${index}`;
      const name = row["Name"] || `Unnamed_${index}`;
      const subjectScores = {};

      for (let key in row) {
        const trimmedKey = key.trim();

        if (
          trimmedKey.toLowerCase() === "student id" ||
          trimmedKey.toLowerCase() === "studentid" ||
          trimmedKey.toLowerCase() === "id" ||
          trimmedKey.toLowerCase() === "name"
        ) {
          continue;
        }

        const raw = row[key];
        const score = Number(raw);

        if (!isNaN(score)) {
          subjectScores[trimmedKey] = score;
        } else {
          console.warn(`Invalid score at row ${index + 2}, column ${trimmedKey}:`, raw);
        }
      }

      const parsedRecord = {
        studentId: String(studentId).trim(),
        name: String(name).trim(),
        subjectScores,
        published: false,
      };

      console.log(`Parsed row ${index + 1}:`, parsedRecord);
      return parsedRecord;
    });
  } catch (err) {
    console.error("Excel parsing failed:", err);
    throw err;
  }
};
