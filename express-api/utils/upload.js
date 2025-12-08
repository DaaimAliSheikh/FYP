const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const uploadDir = "images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."
      ),
      false
    );
  }
};

const upload = multer({ storage, fileFilter });

const deleteImage = (imageUrl) => {
  if (imageUrl) {
    const imageName = path.basename(imageUrl);
    const imagePath = path.join(uploadDir, imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
};

module.exports = { upload, deleteImage };
