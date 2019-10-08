var exec = require('cordova/exec');
var plugin = "cordova-plugin-gocapture-ocr";

exports.recognizeText = function (image, language, successCallback, errorCallback) {
	cordova.exec(successCallback, errorCallback, plugin, "recognizeText", [language, image]);
};

exports.loadLanguage = function (language, successCallback, errorCallback) {
	cordova.exec(successCallback, errorCallback, plugin, "loadLanguage", [language]);
};

exports.recognizeWords = function (image, language, successCallback, errorCallback) {
	cordova.exec(successCallback, errorCallback, plugin, "recognizeWords", [language, image]);
};

exports.recognizeWordsFromPath = function (imagePath, language, successCallback, errorCallback) {
	cordova.exec(successCallback, errorCallback, plugin, "recognizeWordsFromPath", [language, imagePath]);
};

