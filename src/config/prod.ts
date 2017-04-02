import {Config} from "./";
const CFG = {
	serverUrl: "https://demo-api.leadliaison.com/v1.0",
	androidGcmId: "56276941492"
};

export function setupConfig(){
	for(var field in CFG){
		var val = CFG[field];
		Config[field] = val;
	}
}