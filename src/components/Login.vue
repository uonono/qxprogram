<template>
  <div class="login-container">
    <h3>请输入您的手机号，登录或注册您的账号</h3>
    <div class="form-group">
      <input
          type="text"
          v-model="phone"
          placeholder="请输入手机号"
          maxlength="11"
          @input="validatePhone"
      />
    </div>
    <div class="form-group code-container">
      <input
          type="text"
          v-model="code"
          placeholder="请输入验证码"
          maxlength="6"
          @input="validateCode"
      />
      <button class="get-code-btn" :disabled="isCodeBtnDisabled" @click="sendCode">
        {{ codeBtnText }}
      </button>
    </div>
    <button class="submit-btn" :disabled="isSubmitDisabled" @click="login">
      开始
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      phone: '', // 手机号
      code: '', // 验证码
      countdown: 60, // 倒计时
      codeBtnText: '获取验证码', // 验证码按钮文案
      isCodeBtnDisabled: true, // 验证码按钮状态
      isSubmitDisabled: true, // 提交按钮状态
    };
  },
  methods: {
    // 验证手机号
    validatePhone() {
      const isValid = /^[1][3-9]\d{9}$/.test(this.phone);
      this.isCodeBtnDisabled = !isValid;
      this.validateCode();
    },
    // 验证验证码
    validateCode() {
      const isFormValid =
          this.code.length === 6 && /^[1][3-9]\d{9}$/.test(this.phone);
      this.isSubmitDisabled = !isFormValid;
    },
    // 发送验证码
    sendCode() {
      if (this.isCodeBtnDisabled) return;
      alert('验证码已发送，请查收！');
      this.startCountdown();
    },
    // 启动倒计时
    startCountdown() {
      this.isCodeBtnDisabled = true;
      this.codeBtnText = `${this.countdown}s后重试`;

      const interval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(interval);
          this.codeBtnText = '获取验证码';
          this.isCodeBtnDisabled = false;
          this.countdown = 60;
        } else {
          this.codeBtnText = `${this.countdown}s后重试`;
        }
      }, 1000);
    },
    // 登录
    async login() {
      if (this.isSubmitDisabled) return;

      const phone = this.phone.trim();
      const code = this.code.trim();

      try {
        const response = await fetch('https://localhost:5000/qx/authLogin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phone, code }),
        });

        const data = await response.json();
        if (data.isok) {
          const { token, userInfoResponse } = data.data;
          localStorage.setItem('token', token); // 保存 token
          localStorage.setItem(
              'userInfo',
              JSON.stringify(userInfoResponse)
          ); // 保存用户信息

          alert('登录成功！');
          console.log('用户信息：', userInfoResponse);

          // 跳转到主页
          this.$router.push('/');
        } else {
          alert(`登录失败: ${data.message}`);
        }
      } catch (error) {
        alert('登录失败，请稍后重试！');
        console.error('登录失败：', error);
      }
    },
  },
};
</script>

<style>
/* 样式代码 */
.login-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 320px;
  margin: 0 auto;
}

h3 {
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #ff5252;
}

.code-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.get-code-btn {
  padding: 10px;
  border: none;
  background: #ff5252;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.get-code-btn:disabled {
  background: #ddd;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  background: #ff5252;
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:disabled {
  background: #ddd;
  cursor: not-allowed;
}
</style>
