const multer = require("multer");

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
}).any();

// Middleware function
const handleUpload = (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      // Handle the error
      return res.status(500).json({ error: "Failed to upload file." });
    }
    // Files have been uploaded successfully
    next();
  });
};

module.exports = handleUpload;
