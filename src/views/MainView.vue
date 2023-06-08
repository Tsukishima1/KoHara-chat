<template>
	<div class="container">
		<ul class="msglist">
			<li v-for="(msg, index) in storeMsg.msgList" :key="index" :class="{ usermsg: isUser(msg.username) }">
				<p v-if="!msg.isContinous" class="username">{{ msg.username }}</p>
				<div class="msgbox">
					<div class="msg">{{ msg.msg }}</div>
					<p class="time">{{ msg.time.slice(8) }}</p>
				</div>
			</li>
		</ul>
		<div class="input">
			<t-input v-model="msgdata" size="large" />
			<button class="btn" @click="handleSendBtnClick">发送</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useWebsocket, useStoreMsg } from "../stores/index";
const storeMsg = useStoreMsg();
const websocket = useWebsocket();
const msgdata = ref<string>("");
const handleSendBtnClick = () => {
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
const isUser = (username: string) => {
	return username === sessionStorage.getItem("username");
};
onMounted(() => {
	websocket.init();
});
watch(storeMsg.msgList, () => {
	const msglist = document.querySelector(".msglist");
	console.log(msglist?.scrollHeight);
	setTimeout(() => {
		msglist?.scrollTo(0, msglist.scrollHeight);
	}, 100);
});
</script>

<style src="../assets/style/mainview.scss" lang="scss" scoped></style>
