module.exports = function(context) {

	var Q = context.requireCordovaModule('q');
    var deferral = new Q.defer();

    var request = require('request'),
    StreamZip = require('node-stream-zip'),
    fs = require('fs'),
	fsx = require('fs-extra'),
	os = require('os'),
	path = require("path"),
	out = fs.createWriteStream('platforms/android/tess-two-master.zip'),
	child = require("child_process");
	
	console.log("Downloading Tesseract...");
	var reqStream = request('https://github.com/rmtheis/tess-two/archive/master.zip').pipe(out);
	reqStream.on('error', function(err) {
		console.log(err);
		deferral.reject("Could not download Tesseract archive");
	});
	out.on('finish', function() {
		console.log("Done downloading Tesseract archive");
		out.close(function() {});

		fsx.ensureDir('platforms/android/tess-two')
		.then(() => {
			var zip = new StreamZip({
				file: 'platforms/android/tess-two-master.zip',
				storeEntries: true
			});
			
			// Handle errors
			zip.on('error', err => { 
				console.error(err);
				deferral.reject("Tesseract archive is corrupt");
			});
						
			zip.on('ready', () => {
				console.log("zip ready");
				zip.extract('tess-two-master/tess-two', 'platforms/android/tess-two', err => {
					zip.close();
					if(err){
						deferral.reject("Could not extract Tesseract project from archive");
						return;
					}
					console.log("extracted");
					fsx.removeSync('platforms/android/tess-two-master.zip');
					var sdk = process.env.ANDROID_HOME.replace(/\\+/g, "/");
					var ndk = process.env.ANDROID_NDK_HOME.replace(/\\+/g, "/");
					fs.writeFile("platforms/android/tess-two/local.properties", "sdk.dir=" + sdk + "\r\nndk.dir=" + ndk, function(err) {
						if(err) {
							deferral.reject("Could not write local.properties");
							console.error(err);
							return;
						}
						fs.appendFile('platforms/android/settings.gradle', "include \":tess-two\"\r\n", function(err){
							if(err) {
								deferral.reject("Could not append to settings.gradle");
								console.error(err);
								return;
							}
							fs.writeFile("platforms/android/tess-two/build.gradle", `buildscript {
	repositories {
		google()
		jcenter()
	}
	dependencies {
		classpath 'com.android.tools.build:gradle:3.0.0'
		classpath 'com.github.dcendents:android-maven-gradle-plugin:1.4.1'
	}
}

apply plugin: 'com.android.library'
apply plugin: 'com.github.dcendents.android-maven'

android {
	compileSdkVersion project.ext.defaultCompileSdkVersion
	buildToolsVersion project.ext.defaultBuildToolsVersion

	defaultConfig {
		minSdkVersion 22
		targetSdkVersion 22
		versionCode 1
		versionName '1.0'
	}

	sourceSets {
		main {
			manifest.srcFile 'AndroidManifest.xml'
			java.srcDirs = ['src']
			res.srcDirs = ['res']
			jni.srcDirs = []
			jniLibs.srcDirs = ['libs']
		}
	}
}

dependencies {
	implementation fileTree(dir: 'libs', include: ['*.jar'])
	implementation "com.android.support:support-annotations:25.4.0"
}							
`, 							function(err){
								if(err) {
									deferral.reject("Could not write build.gradle");
									console.error(err);
									return;
								}
								deferral.resolve();
							});
						});
					});
				});
			});
		})
		.catch(err => {
			deferral.reject("Could not extract Tesseract project");
		})
	});

	return deferral.promise;
}
