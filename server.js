const express = require("express");
const connectDb = require("./db/db");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

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
