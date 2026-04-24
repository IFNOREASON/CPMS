<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-left" v-if="!isMobile">
        <div class="brand-section">
          <div class="logo">
            <el-icon :size="48" color="#FF8C42"><HomeFilled /></el-icon>
          </div>
          <h1 class="title">小区物业管理系统</h1>
          <p class="subtitle">让生活更便捷，让服务更贴心</p>
        </div>
        <div class="features">
          <div class="feature-item">
            <el-icon :size="24" color="#FF8C42"><Tools /></el-icon>
            <span>线上报修，一键提交</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24" color="#FF8C42"><User /></el-icon>
            <span>访客预约，便捷通行</span>
          </div>
          <div class="feature-item">
            <el-icon :size="24" color="#FF8C42"><Wallet /></el-icon>
            <span>物业缴费，轻松办理</span>
          </div>
        </div>
      </div>
      <div class="login-right">
        <div class="mobile-logo" v-if="isMobile">
          <el-icon :size="48" color="#FF8C42"><HomeFilled /></el-icon>
          <h2>小区物业</h2>
        </div>
        <div class="login-form-wrapper">
          <h2 class="form-title">用户登录</h2>
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
            <el-form-item prop="phone">
              <el-input v-model="loginForm.phone" placeholder="请输入手机号" size="large">
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large" show-password>
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
              <span class="forgot-password" @click="handleForgotPassword">忘记密码？</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" class="login-btn" @click="handleLogin">
                登 录
              </el-button>
            </el-form-item>
            <div class="login-footer">
              <span>还没有账号？</span>
              <span class="register-link" @click="handleRegister">立即注册</span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginFormRef = ref(null)
const isMobile = ref(window.innerWidth < 768)

const loginForm = reactive({
  phone: '',
  password: '',
  rememberMe: false
})

const loginRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      router.push('/home')
    }
  })
}

const handleForgotPassword = () => {
  console.log('忘记密码')
}

const handleRegister = () => {
  console.log('注册')
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, $bg-color 0%, #FFE8D6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  
  @media (max-width: $breakpoint-mobile) {
    padding: 0;
  }
}

.login-wrapper {
  display: flex;
  width: 100%;
  max-width: 900px;
  background: $bg-card;
  border-radius: $border-radius-lg;
  box-shadow: 0 20px 60px $shadow-color;
  overflow: hidden;
  
  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    height: 100%;
    border-radius: 0;
    box-shadow: none;
  }
}

.login-left {
  width: 45%;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
}

.brand-section {
  .logo {
    margin-bottom: 20px;
  }
  
  .title {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  
  .subtitle {
    font-size: 16px;
    opacity: 0.9;
  }
}

.features {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  opacity: 0.95;
}

.login-right {
  width: 55%;
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: $breakpoint-mobile) {
    width: 100%;
    flex: 1;
    padding: 30px 24px;
  }
}

.mobile-logo {
  text-align: center;
  margin-bottom: 40px;
  
  h2 {
    margin-top: 12px;
    color: $primary-color;
    font-size: 24px;
    font-weight: 700;
  }
}

.login-form-wrapper {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 32px;
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
  
  :deep(.el-input__wrapper) {
    padding: 4px 16px;
  }
  
  :deep(.el-checkbox__label) {
    color: $text-secondary;
    font-size: 14px;
  }
}

.forgot-password {
  float: right;
  color: $primary-color;
  font-size: 14px;
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    color: $primary-dark;
  }
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: $text-secondary;
  font-size: 14px;
}

.register-link {
  color: $primary-color;
  cursor: pointer;
  font-weight: 500;
  margin-left: 4px;
  transition: $transition;
  
  &:hover {
    color: $primary-dark;
  }
}
</style>
