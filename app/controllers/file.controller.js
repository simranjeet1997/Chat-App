const uploadFolder =  './uploads/';
const fs = require('fs');



exports.listAllFiles = (req, res) => {
	fs.readdir(uploadFolder, (err, files) => {
		res.send(files);
	})
}

exports.downloadFile = (req, res) => {
	var filename = req.params.filename;
	res.download(uploadFolder + filename); 
}