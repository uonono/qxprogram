<template>
  <div class="order-list">
    <div v-if="orders.length === 0" class="empty-message">暂无订单</div>
    <div
        v-for="order in orders"
        :key="order.id"
        class="order-card"
    >
      <img
          src="https://static.wikia.nocookie.net/escapefromtarkov_gamepedia/images/6/61/Lcd-full.png/revision/latest?cb=20200424103324"
          alt="订单图片"
      />
      <div class="order-info">
        <h4>{{ order.orderTime }}</h4>
        <p>项目: {{ order.content }}</p>
        <p>联系人: {{ order.contactName }} ({{ order.contactPhone }})</p>
        <p>地址: {{ order.addressAreaName }}</p>
        <p class="distance">距离: {{ order.distance || '未知' }}km</p>
      </div>
      <button class="order-btn" @click="acceptOrder(order.id)">接单</button>
    </div>
  </div>
</template>

<script>
import request from '../main';

export default {
  data() {
    return {
      orders: [],
    };
  },
  methods: {
    async fetchOrders() {
      try {
        const result = await request('/faultOrder/findByPage', 'GET');
        if (result.isok && result.data) {
          this.orders = result.data;
        } else {
          alert(`获取数据失败: ${result.message}`);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('无法获取订单列表，请稍后重试！');
      }
    },
    async acceptOrder(orderId) {
      try {
        const result = await request(`/orders/${orderId}/accept`, 'POST');
        if (result.isok) {
          alert('接单成功！');
          this.fetchOrders();
        } else {
          alert(`接单失败: ${result.message}`);
        }
      } catch (error) {
        console.error('接单失败：', error);
        alert('接单失败，请稍后重试！');
      }
    },
  },
  mounted() {
    this.fetchOrders();
  },
};
</script>

<style>
.order-list {
  padding: 10px;
}
.order-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  padding: 10px;
}
.order-card img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}
.order-info {
  flex: 1;
  margin-left: 10px;
}
.order-info h4 {
  margin: 0;
  font-size: 16px;
}
.order-info p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}
.order-info .distance {
  color: #ff5252;
}
.order-btn {
  padding: 5px 10px;
  background: #ff5252;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
