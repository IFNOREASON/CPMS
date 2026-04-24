<template>
  <div class="home-container">
    <div class="info-section">
      <div class="tab-header">
        <div
          class="tab-item"
          :class="{ active: activeTab === 'feature' }"
          @click="switchTab('feature')"
        >
          <el-icon><Star /></el-icon>
          热门推荐
        </div>
        <div
          class="tab-item"
          :class="{ active: activeTab === 'notice' }"
          @click="switchTab('notice')"
        >
          <el-icon><Promotion /></el-icon>
          小区公告
        </div>
      </div>

      <div class="carousel-wrapper" ref="carouselRef">
        <div
          class="carousel-track"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div
            v-for="(item, index) in currentItems"
            :key="index"
            class="carousel-item"
          >
            <div class="item-card">
              <div class="item-badge" :class="item.type">
                {{ getBadgeText(item) }}
              </div>
              <div class="item-content">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-desc">{{ item.desc || item.time }}</div>
              </div>
              <div class="item-arrow">
                <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>

        <div class="carousel-dots">
          <span
            v-for="(_, index) in currentItems"
            :key="index"
            class="dot"
            :class="{ active: index === currentIndex }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>
    </div>

    <div class="main-content">
      <div class="welcome-card">
        <div class="welcome-info">
          <div class="greeting">
            <el-icon :size="24"><Sunny /></el-icon>
            <span>{{ greetingText }}</span>
          </div>
          <h2 class="user-name">您好，{{ userName }}</h2>
          <p class="house-info">
            <el-icon><Location /></el-icon>
            1号楼 2单元 301室
          </p>
        </div>
        <div class="weather-info">
          <div class="weather-icon">
            <el-icon :size="40"><PartlyCloudy /></el-icon>
          </div>
          <div class="weather-detail">
            <div class="temperature">23°C</div>
            <div class="weather-text">晴转多云</div>
          </div>
        </div>
      </div>

      <div class="service-section">
        <div class="section-header">
          <h3 class="section-title">便民服务</h3>
          <span class="more-link" @click="goTo('/repair')">更多服务 <el-icon><ArrowRight /></el-icon></span>
        </div>
        <div class="service-grid">
          <div class="service-item" @click="goTo('/repair')">
            <div class="service-icon repair">
              <el-icon :size="32"><Tools /></el-icon>
            </div>
            <span class="service-name">线上报修</span>
          </div>
          <div class="service-item" @click="goTo('/visitor')">
            <div class="service-icon visitor">
              <el-icon :size="32"><User /></el-icon>
            </div>
            <span class="service-name">访客预约</span>
          </div>
          <div class="service-item">
            <div class="service-icon payment">
              <el-icon :size="32"><Wallet /></el-icon>
            </div>
            <span class="service-name">物业缴费</span>
          </div>
          <div class="service-item">
            <div class="service-icon complaint">
              <el-icon :size="32"><ChatDotRound /></el-icon>
            </div>
            <span class="service-name">投诉建议</span>
          </div>
          <div class="service-item">
            <div class="service-icon notice">
              <el-icon :size="32"><Bell /></el-icon>
            </div>
            <span class="service-name">公告通知</span>
          </div>
          <div class="service-item">
            <div class="service-icon parking">
              <el-icon :size="32"><Car /></el-icon>
            </div>
            <span class="service-name">车位管理</span>
          </div>
          <div class="service-item">
            <div class="service-icon express">
              <el-icon :size="32"><Box /></el-icon>
            </div>
            <span class="service-name">快递代收</span>
          </div>
          <div class="service-item">
            <div class="service-icon more">
              <el-icon :size="32"><MoreFilled /></el-icon>
            </div>
            <span class="service-name">更多服务</span>
          </div>
        </div>
      </div>

      <div class="life-service-section">
        <div class="section-header">
          <h3 class="section-title">
            <el-icon><TrendCharts /></el-icon>
            生活增值服务
          </h3>
          <span class="more-link">更多 <el-icon><ArrowRight /></el-icon></span>
        </div>
        <div class="life-service-grid">
          <div class="life-service-item">
            <div class="life-service-card">
              <div class="life-service-icon neighbor">
                <el-icon :size="28"><ChatLineSquare /></el-icon>
              </div>
              <div class="life-service-info">
                <div class="life-service-name">邻里互动</div>
                <div class="life-service-desc">邻里交流、二手交易、社区活动</div>
              </div>
              <div class="life-service-badge">
                <el-tag size="small" type="warning">热门</el-tag>
              </div>
            </div>
          </div>
          <div class="life-service-item">
            <div class="life-service-card">
              <div class="life-service-icon housekeeping">
                <el-icon :size="28"><House /></el-icon>
              </div>
              <div class="life-service-info">
                <div class="life-service-name">家政预约</div>
                <div class="life-service-desc">保洁、维修、保姆、月嫂服务</div>
              </div>
              <div class="life-service-badge">
                <el-tag size="small" type="success">推荐</el-tag>
              </div>
            </div>
          </div>
          <div class="life-service-item">
            <div class="life-service-card">
              <div class="life-service-icon groupbuy">
                <el-icon :size="28"><ShoppingCart /></el-icon>
              </div>
              <div class="life-service-info">
                <div class="life-service-name">社区团购</div>
                <div class="life-service-desc">新鲜食材、生活用品、优惠折扣</div>
              </div>
              <div class="life-service-badge">
                <el-tag size="small" type="danger">限时特惠</el-tag>
              </div>
            </div>
          </div>
          <div class="life-service-item">
            <div class="life-service-card">
              <div class="life-service-icon pet">
                <el-icon :size="28"><VideoCamera /></el-icon>
              </div>
              <div class="life-service-info">
                <div class="life-service-name">宠物管理</div>
                <div class="life-service-desc">宠物登记、疫苗提醒、宠物社交</div>
              </div>
              <div class="life-service-badge">
                <el-tag size="small" type="info">新功能</el-tag>
              </div>
            </div>
          </div>
          <div class="life-service-item full-width">
            <div class="life-service-card">
              <div class="life-service-icon care">
                <el-icon :size="28"><FirstAidKit /></el-icon>
              </div>
              <div class="life-service-info">
                <div class="life-service-name">老人/儿童关怀</div>
                <div class="life-service-desc">紧急求助、健康监测、关爱服务、儿童托管</div>
              </div>
              <div class="life-service-badge">
                <el-tag size="small" type="warning">暖心服务</el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-info">
        <p>© 2024 阳光小区物业管理系统</p>
        <p>物业服务热线：400-888-8888</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = ref('张三')

