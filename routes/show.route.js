const File = require("../models/files.model");

const showRouter = require("express").Router();

showRouter.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", { error: "Link has been expired..." });
    }
    return res.render("download", {
      uuid: file.uuid,
      fileName: file.filename,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/downlaod/${file.uuid}`,
      //http://localhost:3000/files/download/2wer543we34567yrew22345675432q
    });
    return res.render("");
  } catch (error) {
    return res.render("download", { error: "Something went wrong" });
    console.log("Error in downloading file", error);
  }
});

module.exports = showRouter;
