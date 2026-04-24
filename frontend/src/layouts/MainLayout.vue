<template>
  <div class="main-layout">
    <header class="top-header" v-if="!isMobile">
      <div class="header-content">
        <div class="logo-section" @click="goTo('/home')">
          <div class="logo-icon">
            <el-icon :size="32"><HomeFilled /></el-icon>
          </div>
          <div class="logo-text">
            <h1>阳光小区</h1>
            <p>智慧物业 温馨家园</p>
          </div>
        </div>
        <nav class="nav-menu">
          <div
            class="nav-item"
            :class="{ active: currentRoute === 'home' }"
            @click="goTo('/home')"
          >
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </div>
          <div
            class="nav-item"
            :class="{ active: currentRoute === 'repair' }"
            @click="goTo('/repair')"
          >
            <el-icon><Tools /></el-icon>
            <span>线上报修</span>
          </div>
          <div
            class="nav-item"
            :class="{ active: currentRoute === 'visitor' }"
            @click="goTo('/visitor')"
          >
            <el-icon><User /></el-icon>
            <span>访客预约</span>
          </div>
          <div
            class="nav-item"
            :class="{ active: currentRoute === 'messages' }"
            @click="goTo('/messages')"
          >
            <el-badge :value="3" is-dot>
              <el-icon><Bell /></el-icon>
            </el-badge>
            <span>消息中心</span>
          </div>
        </nav>
        <div class="user-section">
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="36" class="user-avatar">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <span class="user-name">张三</span>
              <el-icon class="arrow-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><UserFilled /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="repairList">
                  <el-icon><List /></el-icon>
                  我的报修
                </el-dropdown-item>
                <el-dropdown-item command="visitorList">
                  <el-icon><Document /></el-icon>
                  预约记录
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <header class="mobile-header" v-else>
      <div class="mobile-header-content">
        <div class="mobile-logo" @click="goTo('/home')">
          <el-icon :size="24" color="#FF8C42"><HomeFilled /></el-icon>
          <span>阳光小区</span>
        </div>
        <div class="mobile-actions">
          <el-icon class="action-icon" @click="goTo('/messages')">
            <el-badge :value="3" is-dot>
              <Bell />
            </el-badge>
          </el-icon>
        </div>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="mobile-tabbar" v-if="isMobile">
      <div class="tabbar-item" :class="{ active: activeTab === 'home' }" @click="goTo('/home')">
        <el-icon :size="24"><HomeFilled /></el-icon>
        <span>首页</span>
      </div>
      <div class="tabbar-item" :class="{ active: activeTab === 'service' }" @click="showServiceDialog = true">
        <el-icon :size="24"><Service /></el-icon>
        <span>服务</span>
      </div>
      <div class="tabbar-item" :class="{ active: activeTab === 'profile' }" @click="goTo('/profile')">
        <el-icon :size="24"><UserFilled /></el-icon>
        <span>我的</span>
      </div>
    </footer>

    <el-dialog
      v-model="showServiceDialog"
      title="便民服务"
      width="90%"
      :show-close="true"
      center
    >
      <div class="service-dialog">
        <div class="service-grid">
          <div class="service-item" @click="goTo('/repair'); showServiceDialog = false">
            <div class="service-icon repair">
              <el-icon :size="28"><Tools /></el-icon>
            </div>
            <span>线上报修</span>
          </div>
          <div class="service-item" @click="goTo('/visitor'); showServiceDialog = false">
            <div class="service-icon visitor">
              <el-icon :size="28"><User /></el-icon>
            </div>
            <span>访客预约</span>
          </div>
          <div class="service-item">
            <div class="service-icon payment">
              <el-icon :size="28"><Wallet /></el-icon>
            </div>
            <span>物业缴费</span>
          </div>
          <div class="service-item">
            <div class="service-icon complaint">
              <el-icon :size="28"><ChatDotRound /></el-icon>
            </div>
            <span>投诉建议</span>
          </div>
          <div class="service-item">
            <div class="service-icon notice">
              <el-icon :size="28"><Bell /></el-icon>
            </div>
            <span>公告通知</span>
          </div>
          <div class="service-item">
            <div class="service-icon parking">
              <el-icon :size="28"><Car /></el-icon>
            </div>
            <span>车位管理</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isMobile = ref(window.innerWidth < 768)
