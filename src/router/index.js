import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import Login from '../components/Login.vue';
import OrderDetail from '../components/OrderDetail.vue';
import OrderAccepted from "../components/OrderAccepted.vue"; // 导入新组件

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
    {
        path: "/order-detail",
        name: "OrderDetail",
        component: OrderDetail, // 添加新路由
    },
    {
        path: "/order-accepted",
        name: "OrderAccepted",
        component: OrderAccepted, // 新的接单成功页面
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
