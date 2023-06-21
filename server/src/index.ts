// 引入Express框架和body-parser中间件
import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";

// 创建Express实例
const app: Application = express();

// 创建数据库连接
const db = mysql.createConnection({
	host: "localhost", //主机
	user: "root", //用户
	password: "123456", //密码
	database: "test", //要操作的数据库
});

// 连接数据库
db.connect((err) => {
	if (err) throw err;
	console.log("数据库连接成功");
});

// 设置服务器端口
const PORT = process.env.PORT || 8000;

// 使用body-parser中间件解析请求体
app.use(bodyParser.urlencoded({ extended: true }));
// 添加cors中间件解决跨域问题
app.use(cors());

app.post("/userlogin", (req: Request, res: Response) => {
	const { username, password } = req.body;

	// 实现登陆验证逻辑
	// 是否存在该用户
	db.query("SELECT * FROM user WHERE username = ?", [username], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send("连接失败！");
		}
		if (results.length === 0) {
			return res.status(200).send({ status: false, message: "该用户不存在!" });
		}
		// 检查密码是否正确
		const user = results[0];
		if (user.password !== password) {
			return res.status(200).send({ status: false, message: "用户名或密码错误!" });
		}

		//成功响应
		return res.status(200).send({ status: true, message: "登录成功！" });
	});
});

app.get("/", (req: Request, res: Response) => {
	res.send("Hello Typescript with Node.js!");
});

app.listen(PORT, (): void => {
	console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
