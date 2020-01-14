export class User {
	id : number;
	customerID : number;
	customer_account_name : string;
	customer_name : string;
	customer_logo : string;
	access_token : string;
	first_name : string;
	last_name : string;
	user_name : string;
	email : string;
	title : string;
	user_profile_picture : string;
	is_active : 0 | 1;
	db: string;
	pushRegistered: 0 | 1 = 0;
	device_token: string;
	is_production: 0 | 1 = 1;
	theme: string;
	device_id: number;
	in_app_support : 0 | 1;
	documentation_url : string;
	support_email : string;
	app_name : string;
}
