<template>
	<div class="container">
		<div class="asidenav">
			<div class="box">
				<div class="header">
					<p class="headermsg">-{{ headermsg }}-</p>
					<p class="headerusername">{{ user }}</p>
				</div>
				<t-popconfirm content="确认退出登录吗？" @confirm="signout">
					<t-button>退出登录</t-button>
				</t-popconfirm>
			</div>
			<span class="backbtn" @click="turnOffNav = !turnOffNav">
				<img class="arrow" src="../assets/arrow.png" alt="" style="width: 25px; transform: rotate(180deg)" />
			</span>
		</div>
		<div class="main">
			<div class="title">大厅</div>
			<ul class="msglist">
				<li v-if="!storeMsg.msgList.length" class="empty">
					<p>暂时还没有人发言诶，快来说句话吧！</p>
				</li>
				<li v-for="(msg, index) in storeMsg.msgList" :key="index" :class="{ usermsg: isUser(msg.username) }">
					<p v-if="!msg.isContinous" class="username">{{ msg.username }}</p>
					<div class="msgbox">
						<div class="msg" @contextmenu="showContextMenu">{{ msg.msg }}</div>
						<p class="time">{{ msg.time.slice(-8) }}</p>
					</div>
				</li>
			</ul>
			<t-divider class="divider" />
			<div class="input">
				<t-textarea ref="input" v-model="msgdata" type="text" size="large" :autosize="false" @keydown="handleKeydown" />
				<button class="btn" @click="handleSendBtnClick">发送</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useWebsocket, useStoreMsg } from "../stores/index";
import router from "../router/index";
const storeMsg = useStoreMsg();
const user = sessionStorage.getItem("username") || "";
const headermsg = ref<string>("");
const time = parseInt(new Date().toLocaleString().slice(-8, -6));
const websocket = useWebsocket();
const msgdata = ref<string>("");
const turnOffNav = ref<boolean>(false);
const input = ref<HTMLInputElement | null>(null);
const handleSendBtnClick = () => {
	if (!msgdata.value || !msgdata.value.trim()) {
		msgdata.value = "";
		return;
	}
	websocket.send(
		JSON.stringify({
			id: new Date().getTime(),
			username: sessionStorage.getItem("username") || "",
			time: new Date().toLocaleString(),
			msg: msgdata.value,
			isContinous: sessionStorage.getItem("username") === storeMsg.msgList[storeMsg.msgList.length - 1]?.username,
		})
	);
	msgdata.value = "";
};
function handleKeydown(_value: string, context: { e: KeyboardEvent }) {
	if (context.e.code === "Enter" && !context.e.shiftKey) {
		context.e.preventDefault();
		handleSendBtnClick();
	}
}
const signout = () => {
	router.push("/login");
};
const isUser = (username: string) => {
	return username === sessionStorage.getItem("username");
};
const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		console.log("Text copied to clipboard");
	} catch (err) {
		console.error("Failed to copy text: ", err);
	}
};
const showContextMenu = (event: MouseEvent) => {
	const beforemenu = document.querySelector(".menu");
	beforemenu?.remove();
	event.preventDefault();
	event.stopPropagation();
	const e = event.target as HTMLElement;
	const menu = document.createElement("div");
	// 菜单有复制和撤回两个选项
	menu.innerHTML = `
		<div class="menuitem_copy" @click="copy">复制</div>
		<div class="menuitem_revoke" @click="revoke">撤回</div>
	`;
	menu.classList.add("menu");
	menu.style.position = "absolute";
	menu.style.left = event.clientX + "px";
	menu.style.top = event.clientY + "px";
	document.body.appendChild(menu);
	const copy = document.querySelector(".menuitem_copy");
	copy?.addEventListener("click", () => {
		copyToClipboard(e.innerText);
		menu.remove();
	});
	const revoke = document.querySelector(".menuitem_revoke");
	revoke?.addEventListener("click", () => {
		// if (id) {
		// 	websocket.send(
		// 		JSON.stringify({
		// 			id,
		// 			username: sessionStorage.getItem("username") || "",
		// 			time: new Date().toLocaleString(),
		// 			msg: "撤回了一条消息",
		// 			isContinous: false,
		// 		})
		// 	);
		// }
		console.log("撤回");
		menu.remove();
	});
	document.addEventListener("click", () => {
		menu.remove();
	});
};
onMounted(() => {
	websocket.init();
	if (time >= 6 && time <= 12) {
		headermsg.value = "早上好";
	} else if (time >= 13 && time <= 18) {
		headermsg.value = "下午好";
	} else {
		headermsg.value = "晚上好";
	}
});
watch(storeMsg.msgList, () => {
	const msglist = document.querySelector(".msglist");
	setTimeout(() => {
		msglist?.scrollTo(0, msglist.scrollHeight);
	}, 0);
});
watch(turnOffNav, () => {
	const box = document.querySelector(".box") as HTMLElement;
	const asidenav = document.querySelector(".asidenav") as HTMLElement;
	const arrow = document.querySelector(".arrow") as HTMLElement;
	if (turnOffNav.value) {
		asidenav.classList.add("asidenav_off");
		box.classList.add("box_off");
		const timer = setInterval(() => {
			arrow.style.transform = "rotate(0)";
			clearInterval(timer);
		}, 200);
	} else {
		box.classList.remove("box_off");
		asidenav.classList.remove("asidenav_off");
		const timer = setInterval(() => {
			arrow.style.transform = "rotate(180deg)";
			clearInterval(timer);
		}, 200);
	}
});
</script>

<style src="../assets/style/mainview.scss" lang="scss" scoped></style>
