const path = require("path");
module.exports = (req, res) => {
    const rootDir = path.dirname(require.main.filename);
    const fileName = req.params.filename;
    const directoryPath = `${rootDir}` + "/client/public/downloads/";
    res.setHeader('Content-Type', 'text/plain');
    res.download(directoryPath + fileName, fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not download the file. " + err,
        });
      }
    });
};