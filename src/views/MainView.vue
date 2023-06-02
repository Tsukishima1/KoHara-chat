<template>
	<div class="container">
		<ul>
			<li v-for="(msg, index) in storeMsg.msgList" :key="index">{{ msg.username }}({{ msg.time }}): {{ msg.msg }}</li>
		</ul>
		<div class="input">
			<t-input v-model="msgdata" size="large" />
			<t-button size="large" theme="primary" @click="handleSendBtnClick">发送</t-button>
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
		})
	);
	msgdata.value = "";
};
onMounted(() => {
	websocket.init();
});
</script>

<style src="../assets/style/mainview.scss" lang="scss" scoped></style>
