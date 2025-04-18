export interface ILoginResponse {
	token: string;
	user: {
		id: string;
		username: string;
		firstname: string;
		lastname: string;
	};
}

