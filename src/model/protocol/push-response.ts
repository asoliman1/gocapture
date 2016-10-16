export class PushResponse{
	registrationId: string;
	message : string;
	title : string;
	count : string;
	sound : string;
	image : string;
	launchArgs : string;
	additionalData: {foreground : boolean, coldstart: boolean, [key: string]: any};
}