const activeTab = ref('feature')
const currentIndex = ref(0)
const progressPercent = ref(0)

const CAROUSEL_INTERVAL = 3000
let timer = null
let progressTimer = null

const getCurrentHour = () => {
  return new Date().getHours()
}

const greetingText = computed(() => {
  const hour = getCurrentHour()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const features = ref([
  {
    id: 1,
    title: '人脸门禁已上线',
    desc: '支持人脸快速通行，无需携带门禁卡',
    type: 'new'
  },
  {
    id: 2,
    title: '春节物业服务安排',
    desc: '春节期间物业服务中心正常开放',
    type: 'hot'
  },
  {
    id: 3,
    title: '小区电动车充电站启用',
    desc: '新增10个充电位，欢迎使用',
    type: 'new'
  },
  {
    id: 4,
    title: '垃圾分类知识普及',
    desc: '共建绿色美好家园，从垃圾分类开始',
    type: 'normal'
  }
])

const notices = ref([
  {
    id: 1,
    title: '关于小区消防设施检查的通知',
    time: '2024-01-15',
    type: 'important'
  },
  {
    id: 2,
    title: '春节期间物业服务安排',
    time: '2024-01-10',
    type: 'normal'
  },
  {
    id: 3,
    title: '关于禁止高空抛物的温馨提示',
    time: '2024-01-08',
    type: 'normal'
  },
  {
    id: 4,
    title: '小区停水通知（紧急）',
    time: '2024-01-06',
    type: 'important'
  }
])

const currentItems = computed(() => {
  return activeTab.value === 'feature' ? features.value : notices.value
})

const getBadgeText = (item) => {
  const map = {
    new: '新功能',
    hot: '热门',
    normal: '推荐',
    important: '重要',
    notice: '通知'
  }
  return map[item.type] || ''
}

const switchTab = (tab) => {
  activeTab.value = tab
  currentIndex.value = 0
  progressPercent.value = 0
  resetCarousel()
}

const goToSlide = (index) => {
  currentIndex.value = index
  progressPercent.value = 0
  resetCarousel()
}

const nextSlide = () => {
  if (currentItems.value.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % currentItems.value.length
  progressPercent.value = 0
}

const startProgress = () => {
  if (progressTimer) clearInterval(progressTimer)
  progressPercent.value = 0
  
  const step = 100 / (CAROUSEL_INTERVAL / 50)
  progressTimer = setInterval(() => {
    progressPercent.value += step
    if (progressPercent.value >= 100) {
      progressPercent.value = 100
    }
  }, 50)
}

const startCarousel = () => {
  if (currentItems.value.length <= 1) return
  
  if (timer) clearInterval(timer)
  startProgress()
  
  timer = setInterval(() => {
    nextSlide()
    startProgress()
  }, CAROUSEL_INTERVAL)
}

const resetCarousel = () => {
  startCarousel()
}

const goTo = (path) => {
  router.push(path)
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (progressTimer) {
    clearInterval(progressTimer)
    progressTimer = null
  }
})
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.home-container {
  width: 100%;
  min-height: 100vh;
  background: $bg-color;
}

.info-section {
  background: linear-gradient(135deg, $bg-card 0%, #FFFAF5 100%);
  box-shadow: 0 2px 12px $shadow-color;
  padding-bottom: 16px;
}

.tab-header {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 20px 0;
  
  @media (max-width: $breakpoint-mobile) {
    padding: 12px 16px 0;
  }
}

.tab-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: $text-secondary;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: $transition;
  position: relative;
  
  &:hover {
    color: $primary-color;
    background: rgba($primary-color, 0.03);
  }
  
  &.active {
    color: $primary-color;
    background: $bg-color;
    font-weight: 600;
  }
  
  &.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 32px;
    height: 3px;
    background: $primary-color;
    border-radius: 2px;
  }
  
  @media (max-width: $breakpoint-mobile) {
    padding: 10px 16px;
    font-size: 14px;
    
    .el-icon {
      font-size: 16px;
    }
  }
}

.carousel-wrapper {
  max-width: 1200px;
  margin: 16px auto 0;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: $breakpoint-mobile) {
    padding: 0 16px;
    margin-top: 12px;
  }
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex-shrink: 0;
  width: 100%;
  padding: 0 4px;
  box-sizing: border-box;
}

