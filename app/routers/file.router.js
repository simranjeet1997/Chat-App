module.exports = (app, router, upload) => {
    const fileWorker = require('../controllers/file.controller.js');
	
	
	app.get('/api/photo', fileWorker.listAllFiles);
	
	app.get('/api/files/:filename', fileWorker.downloadFile);

	app.use('/',router);
 
	
}