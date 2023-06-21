<template>
	<t-message class="msg" :theme="theme" :content="message" :class="{ show: isShowMsg }" :close-btn="true" @close-btn-click="isShowMsg = false" />
	<div class="container">
		<p class="title">KoHara-Chat 💤</p>
		<t-input v-model:value="username" label="用户名" class="username" size="large" placeholder="点击输入..." />
		<t-input v-model:value="password" label="密码" class="password" size="large" placeholder="点击输入..." type="password" />
		<button class="signbtn" @click="login">注册 / 登录</button>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { userLogin } from "../http/api/user";
const router = useRouter();
const username = ref<string>("");
const password = ref<string>("");
const isShowMsg = ref<boolean>(false);
const message = ref<string>("用户名或密码不能为空");
const theme = ref<string>("error");

const login = async (): Promise<void> => {
	if (!username.value.trim() || !password.value.trim()) {
		isShowMsg.value = true;
		username.value = "";
		password.value = "";
		let timer = setInterval(() => {
			isShowMsg.value = false;
			clearInterval(timer);
		}, 4000);
		return;
	}
	let { data } = await userLogin(username.value.trim(), password.value.trim());
	if (data.status) {
		sessionStorage.setItem("username", username.value.trim());
		sessionStorage.setItem("password", password.value.trim());
		isShowMsg.value = true;
		message.value = "登录成功，正在跳转...";
		theme.value = "success";
		let timer = setInterval(() => {
			isShowMsg.value = false;
			clearInterval(timer);
			router.push("/chat");
		}, 1500);
		return;
	} else {
		isShowMsg.value = true;
		message.value = data.message;
		theme.value = "error";
		let timer = setInterval(() => {
			isShowMsg.value = false;
			clearInterval(timer);
		}, 1500);
		return;
	}
};
</script>

<style lang="scss" scoped src="@/assets/style/loginview.scss"></style>
