module.exports = function(context) {
	var Q = context.requireCordovaModule('q');
    var deferral = new Q.defer();

	var fs = require('fs'),
	path = require("path"),
	os = require('os'),
	child = require("child_process");
	
	var data = fs.readFileSync(path.join("platforms", "android", 'project.properties'), 'utf8');
	data = data.replace(/26\.\+/g, "25.+");
	fs.writeFileSync(path.join("platforms", "android", 'project.properties'), data, "utf8");
	if(data.indexOf("tess-two") == -1){
		var matches = data.match(/android\.library\.reference.(\d+)/igm);
		fs.appendFileSync(path.join("platforms", "android", 'project.properties'), "\r\nandroid.library.reference." + (matches.length + 1) + "=tess-two")
	}
	var ndk = process.env.ANDROID_NDK_HOME.replace(/\\+/g, "/");
	var ndkBuild = ndk + "/ndk-build" + (isWindows() ? ".cmd" : "");
	console.log("Building native Tesseract")
	var proc = child.spawn(ndkBuild, ["-C", context.opts.projectRoot + "/platforms/android/tess-two", "-j", os.cpus().length]);
	proc.on('exit', (code) => {
		console.log('Native build finished with code ' + code);
		deferral.resolve();
	});
	proc.stdout.on('data', (data) => {
		console.log(data.toString());
	});
	
	proc.stderr.on('data', (data) => {
		console.error(data.toString());
	});
	return deferral.promise;
}

function isWindows(){
	return process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys';
}