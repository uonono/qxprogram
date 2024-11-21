// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue'; // 主页面组件
import Login from '../components/Login.vue'; // 登录页面组件

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
