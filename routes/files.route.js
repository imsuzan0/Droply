const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/files.model");
const { v4: uuid4 } = require("uuid");

const fileRouter = express.Router();

// Multer storage setup
let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads"),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// Multer middleware
let upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 * 100 }, // 100MB
});

// POST route using multer middleware
fileRouter.post("/", upload.single("myfile"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        const file = new File({
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size,
        });

        const response = await file.save();

        return res.status(200).json({
            file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
        });
    } catch (error) {
        console.error("Error saving file:", error);
        return res.status(500).json({ message: "Something went wrong" });
    }
});

module.exports = fileRouter;
