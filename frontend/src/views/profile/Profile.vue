<template>
  <div class="profile-container page-container">
    <div class="user-card">
      <div class="user-info">
        <el-avatar :size="80" class="user-avatar">
          <el-icon :size="48"><UserFilled /></el-icon>
        </el-avatar>
        <div class="user-detail">
          <h2 class="user-name">{{ userInfo.name }}</h2>
          <p class="user-phone">手机号：{{ userInfo.phone }}</p>
          <div class="house-info">
            <el-tag size="small" type="warning">已绑定房屋</el-tag>
            <span>{{ userInfo.houseInfo }}</span>
          </div>
        </div>
      </div>
      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-value">{{ userStats.repairCount }}</div>
          <div class="stat-label">报修记录</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userStats.visitorCount }}</div>
          <div class="stat-label">访客预约</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ userStats.messageCount }}</div>
          <div class="stat-label">未读消息</div>
        </div>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-group">
        <div class="menu-title">我的服务</div>
        <div class="menu-list">
          <div class="menu-item" @click="goTo('/repair/list')">
            <div class="menu-icon repair">
              <el-icon><Tools /></el-icon>
            </div>
            <span class="menu-text">报修记录</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="menu-item" @click="goTo('/visitor')">
            <div class="menu-icon visitor">
              <el-icon><User /></el-icon>
            </div>
            <span class="menu-text">访客预约</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="menu-item" @click="goTo('/payment/list')">
            <div class="menu-icon payment">
              <el-icon><Wallet /></el-icon>
            </div>
            <span class="menu-text">缴费记录</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="menu-item">
            <div class="menu-icon complaint">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <span class="menu-text">投诉建议</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="menu-group">
        <div class="menu-title">账户设置</div>
        <div class="menu-list">
          <div class="menu-item" @click="goTo('/profile/info')">
            <div class="menu-icon info">
              <el-icon><Edit /></el-icon>
            </div>
            <span class="menu-text">个人信息</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="menu-item">
            <div class="menu-icon house">
              <el-icon><OfficeBuilding /></el-icon>
            </div>
            <span class="menu-text">房屋管理</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="menu-item">
            <div class="menu-icon security">
              <el-icon><Lock /></el-icon>
            </div>
            <span class="menu-text">安全设置</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="menu-item">
            <div class="menu-icon notification">
              <el-icon><Bell /></el-icon>
            </div>
            <span class="menu-text">消息通知</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="menu-group">
        <div class="menu-title">其他</div>
        <div class="menu-list">
          <div class="menu-item">
            <div class="menu-icon help">
              <el-icon><QuestionFilled /></el-icon>
            </div>
            <span class="menu-text">帮助中心</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
          <div class="menu-item">
            <div class="menu-icon about">
              <el-icon><InfoFilled /></el-icon>
            </div>
            <span class="menu-text">关于我们</span>
            <el-icon class="menu-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="logout-section">
      <el-button type="danger" plain size="large" class="logout-btn" @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>
        退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userInfo = reactive({
  name: '张三',
  phone: '138****8888',
  houseInfo: '1号楼 2单元 301室'
})

const userStats = reactive({
  repairCount: 5,
  visitorCount: 3,
  messageCount: 2
})

const goTo = (path) => {
  router.push(path)
}

const handleLogout = () => {
  router.push('/login')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.profile-container {
  max-width: 800px;
  margin: 0 auto;
}

.user-card {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border-radius: $border-radius-lg;
  padding: 32px;
  margin-bottom: 24px;
  color: white;
  
  @media (max-width: $breakpoint-mobile) {
    padding: 24px;
    margin-bottom: 16px;
    border-radius: 0;
    margin-left: -16px;
    margin-right: -16px;
    margin-top: -16px;
  }
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.user-avatar {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.5);
  
  @media (max-width: $breakpoint-mobile) {
    width: 64px;
    height: 64px;
    
    .el-icon {
      font-size: 36px !important;
    }
  }
}

.user-detail {
  margin-left: 20px;
  
  .user-name {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 8px;
    
    @media (max-width: $breakpoint-mobile) {
      font-size: 20px;
    }
  }
  
  .user-phone {
    font-size: 14px;
    opacity: 0.9;
    margin-bottom: 12px;
  }
  
  .house-info {
    display: flex;
    align-items: center;
    gap: 10px;
    
    .el-tag {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
    }
    
    span {
      font-size: 13px;
      opacity: 0.9;
    }
  }
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  text-align: center;
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 13px;
    opacity: 0.9;
  }
}

.menu-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.menu-group {
  background: $bg-card;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: 0 4px 12px $shadow-color;
}

.menu-title {
  font-size: 13px;
  font-weight: 600;
  color: $text-secondary;
  padding: 16px 20px 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.menu-list {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    background: rgba($primary-color, 0.03);
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid $border-color;
  }
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  font-size: 20px;
  
  &.repair {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  &.visitor {
    background: rgba($success-color, 0.1);
    color: $success-color;
  }
  
  &.payment {
    background: rgba($info-color, 0.1);
    color: $info-color;
  }
  
  &.complaint {
    background: rgba($danger-color, 0.1);
    color: $danger-color;
  }
  
  &.info {
    background: rgba($accent-color, 0.2);
    color: #B8860B;
  }
  
  &.house {
    background: rgba(116, 185, 255, 0.1);
    color: #74B9FF;
  }
  
  &.security {
    background: rgba(156, 136, 255, 0.1);
    color: #9C88FF;
  }
  
  &.notification {
    background: rgba($warning-color, 0.15);
    color: #D4A017;
  }
  
  &.help {
    background: rgba(116, 185, 255, 0.1);
    color: #74B9FF;
  }
  
  &.about {
    background: rgba(156, 136, 255, 0.1);
    color: #9C88FF;
  }
}

.menu-text {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: $text-primary;
}

.menu-arrow {
  color: $text-light;
  font-size: 14px;
}

.logout-section {
  margin-top: 24px;
  padding-bottom: 40px;
  
  @media (max-width: $breakpoint-mobile) {
    margin-top: 16px;
    padding-bottom: 24px;
  }
}

.logout-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-color: $danger-color;
  color: $danger-color;
  
  &:hover {
    background: $danger-color;
    border-color: $danger-color;
    color: white;
  }
}
</style>