const showServiceDialog = ref(false)

const currentRoute = computed(() => {
  const path = route.path
  if (path.includes('repair')) return 'repair'
  if (path.includes('visitor')) return 'visitor'
  if (path.includes('messages')) return 'messages'
  if (path.includes('profile')) return 'profile'
  return 'home'
})

const activeTab = computed(() => {
  const path = route.path
  if (path.includes('repair') || path.includes('visitor') || path.includes('payment')) return 'service'
  if (path.includes('profile') || path.includes('messages')) return 'profile'
  return 'home'
})

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const goTo = (path) => {
  router.push(path)
}

const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'repairList':
      router.push('/repair/list')
      break
    case 'visitorList':
      router.push('/visitor/list')
      break
    case 'logout':
      router.push('/login')
      break
  }
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

.main-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $bg-color;
}

.top-header {
  background: linear-gradient(135deg, $bg-card 0%, #FFFAF5 100%);
  box-shadow: 0 2px 12px $shadow-color;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    transform: translateX(4px);
  }
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
}

.logo-text {
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: $text-primary;
    line-height: 1.2;
    margin-bottom: 2px;
  }
  
  p {
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.2;
  }
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: $transition;
  font-size: 15px;
  font-weight: 500;
  color: $text-secondary;
  
  .el-icon {
    font-size: 18px;
  }
  
  &:hover {
    background: rgba($primary-color, 0.05);
    color: $primary-color;
  }
  
  &.active {
    background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-light, 0.1) 100%);
    color: $primary-color;
  }
}

.user-section {
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: $transition;
    
    &:hover {
      background: rgba($primary-color, 0.05);
    }
    
    .user-avatar {
      background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
      color: white;
    }
    
    .user-name {
      margin-left: 10px;
      margin-right: 6px;
      font-size: 14px;
      font-weight: 500;
      color: $text-primary;
    }
    
    .arrow-icon {
      color: $text-light;
      font-size: 12px;
      transition: $transition;
    }
  }
}

.mobile-header {
  background: linear-gradient(135deg, $bg-card 0%, #FFFAF5 100%);
  box-shadow: 0 2px 8px $shadow-color;
  position: sticky;
  top: 0;
  z-index: 100;
}

.mobile-header-content {
  height: 56px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  span {
    font-size: 18px;
    font-weight: 700;
    color: $text-primary;
  }
}

.mobile-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-icon {
  font-size: 22px;
  color: $text-secondary;
  cursor: pointer;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: $bg-color;
}

.mobile-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: $tabbar-height;
  background: $bg-card;
  border-top: 1px solid $border-color;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 8px 0;
  z-index: 1000;
  box-shadow: 0 -2px 12px $shadow-color;
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: $text-secondary;
  transition: $transition;
  padding: 4px 24px;
  position: relative;
  
  span {
    font-size: 12px;
  }
  
  &.active {
    color: $primary-color;
    
    .el-icon {
      transform: scale(1.1);
    }
  }
  
  &:hover {
    color: $primary-color;
  }
}

.service-dialog {
  padding: 20px 0;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 16px 8px;
  cursor: pointer;
  transition: $transition;
  border-radius: 12px;
  
  &:hover {
    background: rgba($primary-color, 0.05);
    transform: translateY(-2px);
  }
  
  span {
    font-size: 14px;
    color: $text-primary;
    font-weight: 500;
  }
}

.service-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.repair {
    background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
    color: white;
  }
  
  &.visitor {
    background: linear-gradient(135deg, $success-color 0%, #6BCB77 100%);
    color: white;
  }
  
  &.payment {
    background: linear-gradient(135deg, $info-color 0%, #95E1A3 100%);
    color: white;
  }
  
  &.complaint {
    background: linear-gradient(135deg, $danger-color 0%, #FF8E8E 100%);
    color: white;
  }
  
  &.notice {
    background: linear-gradient(135deg, $warning-color 0%, $accent-color 100%);
    color: #333;
  }
  
  &.parking {
    background: linear-gradient(135deg, #74B9FF 0%, #A8D8FF 100%);
    color: white;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
