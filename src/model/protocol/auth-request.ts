export class AuthenticationRequest{
	auth_type: string = "device_form";
	invitation_code: string;
	device_name: string;
	device_model: string;
	device_platform: "IOS" | "ANDROID" | "WINDOWS";
	device_uuid: string;
	device_os_version: string;
	device_manufacture: string;
	cordova: number = 1;
	bundle_id: string;
	localization: string;
}
