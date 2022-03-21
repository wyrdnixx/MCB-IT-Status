const fs = require("fs");
const path = require("path");
const baseUrl = "/files/";
const getListFiles = (req, res) => {
  //const directoryPath = __basedir + "/resources/files/";
  const directoryPath = __dirname + "/../resources/files/";



  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      console.log("err scanning files in : ", directoryPath)
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }
    let fileInfos = [];
    files.forEach((file) => {
      if (path.extname(file) == ".pdf") {
        fileInfos.push({
          name: file,
          url: baseUrl + '../../files/' + file,
        });
      }

    });
    res.status(200).send(fileInfos);
  });
};

//inactive
const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __dirname + "/../resources/files/";
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      console.log("error downloading file: " + err)
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

const fileupload = (req, res) => {
  const directoryPath = __dirname + "/../resources/files/";
  console.log("Requested fileupload: " + req.files.file.name)

  // (B3-1) UPLOADED FILE & DESTINATION
  let upfile = req.files.file,
    updest = directoryPath + upfile.name;

  // (B3-2) MOVE UPLOADED FILE
  upfile.mv(updest, (err) => {
    if (err) { return res.status(500).send(err); }
    res.send("File uploaded!");
  });
}

module.exports = {
  getListFiles,
  download,
  fileupload
};