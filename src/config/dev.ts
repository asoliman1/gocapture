import { Config } from "./";
const CFG = {
	serverUrl: "https://demo-api.leadliaison.com/v1.0",
	androidGcmId: "668502260026"
};

export function setupConfig() {
	for (var field in CFG) {
		var val = CFG[field];
		Config[field] = val;
	}
}

class FileTransfer {
	public download(source: string, target: string, successCallback: Function, errorCallback: Function, trustAllHosts: boolean, options: any) {
		setTimeout(() => {
			successCallback && successCallback({
				isFile: true,
				isDirectory: false,
				name: source.substr(source.lastIndexOf("/") + 1),
				fullPath: source,
				fileSystem: {},
				nativeURL: source
			});
		}, 500)
	}
}


window["FileTransfer"] = FileTransfer;
setTimeout(()=>{
	if(!window["cordova"]){
		window["cordova"] = <any>{
			file: {
				dataDirectory: "D:/"
			}
		}
	}
}, 6000);

window["device"] = {
	platform: "Android",
	model: "Note7",
	manufacturer: "Google",
	version: "5.2",
	uuid: "wqerqwerqwerqwerwerqwerqwerqweqr"
};