.item-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-light, 0.1) 100%);
  border-radius: $border-radius;
  border: 1px solid rgba($primary-color, 0.15);
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px $shadow-color;
  }
  
  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}

.item-badge {
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 16px;
  white-space: nowrap;
  
  &.new {
    background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
    color: white;
  }
  
  &.hot {
    background: linear-gradient(135deg, $danger-color 0%, #FF8E8E 100%);
    color: white;
  }
  
  &.normal {
    background: rgba($info-color, 0.15);
    color: $info-color;
  }
  
  &.important {
    background: linear-gradient(135deg, $danger-color 0%, #FF8E8E 100%);
    color: white;
  }
  
  &.notice {
    background: rgba($primary-color, 0.15);
    color: $primary-color;
  }
  
  @media (max-width: $breakpoint-mobile) {
    margin-right: 12px;
    padding: 4px 10px;
    font-size: 11px;
  }
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 14px;
  }
}

.item-desc {
  font-size: 13px;
  color: $text-secondary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 12px;
  }
}

.item-arrow {
  margin-left: 12px;
  color: $text-light;
  font-size: 18px;
  transition: $transition;
  
  .item-card:hover & {
    color: $primary-color;
    transform: translateX(4px);
  }
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 3px;
  background: rgba($primary-color, 0.1);
  border-radius: 2px;
  margin-top: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary-color 0%, $primary-light 100%);
  border-radius: 2px;
  transition: width 0.05s linear;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba($primary-color, 0.25);
  cursor: pointer;
  transition: $transition;
  
  &.active {
    width: 24px;
    border-radius: 4px;
    background: linear-gradient(90deg, $primary-color 0%, $primary-light 100%);
  }
  
  &:hover {
    background: rgba($primary-color, 0.5);
  }
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  padding-bottom: 100px;
  
  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
    padding-bottom: 80px;
  }
}

