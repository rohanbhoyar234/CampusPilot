// backend/middleware/analytics/uploadMiddleware.js

import multer from "multer";
import path from "path";


const storage = multer.memoryStorage(); 


const fileFilter = (req, file, cb) => {
  const filetypes = /xlsx|xls/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const allowedMimes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
    "application/vnd.ms-excel", 
  ];

  const mimetype = allowedMimes.includes(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only Excel files are allowed (.xlsx, .xls)"));
  }
};


const upload = multer({ storage });

export default upload;
