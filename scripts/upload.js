// /*
// evergreen.wpsuporthq.com

// sftp.wpsupporthq.com

// evergreen: P%8pT5bFCMA7#XRx

// */

const 	fs = require('fs'),
		SFTPClient = require('sftp-promises'),
		config = {
			host: '174.138.74.153', 
			port: 22,
			username:"ryanbmarx",
			privateKey: fs.readFileSync('/Users/ryanbmarx/.ssh/id_rsa') 
		},
		remotePath="//var/www/ryanbmarx.com/public_html/",
		localPath="/Users/ryanbmarx/Code/ryan-portfolio",
		sftp = new SFTPClient(config);
var filesToUpload = [];

process.argv.forEach((v, i) => {
	// Cycle through the arguments passed arguments and add them to the list
	// TO DO, add check for desired file types?
	// TO DO, look for dirs
	if (i > 1){
		filesToUpload.push(v);
	}
});


console.log("Uploading", filesToUpload);

filesToUpload.forEach(file => {
	sftp.put(`${localPath}/${file}`, `${remotePath}/${file}`)
		.then(function(success){
			if (success) console.log(`Uploaded ${file}`);
			else console.log(`Error uploading ${file}`);
		})
		.catch( function(file){
			console.log(`Error uploading ${file}`);
		})

})
