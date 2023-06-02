import { defineStore } from "pinia";
import { WS_ADDRESS } from "../config";

type Msg = {
	id: number;
	username: string;
	time: string;
	msg: string;
};
export const useStoreMsg = defineStore("storeMsg", () => {
	const msg = ref<string>("");
	const msgList = ref<Msg[]>([]);
	const addMsg = (msgdata: any) => {
		console.log("addMsg", msgdata);
		msgList.value.push(msgdata as Msg);
	};

	return {
		msgList,
		addMsg,
	};
});

export const useWebsocket = defineStore("websocket", () => {
	const ws = new WebSocket(WS_ADDRESS);

	const init = () => {
		ws.onopen = () => {
			console.log("ws opened");
		};
		ws.onclose = () => {
			console.log("ws closed");
		};
		ws.onmessage = (e) => {
			console.log("onmessage");
			console.log(JSON.parse(e.data));
			useStoreMsg().addMsg(JSON.parse(e.data));
		};
		ws.onerror = (e) => {
			console.log("ws error:", e);
		};
	};
	const send = (msg: string) => {
		ws.send(msg);
	};

	return {
		init,
		send,
	};
});
