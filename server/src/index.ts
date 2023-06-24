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
	// password: "8_C5wow3t&nA", //密码
	database: "testtest", //要操作的数据库
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

// 登录
app.post("/userlogin", (req: Request, res: Response) => {
	const { username, password } = req.body;
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

// 注册
app.post("/userregister", (req: Request, res: Response) => {
	const { username, password } = req.body;
	db.query("SELECT * FROM user WHERE username = ?", [username], (err, results) => {
		if (err) {
			console.error(err);
			return res.status(500).send("连接失败！");
		}
		if (results.length > 0) {
			return res.status(200).send({ status: false, message: "该用户已存在!" });
		}
		// 插入数据
		db.query("INSERT INTO user SET ?", { username, password }, (error, result) => {
			if (error) {
				console.error(error);
				return res.status(500).send("连接失败！");
			}
			return res.status(200).send({ status: true, message: "注册成功！开始你的旅途吧" });
		});
	});
});

app.get("/", (req: Request, res: Response) => {
	res.send("Hello Typescript with Node.js!");
});

app.listen(PORT, (): void => {
	console.log(`Server Running here 👉 https://localhost:${PORT}`);
});
