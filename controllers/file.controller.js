const uploadFile = require("../middleware/upload");
var fs = require('fs');
const upload = async (req, res) => {
    try {
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
        }
        console.log("req=>", req.file.path)
        res.status(200).send({
            message: "Uploaded the file successfully.",
            fileName: req.file.path
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
    }
};

const getListFiles = (req, res) => {

    const directoryPath = __basedir + "/pdf/";

    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            });
        }

        let fileInfos = [];
        console.log("files===> ", files)
        if (files.length > 0) {
            files.forEach((file) => {
                fileInfos.push({
                    name: file,
                    url: file,
                });
            });
        }


        res.status(200).send(fileInfos);
    });
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/pdf/";

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });
        }
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
};