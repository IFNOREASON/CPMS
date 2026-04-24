<template>
  <div class="payment-success-container page-container">
    <div class="success-card">
      <div class="success-icon">
        <el-icon :size="80" color="#6BCB77"><CircleCheckFilled /></el-icon>
      </div>
      <div class="success-title">支付成功</div>
      <div class="success-subtitle">您的物业费已缴纳成功</div>

      <div class="payment-details">
        <div class="detail-item">
          <span class="detail-label">缴费金额</span>
          <span class="detail-value highlight">¥{{ paymentInfo.amount }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">缴费时长</span>
          <span class="detail-value">{{ paymentInfo.monthsLabel }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">支付方式</span>
          <span class="detail-value">{{ paymentInfo.methodLabel }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">订单编号</span>
          <span class="detail-value">{{ paymentInfo.orderNo }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">支付时间</span>
          <span class="detail-value">{{ paymentInfo.payTime }}</span>
        </div>
      </div>

      <div class="gift-section" v-if="giftList.length > 0">
        <div class="gift-header">
          <el-icon :size="18" color="#FF6B6B"><Gift /></el-icon>
          <span class="gift-title">预缴赠品</span>
          <el-tag type="success" size="small">已赠送</el-tag>
        </div>
        <div class="gift-list">
          <div v-for="gift in giftList" :key="gift.name" class="gift-item">
            <div class="gift-icon">
              <el-icon :size="24" :color="gift.color">{{ gift.icon }}</el-icon>
            </div>
            <div class="gift-info">
              <div class="gift-name">{{ gift.name }}{{ gift.quantity > 1 ? ` x${gift.quantity}` : '' }}</div>
              <div class="gift-desc">{{ gift.desc }}</div>
            </div>
            <el-tag type="success" size="small">已发放</el-tag>
          </div>
        </div>
        <div class="gift-tip">
          <el-icon :size="14" color="#FF8C42"><InfoFilled /></el-icon>
          <span>赠品将在3个工作日内由物业管家联系您发放，或您可前往物业服务中心领取。</span>
        </div>
      </div>

      <div class="action-buttons">
        <el-button size="large" @click="goToPaymentList">
          <el-icon><Document /></el-icon>
          查看缴费记录
        </el-button>
        <el-button type="primary" size="large" @click="goToHome">
          <el-icon><HomeFilled /></el-icon>
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const paymentInfo = reactive({
  amount: route.query.amount || '0.00',
  months: Number(route.query.months) || 12,
  method: route.query.method || 'wechat',
  orderNo: '',
  payTime: ''
})

const paymentInfoLabel = computed(() => {
  const months = paymentInfo.months
  if (months === 1) return '1个月'
  if (months === 3) return '3个月'
  if (months === 6) return '6个月'
  if (months === 12) return '1年'
  if (months === 24) return '2年'
  if (months === 36) return '3年'
  if (months === 60) return '5年'
  return `${months}个月`
})

const methodLabel = computed(() => {
  const map = {
    wechat: '微信支付',
    alipay: '支付宝',
    bank: '银行卡支付'
  }
  return map[paymentInfo.method] || '其他支付'
})

paymentInfo.monthsLabel = paymentInfoLabel.value
paymentInfo.methodLabel = methodLabel.value
paymentInfo.orderNo = `WY${Date.now().toString().slice(-10)}${Math.random().toString(36).slice(2, 6).toUpperCase()}`
paymentInfo.payTime = new Date().toLocaleString('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
}).replace(/\//g, '-')

const giftRules = [
  { minMonths: 3, gifts: [{ name: '优质大米', desc: '东北五常大米 5kg', icon: 'Cpu', color: '#FFD93D', quantity: 1 }] },
  { minMonths: 6, gifts: [
    { name: '优质大米', desc: '东北五常大米 5kg', icon: 'Cpu', color: '#FFD93D', quantity: 1 },
    { name: '精选面粉', desc: '高筋小麦粉 5kg', icon: 'Coin', color: '#F5DEB3', quantity: 1 }
  ]},
  { minMonths: 12, gifts: [
    { name: '优质大米', desc: '东北五常大米 10kg', icon: 'Cpu', color: '#FFD93D', quantity: 2 },
    { name: '精选面粉', desc: '高筋小麦粉 5kg', icon: 'Coin', color: '#F5DEB3', quantity: 1 },
    { name: '食用油', desc: '非转基因大豆油 5L', icon: 'Watermelon', color: '#FFB073', quantity: 1 }
  ]},
  { minMonths: 24, gifts: [
    { name: '优质大米', desc: '东北五常大米 10kg', icon: 'Cpu', color: '#FFD93D', quantity: 3 },
    { name: '精选面粉', desc: '高筋小麦粉 5kg', icon: 'Coin', color: '#F5DEB3', quantity: 2 },
    { name: '食用油', desc: '非转基因大豆油 5L', icon: 'Watermelon', color: '#FFB073', quantity: 2 },
    { name: '杂粮礼盒', desc: '精选五谷杂粮组合装', icon: 'Box', color: '#8B4513', quantity: 1 }
  ]},
  { minMonths: 36, gifts: [
    { name: '优质大米', desc: '东北五常大米 10kg', icon: 'Cpu', color: '#FFD93D', quantity: 4 },
    { name: '精选面粉', desc: '高筋小麦粉 5kg', icon: 'Coin', color: '#F5DEB3', quantity: 3 },
    { name: '食用油', desc: '非转基因大豆油 5L', icon: 'Watermelon', color: '#FFB073', quantity: 3 },
    { name: '杂粮礼盒', desc: '精选五谷杂粮组合装', icon: 'Box', color: '#8B4513', quantity: 2 },
    { name: '坚果礼盒', desc: '进口坚果大礼包', icon: 'Present', color: '#FF6B6B', quantity: 1 }
  ]},
  { minMonths: 60, gifts: [
    { name: '优质大米', desc: '东北五常大米 10kg', icon: 'Cpu', color: '#FFD93D', quantity: 6 },
    { name: '精选面粉', desc: '高筋小麦粉 5kg', icon: 'Coin', color: '#F5DEB3', quantity: 4 },
    { name: '食用油', desc: '非转基因大豆油 5L', icon: 'Watermelon', color: '#FFB073', quantity: 4 },
    { name: '杂粮礼盒', desc: '精选五谷杂粮组合装', icon: 'Box', color: '#8B4513', quantity: 3 },
    { name: '坚果礼盒', desc: '进口坚果大礼包', icon: 'Present', color: '#FF6B6B', quantity: 2 },
    { name: '海鲜礼盒', desc: '进口海鲜大礼包', icon: 'Fish', color: '#4ECDC4', quantity: 1 }
  ]}
]

const giftList = computed(() => {
  const applicableRules = giftRules
    .filter(rule => rule.minMonths <= paymentInfo.months)
    .sort((a, b) => b.minMonths - a.minMonths)
  
  return applicableRules.length > 0 ? applicableRules[0].gifts : []
})

const goToPaymentList = () => {
  router.push('/payment/list')
}

const goToHome = () => {
  router.push('/home')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.payment-success-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 40px;
}

.success-card {
  padding: 32px;
  text-align: center;
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;

  @media (max-width: $breakpoint-mobile) {
    padding: 24px 16px;
    margin: 0;
    border-radius: 0;
  }
}

.success-icon {
  margin-bottom: 16px;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 8px;
}

.success-subtitle {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 24px;
}

.payment-details {
  background: $bg-light;
  border-radius: $border-radius-sm;
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px dashed $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  font-size: 14px;
  color: $text-secondary;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
  font-family: 'SF Mono', Monaco, monospace;

  &.highlight {
    font-size: 20px;
    font-weight: 700;
    color: $primary-color;
  }
}

.gift-section {
  background: linear-gradient(135deg, rgba($warning-color, 0.08) 0%, rgba($accent-color, 0.05) 100%);
  border-radius: $border-radius-sm;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.gift-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.gift-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.gift-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.gift-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: $bg-card;
  border-radius: $border-radius-sm;
}

.gift-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba($primary-color, 0.08);
  border-radius: 50%;
}

.gift-info {
  flex: 1;
}

.gift-name {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 2px;
}

.gift-desc {
  font-size: 12px;
  color: $text-light;
}

.gift-tip {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 10px;
  background: rgba($primary-color, 0.05);
  border-radius: $border-radius-sm;
  font-size: 12px;
  color: $text-secondary;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  gap: 16px;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    gap: 12px;
  }

  .el-button {
    flex: 1;
    height: 46px;
    font-size: 15px;
    border-radius: $border-radius-sm;

    .el-icon {
      margin-right: 6px;
    }
  }
}
</style>
