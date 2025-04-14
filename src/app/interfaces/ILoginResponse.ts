export interface ILoginResponse {
    token: string;
    user: {
        id: number;
        username: string;
        firstname: string;
        lastname: string;
    };
}
