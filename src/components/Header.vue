<template>
  <div class="header">
    <div class="active">接单大厅</div>
    <div>指派列表</div>
    <div>进行中</div>
  </div>
</template>

<style>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
}
.header div {
  padding: 10px 20px;
  cursor: pointer;
}
.header .active {
  color: #ff5252;
  border-bottom: 2px solid #ff5252;
}
</style>
