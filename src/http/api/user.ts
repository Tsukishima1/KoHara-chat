import myAxios from "../axios";

export function userLogin(username: string, password: string) {
	return myAxios({
		url: "/userlogin",
		method: "post",
		data: {
			username,
			password,
		},
	});
}
