const express = require("express");
const connectDb = require("./db/db");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const job=require("./services/cronjob")
job.start();

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();



const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

//cors
// const cors=require("cors")
const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

app.use(cors(corsOptions));

//template engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/files", require("./routes/files.route"));
app.use("/files", require("./routes/show.route"));
app.use("/files/download", require("./routes/download.route"));

const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
};

startServer();
