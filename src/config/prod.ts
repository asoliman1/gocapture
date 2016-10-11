import {Config} from "./";
const CONFIG = {
	serverUrl: "https://prod.leadliaison.com"
};

export function setupConfig(){
	for(let field in CONFIG){
		Config[field] = CONFIG[field];
	}
}