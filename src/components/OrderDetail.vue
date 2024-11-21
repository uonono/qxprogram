<template>
  <div class="order-detail">
    <h1>订单详情</h1>
    <div class="order-info">
      <p>订单号：{{ order.id }}</p>
      <p>维修项目：{{ order.content }}</p>
      <p>联系人：{{ order.contactName }} ({{ order.contactPhone }})</p>
      <p>地址：{{ order.addressAreaName }}</p>
    </div>
    <div class="confirm-section">
      <p>请确认阅读以下事项：</p>
      <ul>
        <li>
          <input type="checkbox" id="item1" v-model="confirmations[0]" />
          <label for="item1">维修服务标准</label>
        </li>
        <li>
          <input type="checkbox" id="item2" v-model="confirmations[1]" />
          <label for="item2">当前客户需注意事项</label>
        </li>
        <li>
          <input type="checkbox" id="item3" v-model="confirmations[2]" />
          <label for="item3">安全服务规范</label>
        </li>
      </ul>
    </div>
    <button :disabled="!isConfirmed" @click="confirmOrder">确认接单</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrderDetail",
  data() {
    return {
      order: {}, // 用于存储传递的订单数据
      confirmations: [false, false, false], // 确认条款的状态
    };
  },
  computed: {
    isConfirmed() {
      return this.confirmations.every((item) => item);
    },
  },
  methods: {
    async confirmOrder() {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `https://127.0.0.1:8769/faultOrder/accept/${this.order.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        if (response.data.isok) {
          // 接单成功，跳转到接单成功页面
          this.$router.push({
            name: "OrderAccepted",
            query: { order: JSON.stringify(this.order) },
          });
        } else {
          alert(`接单失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("接单失败:", error);
        alert("接单失败，请稍后重试！");
      }
    },
  },
  created() {
    // 接收传递的订单数据并解析
    this.order = JSON.parse(this.$route.query.order);
  },
};
</script>

<style scoped>
/* 样式保持不变 */
</style>
