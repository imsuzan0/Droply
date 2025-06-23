const express = require("express");
const connectDb = require("./db/db");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/files", require("./routes/files.route"));


const startServer = async () => {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
  });
};

startServer();
