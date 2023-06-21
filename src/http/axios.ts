import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

function myAxios(axiosConfig: any) {
	const service: AxiosInstance = axios.create({
		baseURL: "http://localhost:8000",
		timeout: 10000,
		headers: {
			post: {
				"Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
			},
			get: {
				"Content-Type": "application/json;charset=utf-8",
			},
		},
		// 是否跨站点访问控制请求
		// withCredentials: true,
		// transformRequest: [
		//     (data, headers) => {
		//         if (headers["Content-Type"] === "multipart/form-data") {
		//             return data;
		//         } else {
		//             headers["Content-Type"] = "application/json";
		//         }
		//         return JSON.stringify(data);
		//     },
		// ],
		// 使用async-await，处理reject情况较为繁琐，所以全部返回resolve，在业务代码中处理异常
		validateStatus() {
			return true;
		},
		transformResponse: [
			(data) => {
				if (typeof data === "string" && data.startsWith("{")) {
					data = JSON.parse(data);
				}
				return data;
			},
		],
	});

	// 设置请求拦截器
	service.interceptors.request.use(
		(config: InternalAxiosRequestConfig<any>) => {
			// Do something before request is sent
			// const token = store.getters.token;
			// if (token) {
			//     // 让每个请求携带自定义token
			//     // ['X-Token'] is a custom headers key
			//     config.headers["X-Token"] = token;
			// }
			return config;
		},
		(error) => {
			error.data = {};
			error.data.msg = "服务器异常！";
			return Promise.reject(error);
		}
	);

	// 设置响应拦截器
	// service.interceptors.response.use(
	// 	(response: AxiosResponse) => {
	// 		// Do something before response is sent
	// 		const status = response.status;
	// 		let msg = "";
	// 		if (status < 200 || status >= 300) {
	// 			msg = showStatus(status);
	// 			if (typeof response.data === "string") {
	// 				response.data = { msg };
	// 			} else {
	// 				response.data.msg = msg;
	// 			}
	// 		}
	// 		return response;
	// 	},
	// 	(error) => {
	// 		// // Do something with response error
	// 		// if (axios.isCancel(error)) {
	// 		//     console.log('repeated request:'+error.message);
	// 		// }
	// 		// else {
	// 		//     // 错误抛到业务代码
	// 		//     error.data = {};
	// 		//     error.data.msg = '请求超时或服务器异常，请检查网络或联系管理员！';
	// 		//     ElMessage.error(error.data.msg);
	// 		// }
	// 		return Promise.reject(error);
	// 	}
	// );

	return service(axiosConfig);
}

export default myAxios;
