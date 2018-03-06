const 	SftpUpload = require('sftp-upload'),
		fs = require('fs'),
		remotePath="//var/www/ryanbmarx.com/public_html/",
		localPath="/Users/ryanbmarx/Code/ryan-portfolio",
		subPath = process.argv[3] == undefined ? "" : process.argv[3],
		directoryToUpload = process.argv[2],
		serverConfig = {
			host: '174.138.74.153', 
			port: 22,
			path: directoryToUpload,
			remoteDir: `${remotePath}/${subPath}`,
			username:"ryanbmarx",
			privateKey: fs.readFileSync('/Users/ryanbmarx/.ssh/id_rsa') 
		},
		sftp = new SftpUpload(serverConfig);


sftp.on('error', err => console.log(err))
    .on('uploading', function(progress) {
        console.log('Uploading', progress.file);
        console.log(progress.percent+'% completed');
    })
    .on('completed', function() {
        console.log('Upload Completed');
    })
    .upload();