.welcome-card {
  background: $bg-card;
  border-radius: $border-radius-lg;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px $shadow-color;
  
  @media (max-width: $breakpoint-mobile) {
    padding: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
}

.welcome-info {
  .greeting {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: $text-secondary;
    margin-bottom: 8px;
    
    .el-icon {
      color: $warning-color;
    }
  }
  
  .user-name {
    font-size: 24px;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 8px;
    
    @media (max-width: $breakpoint-mobile) {
      font-size: 20px;
    }
  }
  
  .house-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: $text-secondary;
    
    .el-icon {
      color: $primary-color;
    }
  }
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(116, 185, 255, 0.1) 0%, rgba(168, 216, 255, 0.1) 100%);
  border-radius: $border-radius;
  
  @media (max-width: $breakpoint-mobile) {
    width: 100%;
    margin-top: 16px;
    justify-content: center;
  }
  
  .weather-icon {
    color: #74B9FF;
  }
  
  .weather-detail {
    .temperature {
      font-size: 24px;
      font-weight: 700;
      color: $text-primary;
    }
    
    .weather-text {
      font-size: 13px;
      color: $text-secondary;
    }
  }
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
  
  .el-icon {
    color: $primary-color;
  }
}

.more-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: $primary-color;
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    color: $primary-dark;
  }
}

.service-section {
  margin-bottom: 24px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  @media (max-width: $breakpoint-tablet) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
}

.service-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px;
  background: $bg-card;
  border-radius: $border-radius;
  cursor: pointer;
  transition: $transition;
  box-shadow: 0 2px 12px $shadow-color;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px $shadow-color;
  }
  
  @media (max-width: $breakpoint-mobile) {
    padding: 16px 8px;
  }
}

.service-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  
  @media (max-width: $breakpoint-mobile) {
    width: 44px;
    height: 44px;
    margin-bottom: 8px;
    
    .el-icon {
      font-size: 24px !important;
    }
  }
  
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
  
  &.express {
    background: linear-gradient(135deg, #9C88FF 0%, #C5B8FF 100%);
    color: white;
  }
  
  &.more {
    background: linear-gradient(135deg, $text-light 0%, #CCCCCC 100%);
    color: white;
  }
}

.service-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 12px;
  }
}

.life-service-section {
  margin-bottom: 24px;
}

.life-service-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.life-service-item {
  &.full-width {
    grid-column: span 2;
    
    @media (max-width: $breakpoint-mobile) {
      grid-column: span 1;
    }
  }
}

.life-service-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: $bg-card;
  border-radius: $border-radius;
  cursor: pointer;
  transition: $transition;
  box-shadow: 0 2px 12px $shadow-color;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px $shadow-color;
  }
  
  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}

.life-service-icon {
  width: 56px;
  height: 56px;
  border-radius: $border-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
  
  @media (max-width: $breakpoint-mobile) {
    width: 48px;
    height: 48px;
    margin-right: 12px;
    
    .el-icon {
      font-size: 24px !important;
    }
  }
  
  &.neighbor {
    background: linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%);
    color: white;
  }
  
  &.housekeeping {
    background: linear-gradient(135deg, #A8EDEA 0%, #FED6E3 100%);
    color: white;
  }
  
  &.groupbuy {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &.pet {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }
  
  &.care {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
  }
}

.life-service-info {
  flex: 1;
  min-width: 0;
}

.life-service-name {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 6px;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 15px;
  }
}

.life-service-desc {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: $breakpoint-mobile) {
    font-size: 12px;
  }
}

.life-service-badge {
  margin-left: 12px;
  flex-shrink: 0;
  
  @media (max-width: $breakpoint-mobile) {
    margin-left: 8px;
  }
}

.footer-info {
  text-align: center;
  padding: 20px 0;
  color: $text-light;
  font-size: 13px;
  
  p {
    margin-bottom: 4px;
  }
}
</style>
