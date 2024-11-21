<template>
  <div class="order-accepted">
    <div class="success-icon">
      <img src="https://via.placeholder.com/100" alt="成功图标" />
    </div>
    <h2>接单成功</h2>
    <p>请您尽快与客户联系，确认预约上门时间。</p>
    <div class="order-info">
      <p>订单编号：{{ order.id }}</p>
      <p>下单时间：{{ order.orderTime }}</p>
      <p>客户姓名：{{ order.contactName }}</p>
      <p>联系方式：{{ order.contactPhone }}</p>
      <p>报修项目：{{ order.content }}</p>
    </div>
    <button @click="callCustomer">拨打电话</button>
  </div>
</template>

<script>
export default {
  name: "OrderAccepted",
  data() {
    return {
      order: {}, // 存储从路由传递的订单数据
    };
  },
  methods: {
    callCustomer() {
      alert(`拨打电话给客户：${this.order.contactPhone}`);
    },
  },
  created() {
    // 从路由获取订单数据
    this.order = JSON.parse(this.$route.query.order);
  },
};
</script>

<style scoped>
.order-accepted {
  text-align: center;
  padding: 20px;
}
.success-icon img {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}
.order-info {
  text-align: left;
  margin: 20px auto;
  max-width: 300px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
