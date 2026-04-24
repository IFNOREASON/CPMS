<template>
  <div class="profile-info-container page-container">
    <div class="page-header">
      <el-button text @click="goBack">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </el-button>
      <h1 class="page-title">个人信息</h1>
    </div>

    <div class="avatar-section card">
      <div class="section-title">头像</div>
      <div class="avatar-content">
        <el-avatar :size="100" class="user-avatar">
          <el-icon :size="60"><UserFilled /></el-icon>
        </el-avatar>
        <el-button type="primary" text>
          <el-icon><Camera /></el-icon>
          更换头像
        </el-button>
      </div>
    </div>

    <div class="info-form card">
      <div class="section-title">基本信息</div>
      <el-form :model="formData" label-width="100px" class="info-form">
        <el-form-item label="姓名">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" disabled>
            <template #append>
              <el-button text type="primary">更换</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="formData.gender">
            <el-radio value="male">男</el-radio>
            <el-radio value="female">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
    </div>

    <div class="house-info card">
      <div class="section-header">
        <span class="section-title">房屋信息</span>
        <el-button type="primary" text size="small">
          <el-icon><Plus /></el-icon>
          绑定房屋
        </el-button>
      </div>
      <div class="house-list">
        <div class="house-item">
          <div class="house-icon">
            <el-icon :size="28"><OfficeBuilding /></el-icon>
          </div>
          <div class="house-detail">
            <div class="house-name">1号楼 2单元 301室</div>
            <div class="house-status">
              <el-tag size="small" type="success">已认证</el-tag>
            </div>
          </div>
          <el-button type="primary" text>
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <div class="action-section">
      <el-button type="primary" size="large" class="save-btn" @click="handleSave">
        保存修改
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
  name: '张三',
  phone: '13888888888',
  gender: 'male',
  email: ''
})

const goBack = () => {
  router.back()
}

const handleSave = () => {
  console.log('保存修改')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.profile-info-container {
  max-width: 600px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: $breakpoint-mobile) {
    margin-bottom: 16px;
  }
}

.page-title {
  margin-left: 12px;
  font-size: 20px;
  font-weight: 600;
}

.avatar-section {
  .avatar-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20px;
}

.user-avatar {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  color: white;
  margin-bottom: 16px;
}

.info-form {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.house-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.house-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: $bg-color;
  border-radius: $border-radius-sm;
}

.house-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba($primary-color, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary-color;
  margin-right: 16px;
}

.house-detail {
  flex: 1;
  
  .house-name {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 6px;
  }
}

.action-section {
  margin-top: 24px;
  padding-bottom: 40px;
}

.save-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
}
</style>
