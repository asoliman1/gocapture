cordova.define("cordova-plugin-tesseract.TesseractPlugin", function(require, exports, module) {
var TesseractPlugin = {
    recognizeText: function (image, language, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "TesseractPlugin", "recognizeText", [language, image]);
    },
    recognizeWords: function (image, language, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "TesseractPlugin", "recognizeWords", [language, image]);
    },
    recognizeWordsFromPath: function (imagePath, language, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "TesseractPlugin", "recognizeWordsFromPath", [language, imagePath]);
    },
    loadLanguage: function (language, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "TesseractPlugin", "loadLanguage", [language]);
    }
};
module.exports = TesseractPlugin;

});
