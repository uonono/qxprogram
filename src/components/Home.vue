<template>
  <div class="home">
    <!-- Header -->
    <div class="header">
      <div class="tab active">接单大厅</div>
      <div class="tab">指派列表</div>
      <div class="tab">进行中</div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter">全部</div>
      <div class="filter">离我最近</div>
      <div class="filter">时间</div>
      <div class="filter">其他</div>
    </div>

    <!-- Order List -->
    <div class="order-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <img
            src="https://via.placeholder.com/80"
            alt="维修图片"
            class="order-image"
        />
        <div class="order-info">
          <h4>{{ order.orderTime }}</h4>
          <p>维修项目: {{ order.content }}</p>
          <p>联系人: {{ order.contactName }} ({{ order.contactPhone }})</p>
          <p>地址: {{ order.addressAreaName }}</p>
          <p class="distance">距离当前：{{ order.distance || "未知" }}</p>
        </div>
        <button class="order-btn" @click="acceptOrder(order.id)">接单</button>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <span @click="changePage(currentPage - 1)" :class="{ disabled: currentPage === 1 }">&lt;</span>
        <span
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="{ active: currentPage === page }"
        >
          {{ page }}
        </span>
        <span @click="changePage(currentPage + 1)" :class="{ disabled: currentPage === totalPages }">&gt;</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="tab active">
        <img src="https://via.placeholder.com/20" alt="接单大厅" />
        接单大厅
      </div>
      <div class="tab">
        <img src="https://via.placeholder.com/20" alt="消息" />
        消息
      </div>
      <div class="tab">
        <img src="https://via.placeholder.com/20" alt="我的" />
        我的
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders: [], // 订单数据
      currentPage: 1, // 当前页码
      totalPages: 1, // 总页数
      userLocation: null, // 用户当前位置
    };
  },
  methods: {
    // 获取用户位置
    getUserLocation() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                console.log(position.coords.latitude,position.coords.longitude)
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              },
              (error) => {
                console.error("获取地理位置失败:", error);
                alert("无法获取当前位置，请检查浏览器设置。");
                reject(error);
              }
          );
        } else {
          alert("浏览器不支持地理位置获取！");
          reject(new Error("Geolocation not supported"));
        }
      });
    },

    // 计算两点之间的直线距离
    calculateDistance(lat1, lon1, lat2, lon2) {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // 地球半径，单位为千米
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // 返回距离，单位为千米
    },

    // 获取订单数据
    async fetchOrders(pageNumber = 1) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `https://127.0.0.1:8769/faultOrder/findByPage?pageNumber=${pageNumber}&pageSize=10`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        if (response.data.isok) {
          const orders = response.data.data;

          // 如果用户位置信息已获取，计算距离
          if (this.userLocation) {
            orders.forEach((order) => {
              if (order.latitude && order.longitude) {
                order.distance = `${this.calculateDistance(
                    this.userLocation.latitude,
                    this.userLocation.longitude,
                    order.latitude,
                    order.longitude
                ).toFixed(2)} km`;
              } else {
                order.distance = "未知";
              }
            });
          }

          this.orders = orders;
          this.totalPages = Math.ceil(response.data.total / 10) || 1;
        } else {
          alert(`获取订单失败: ${response.data.message}`);
        }
      } catch (error) {
        console.error("获取订单数据失败:", error);
        alert("无法加载订单数据，请稍后重试。");
      }
    },

    // 接单操作
    async acceptOrder(orderId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
            `https://127.0.0.1:8769/faultOrder/accept/${orderId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        if (response.data.isok) {
          alert(`接单成功！订单 ID：${orderId}`);
          this.fetchOrders(); // 重新加载订单列表
        } else {
          alert(`接单失败：${response.data.message}`);
        }
      } catch (error) {
        console.error("接单失败:", error);
        alert("接单失败，请稍后重试！");
      }
    },

    // 切换页面
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchOrders(page); // 加载对应页面数据
      }
    },
  },
  async mounted() {
    try {
      // 获取用户位置
      this.userLocation = await this.getUserLocation();
      // 加载订单数据
      this.fetchOrders();
    } catch (error) {
      console.error("无法加载用户位置或订单数据:", error);
    }
  },
};
</script>

<style scoped>
/* 样式代码与之前一致 */
.header {
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  padding: 10px 0;
  border-bottom: 1px solid #e5e5e5;
}

.tab {
  flex: 1;
  text-align: center;
  font-size: 14px;
  padding: 5px 0;
  cursor: pointer;
}

.active {
  color: #ff5252;
  border-bottom: 2px solid #ff5252;
}

.filters {
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  padding: 10px 0;
  border-bottom: 1px solid #e5e5e5;
}

.filter {
  font-size: 14px;
  cursor: pointer;
}

.order-list {
  padding: 10px;
}

.order-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.order-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 10px;
}

.order-info {
  flex: 1;
}

.order-info h4 {
  margin: 0;
  font-size: 16px;
}

.order-info p {
  margin: 5px 0;
  font-size: 14px;
}

.distance {
  color: #ff5252;
}

.order-btn {
  background: #ff5252;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pagination span {
  margin: 0 5px;
  cursor: pointer;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.pagination span.active {
  background: #ff5252;
  color: #ffffff;
}

.pagination span.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.footer .tab {
  text-align: center;
  font-size: 12px;
}

.footer .tab img {
  display: block;
  margin: 0 auto 5px;
  width: 20px;
  height: 20px;
}
</style>
