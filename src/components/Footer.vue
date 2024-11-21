<template>
  <div class="footer">
    <div class="active">
      <img src="#" alt="接单大厅" />
      接单大厅
    </div>
    <div>
      <img src="#" alt="消息" />
      消息
    </div>
    <div>
      <img src="#" alt="我的" />
      我的
    </div>
  </div>
</template>

<style>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
}
.footer div {
  text-align: center;
  font-size: 12px;
}
.footer img {
  width: 20px;
  height: 20px;
  margin-bottom: 5px;
}
.footer .active {
  color: #ff5252;
}
</style>
