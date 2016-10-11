import {Config} from "./";
const CONFIG = {
	serverUrl: "https://demo-api.leadliaison.com/v1.0"
};

export function setupConfig(){
	for(let field in CONFIG){
		Config[field] = CONFIG[field];
	}
}