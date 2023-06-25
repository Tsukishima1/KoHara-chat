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
						<div class="msg">{{ msg.msg }}</div>
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
		}, 400);
	} else {
		box.classList.remove("box_off");
		asidenav.classList.remove("asidenav_off");
		const timer = setInterval(() => {
			arrow.style.transform = "rotate(180deg)";
			clearInterval(timer);
		}, 400);
	}
});
</script>

<style src="../assets/style/mainview.scss" lang="scss" scoped></style>
