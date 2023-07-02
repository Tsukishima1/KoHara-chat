<template>
	<div class="container">
		<div class="asidenav">
			<div class="box">
				<div class="header">
					<p class="headermsg">-{{ headermsg }}-</p>
					<p class="headerusername">{{ user }}</p>
				</div>
				<t-divider style="margin: 0px"></t-divider>
				<ul>
					<li><ChatIcon size="1.5rem" @click="router.push({ name: 'hallpage' })" /></li>
					<li><UsergroupIcon size="1.5rem" @click="router.push({ name: 'contactspage' })" /></li>
				</ul>
				<t-popconfirm content="确认退出登录吗？" @confirm="signout">
					<t-button>退出登录</t-button>
				</t-popconfirm>
			</div>
			<span class="backbtn" @click="turnOffNav = !turnOffNav">
				<img class="arrow" src="../assets/arrow.png" alt="" style="width: 25px; transform: rotate(180deg)" />
			</span>
		</div>
		<div class="main">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup lang="ts">
import { UsergroupIcon, ChatIcon } from "tdesign-icons-vue-next";
import router from "../router/index";
const user = sessionStorage.getItem("username") || "";
const headermsg = ref<string>("");
const time = parseInt(new Date().toLocaleString().slice(-8, -6));
const turnOffNav = ref<boolean>(false);
const signout = () => {
	router.push("/login");
};
onMounted(() => {
	if (time >= 6 && time <= 12) {
		headermsg.value = "早上好";
	} else if (time >= 13 && time <= 18) {
		headermsg.value = "下午好";
	} else {
		headermsg.value = "晚上好";
	}
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
