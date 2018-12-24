/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/* global Windows:true, URL:true, module:true, require:true, WinJS:true */

var CameraPreview = require('./CameraPreview');

var getAppData = function () {
    return Windows.Storage.ApplicationData.current;
};
var encodeToBase64String = function (buffer) {
    return Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
};
var OptUnique = Windows.Storage.CreationCollisionOption.generateUniqueName;
var CapMSType = Windows.Media.Capture.MediaStreamType;
var webUIApp = Windows.UI.WebUI.WebUIApplication;
var fileIO = Windows.Storage.FileIO;
var pickerLocId = Windows.Storage.Pickers.PickerLocationId;

module.exports = {

    startCamera: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
	},
	
	stopCamera: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	switchCamera: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	hide: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	show: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	takePicture: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setColorEffect: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setZoom: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getZoom: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getMaxZoom: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getHorizontalFOV: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setPreviewSize: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getSupportedPictureSizes: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getSupportedFlashModes: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getSupportedColorEffects: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setFlashMode: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getFlashMode: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getSupportedFocusModes: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setFocusMode: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	tapToFocus: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getExposureModes: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getExposureMode: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setExposureMode: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getExposureCompensation: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setExposureCompensation: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getSupportedWhiteBalanceModes: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	getWhiteBalanceMode: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	setWhiteBalanceMode: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    },
	
	onBackButton: function (successCallback, errorCallback, args) {
        var sourceType = args[2];

        //if (sourceType !== Camera.PictureSourceType.CAMERA) {
        //    takePictureFromFile(successCallback, errorCallback, args);
        //} else {
        //    takePictureFromCamera(successCallback, errorCallback, args);
        //}
    }
};


require('cordova/exec/proxy').add('CameraPreview', module.exports);
