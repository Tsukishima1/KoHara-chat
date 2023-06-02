<template>
	<div class="container">
		<p class="title">KoHara-Chat</p>
		<t-input v-model:value="username" class="username" size="large" placeholder="请输入用户名" />
		<t-input v-model:value="password" class="password" size="large" placeholder="请输入密码" type="password" />
		<t-button class="signbtn" @click="login">注册 / 登录</t-button>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const router = useRouter();
const username = ref<string>("");
const password = ref<string>("");
const login = () => {
	console.log(username.value, password.value);
	sessionStorage.setItem("username", username.value);
	sessionStorage.setItem("password", password.value);
	username.value = "";
	password.value = "";
	router.push("/chat");
};
</script>

<style lang="scss" scoped src="@/assets/style/loginview.scss"></style>
