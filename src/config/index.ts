export const Config: {
	devServerUrl: string,
	serverUrl: string,
	androidGcmId: string,
	isProd: boolean,
	getServerUrl(): string
} = {
	devServerUrl: "",
	serverUrl: "",
	androidGcmId: "",
	isProd: true,
	getServerUrl: function(){
		let url =  this.isProd ? this.serverUrl : this.devServerUrl;
		return url;
	}
};