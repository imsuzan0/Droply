const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/files.model");
const { v4: uuid4 } = require("uuid");
const sendEmail=require("../services/emailService")

const fileRouter = express.Router();

// Multer storage setup
let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
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

fileRouter.post("/send", async (req, res) => {
  try {
    const { uuid, receiver, sender } = req.body;
    if (!uuid || !receiver || !sender) {
      return res.status(422).json({ message: "All fields are required" });
    }

    //get data from database
    const file = await File.findOne({ uuid: uuid });
    if (file.sender) {
      return res.status(422).json({ message: "Email has been already sent" });
    }

    file.sender = sender;
    file.receiver = receiver;
    const response = await file.save();

    //send email
    sendEmail({
        from:sender,
        to:receiver,
        subject:"inshare file sharing",
        text:`${sender} shared a file with you.`,
        html:require("../services/emailTemplate")({
            emailFrom:sender,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+"KB",
            expires:"24 hours"
        })

    })
    return res
      .status(200)
      .json({ message: "Email has been sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = fileRouter;
