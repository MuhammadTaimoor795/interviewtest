const {
  allProduct,
  findByIdProduct,
  createProduct,
  updateProduct,
  deletProduct,
  bulkUpload,
} = require("../controller/product-controller");
const path = require("path");
const authenticateToken = require("../middleware/authenticateToken");
const multer = require("multer");
const { schemas, validationSchema } = require("../middleware/joivalidation");
// Configure multer for image upload
let uploadpath = path.join(__dirname, "../../public/upload/");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadpath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const router = require("express").Router();
// Get all products
router.get("/", authenticateToken, allProduct);

// Get a specific product by ID
router.get("/:id", authenticateToken, findByIdProduct);

// Create a new product
router.post("/", authenticateToken, upload.single("image"), createProduct);

// Update a specific product by ID
router.put("/:id", authenticateToken, upload.single("image"), updateProduct);

// Delete a specific product by ID
router.delete("/:id", authenticateToken, deletProduct);

// Bulk creation of products using a CSV file
router.post("/bulk", authenticateToken, upload.single("csv"), bulkUpload);

module.exports = router;
