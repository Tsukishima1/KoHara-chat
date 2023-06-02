const wss = require("ws");

((Ws) => {
	const server = new Ws.Server({ port: 8080 });
	function bindEvent() {
		server.on("open", () => {
			console.log("ws opened");
		});
		server.on("close", () => {
			console.log("ws closed");
		});
		server.on("error", () => {
			console.log("ws error");
		});
		server.on("connection", (ws: any) => {
			console.log("ws connection");
			ws.on("message", (msg: string) => {
				server.clients.forEach((client: any) => {
					client.send(msg.toString());
				});
			});
		});
	}
	const init = () => {
		bindEvent();
	};

	init();
})(wss);
