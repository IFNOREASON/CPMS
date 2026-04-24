<template>
  <div class="payment-unified-container page-container">
    <div class="page-header">
      <h1 class="page-title">物业缴费</h1>
      <el-button type="primary" text @click="goToPaymentList">
        <el-icon><Document /></el-icon>
        缴费记录
      </el-button>
    </div>

    <div class="countdown-section" :class="{ urgent: daysUntilExpire <= 7 }">
      <div class="countdown-icon">
        <el-icon :size="48"><Warning /></el-icon>
      </div>
      <div class="countdown-content">
        <div class="countdown-title">
          <span v-if="daysUntilExpire > 0">距离物业费到期还有</span>
          <span v-else class="expired-text">物业费已过期</span>
        </div>
        <div class="countdown-value" v-if="daysUntilExpire > 0">
          <span class="days">{{ daysUntilExpire }}</span>
          <span class="unit">天</span>
        </div>
        <div class="countdown-detail" v-if="daysUntilExpire > 0">
          <span>当前周期：{{ currentPeriod }}</span>
          <span class="separator">|</span>
          <span>到期日期：{{ expireDate }}</span>
        </div>
        <div class="countdown-detail expired" v-else>
          <span class="expired-warning">请尽快续费，逾期将产生滞纳金</span>
        </div>
      </div>
      <div class="countdown-action" v-if="daysUntilExpire <= 7">
        <el-button type="primary" @click="scrollToPayment">
          <el-icon><Wallet /></el-icon>
          立即缴费
        </el-button>
      </div>
    </div>

    <div class="house-info-section">
      <div class="section-title-bar">
        <el-icon :size="18" color="#FF8C42"><OfficeBuilding /></el-icon>
        <span class="section-title">房屋信息</span>
      </div>
      <div class="house-info-grid">
        <div class="info-item">
          <span class="info-label">房屋地址</span>
          <span class="info-value">{{ houseInfo.address }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">房屋面积</span>
          <span class="info-value">{{ houseInfo.area }} ㎡</span>
        </div>
        <div class="info-item">
          <span class="info-label">物业单价</span>
          <span class="info-value">¥{{ houseInfo.pricePerSquare }} / ㎡/月</span>
        </div>
        <div class="info-item">
          <span class="info-label">月物业费</span>
          <span class="info-value highlight">¥{{ monthlyFee.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <div class="payment-section" id="payment-section">
      <div class="section-title-bar">
        <el-icon :size="18" color="#FF8C42"><Wallet /></el-icon>
        <span class="section-title">选择缴费时长</span>
      </div>

      <div class="duration-selector">
        <div
          v-for="duration in durationOptions"
          :key="duration.value"
          class="duration-card"
          :class="{
            active: selectedDuration === duration.value,
            popular: duration.popular
          }"
          @click="selectedDuration = duration.value"
        >
          <div class="popular-tag" v-if="duration.popular">
            <el-tag type="danger" size="small">热门推荐</el-tag>
          </div>
          <div class="duration-months">{{ duration.months }}个月</div>
          <div class="duration-text">{{ duration.label }}</div>
          <div class="discount-badge" v-if="duration.discount > 0">
            省 ¥{{ (monthlyFee * duration.months * duration.discount).toFixed(0) }}
          </div>
        </div>
      </div>

      <div class="promotion-section">
        <div class="promotion-header">
          <el-icon :size="16" color="#FF6B6B"><Gift /></el-icon>
          <span class="promotion-title">预缴优惠</span>
          <el-tag type="success" size="small">限时活动</el-tag>
        </div>
        <div class="promotion-content">
          <div
            v-for="gift in currentGifts"
            :key="gift.label"
            class="gift-item"
          >
            <div class="gift-icon">
              <el-icon :size="20" :color="gift.color">{{ gift.icon }}</el-icon>
            </div>
            <div class="gift-info">
              <div class="gift-name">{{ gift.name }}</div>
              <div class="gift-desc">{{ gift.desc }}</div>
            </div>
            <el-tag v-if="gift.quantity > 1" type="warning" size="small">
              x{{ gift.quantity }}
            </el-tag>
          </div>
          <div class="no-gift" v-if="currentGifts.length === 0">
            <el-icon :size="14"><InfoFilled /></el-icon>
            <span>选择更长缴费周期可获赠米面粮油</span>
          </div>
        </div>
      </div>

      <div class="summary-section">
        <div class="summary-row">
          <span class="summary-label">缴费时长</span>
          <span class="summary-value">{{ selectedDurationLabel }}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">原价总额</span>
          <span class="summary-value original">¥{{ originalAmount.toFixed(2) }}</span>
        </div>
        <div class="summary-row discount-row" v-if="discountAmount > 0">
          <span class="summary-label">优惠减免</span>
          <span class="summary-value discount">-¥{{ discountAmount.toFixed(2) }}</span>
        </div>
        <div class="summary-row total-row">
          <span class="summary-label">应付金额</span>
          <span class="summary-value total">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
      </div>

      <div class="payment-method-section">
        <div class="payment-method-title">
          <el-icon :size="16" color="#FF8C42"><CreditCard /></el-icon>
          <span>选择支付方式</span>
        </div>
        <div class="payment-methods">
          <div
            v-for="method in paymentMethods"
            :key="method.value"
            class="payment-method-card"
            :class="{ active: selectedPaymentMethod === method.value }"
            @click="selectedPaymentMethod = method.value"
          >
            <el-icon :size="28" :color="method.color">{{ method.icon }}</el-icon>
            <span class="method-name">{{ method.name }}</span>
            <el-icon
              class="check-icon"
              v-if="selectedPaymentMethod === method.value"
              :size="18"
            >
              <CircleCheckFilled />
            </el-icon>
          </div>
        </div>
      </div>

      <div class="agreement-section">
        <el-checkbox v-model="agreed" size="large">
          我已阅读并同意
          <span class="link-text" @click.stop>《物业服务协议》</span>
          和
          <span class="link-text" @click.stop>《缴费须知》</span>
        </el-checkbox>
      </div>

      <div class="submit-section">
        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :disabled="!agreed"
          @click="handlePayment"
        >
          <el-icon><Goods /></el-icon>
          立即支付 ¥{{ totalAmount.toFixed(2) }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const houseInfo = reactive({
  address: '1号楼 2单元 301室',
  area: 108.5,
  pricePerSquare: 2.5
})

const monthlyFee = computed(() => {
  return houseInfo.area * houseInfo.pricePerSquare
})

const daysUntilExpire = ref(12)
const currentPeriod = '2024年1月 - 2024年3月'
const expireDate = '2024-03-31'

const durationOptions = [
  { value: 1, months: 1, label: '1个月', discount: 0, popular: false },
  { value: 3, months: 3, label: '3个月', discount: 0.02, popular: false },
  { value: 6, months: 6, label: '6个月', discount: 0.05, popular: false },
  { value: 12, months: 12, label: '1年', discount: 0.08, popular: true },
  { value: 24, months: 24, label: '2年', discount: 0.12, popular: false },
  { value: 36, months: 36, label: '3年', discount: 0.15, popular: false },
  { value: 60, months: 60, label: '5年', discount: 0.2, popular: false }
]

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

const paymentMethods = [
  { value: 'wechat', name: '微信支付', icon: 'ChatDotRound', color: '#07C160' },
  { value: 'alipay', name: '支付宝', icon: 'Money', color: '#1677FF' },
  { value: 'bank', name: '银行卡', icon: 'CreditCard', color: '#FF8C42' }
]

const selectedDuration = ref(12)
const selectedPaymentMethod = ref('wechat')
const agreed = ref(false)

const selectedDurationLabel = computed(() => {
  const option = durationOptions.find(o => o.value === selectedDuration.value)
  return option ? option.label : ''
})

const originalAmount = computed(() => {
  return monthlyFee.value * selectedDuration.value
})

const discountAmount = computed(() => {
  const option = durationOptions.find(o => o.value === selectedDuration.value)
  if (!option) return 0
  return originalAmount.value * option.discount
})

const totalAmount = computed(() => {
  return originalAmount.value - discountAmount.value
})

const currentGifts = computed(() => {
  const applicableRules = giftRules
    .filter(rule => rule.minMonths <= selectedDuration.value)
    .sort((a, b) => b.minMonths - a.minMonths)
  
  return applicableRules.length > 0 ? applicableRules[0].gifts : []
})

const goToPaymentList = () => {
  router.push('/payment/list')
}

const scrollToPayment = () => {
  document.getElementById('payment-section')?.scrollIntoView({ behavior: 'smooth' })
}

const handlePayment = async () => {
  if (!agreed.value) {
    ElMessage.warning('请先阅读并同意服务协议')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确认支付 ¥${totalAmount.value.toFixed(2)}？`,
      '支付确认',
      {
        confirmButtonText: '确认支付',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    ElMessage.success('支付成功！')

    router.push({
      path: '/payment/success',
      query: {
        amount: totalAmount.value,
        months: selectedDuration.value,
        method: selectedPaymentMethod.value
      }
    })
  } catch {
  }
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.payment-unified-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: $text-primary;
  margin: 0;

  @media (max-width: $breakpoint-mobile) {
    font-size: 18px;
  }
}

.countdown-section {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba($success-color, 0.08) 0%, rgba($info-color, 0.05) 100%);
  border-left: 4px solid $success-color;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;

  &.urgent {
    background: linear-gradient(135deg, rgba($danger-color, 0.08) 0%, rgba($secondary-color, 0.05) 100%);
    border-left-color: $danger-color;
  }

  @media (max-width: $breakpoint-mobile) {
    flex-wrap: wrap;
    gap: 12px;
  }
}

.countdown-icon {
  margin-right: 16px;
  color: $success-color;

  .urgent & {
    color: $danger-color;
  }

  @media (max-width: $breakpoint-mobile) {
    margin-right: 12px;
  }
}

.countdown-content {
  flex: 1;
}

.countdown-title {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 8px;

  .expired-text {
    color: $danger-color;
    font-weight: 600;
  }
}

.countdown-value {
  display: flex;
  align-items: baseline;
  margin-bottom: 6px;

  .days {
    font-size: 36px;
    font-weight: 700;
    color: $success-color;
    line-height: 1;

    .urgent & {
      color: $danger-color;
    }
  }

  .unit {
    font-size: 14px;
    color: $text-secondary;
    margin-left: 4px;
  }
}

.countdown-detail {
  font-size: 12px;
  color: $text-light;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  .separator {
    color: $border-color;
  }

  &.expired {
    .expired-warning {
      color: $danger-color;
    }
  }
}

.countdown-action {
  margin-left: 16px;

  @media (max-width: $breakpoint-mobile) {
    width: 100%;
    margin-left: 0;

    .el-button {
      width: 100%;
    }
  }
}

.section-title-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid $border-color;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.house-info-section {
  padding: 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;

  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}

.house-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .info-label {
    font-size: 13px;
    color: $text-light;
  }

  .info-value {
    font-size: 15px;
    font-weight: 500;
    color: $text-primary;

    &.highlight {
      color: $primary-color;
      font-weight: 600;
    }
  }
}

.payment-section {
  padding: 20px;
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;

  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}

.duration-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

.duration-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  border: 2px solid $border-color;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $primary-light;
  }

  &.active {
    border-color: $primary-color;
    background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-light, 0.03) 100%);
  }

  &.popular::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-top: 28px solid $danger-color;
    border-left: 28px solid transparent;
    border-top-right-radius: $border-radius-sm;
  }
}

.popular-tag {
  position: absolute;
  top: 2px;
  right: 2px;

  .el-tag {
    transform: rotate(45deg) translate(4px, -8px);
    font-size: 10px;
    padding: 2px 8px;
  }
}

.duration-months {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4px;
}

.duration-text {
  font-size: 12px;
  color: $text-secondary;
  margin-bottom: 4px;
}

.discount-badge {
  font-size: 11px;
  color: $danger-color;
  font-weight: 600;
}

.promotion-section {
  padding: 16px;
  background: linear-gradient(135deg, rgba($warning-color, 0.08) 0%, rgba($accent-color, 0.05) 100%);
  border-radius: $border-radius-sm;
  margin-bottom: 20px;
}

.promotion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.promotion-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
}

.promotion-content {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.gift-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: $bg-card;
  border-radius: $border-radius-sm;
  flex: 1;
  min-width: 180px;

  @media (max-width: $breakpoint-mobile) {
    min-width: 100%;
  }
}

.gift-icon {
  width: 36px;
  height: 36px;
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

.no-gift {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $text-light;
  padding: 8px 0;
}

.summary-section {
  padding: 16px;
  background: linear-gradient(135deg, $bg-light 0%, $bg-card 100%);
  border-radius: $border-radius-sm;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  &.discount-row {
    .summary-label,
    .summary-value {
      color: $danger-color;
    }
  }

  &.total-row {
    padding-top: 12px;
    margin-top: 8px;
    border-top: 1px dashed $border-color;

    .summary-label {
      font-size: 16px;
    }

    .summary-value {
      font-size: 22px;
    }
  }
}

.summary-label {
  font-size: 14px;
  color: $text-secondary;
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;

  &.original {
    text-decoration: line-through;
    color: $text-light;
  }

  &.discount {
    color: $danger-color;
  }

  &.total {
    color: $primary-color;
  }
}

.payment-method-section {
  margin-bottom: 20px;
}

.payment-method-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12px;
}

.payment-methods {
  display: flex;
  gap: 12px;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    gap: 8px;
  }
}

.payment-method-card {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border: 2px solid $border-color;
  border-radius: $border-radius-sm;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $primary-light;
  }

  &.active {
    border-color: $primary-color;
    background: linear-gradient(135deg, rgba($primary-color, 0.03) 0%, $bg-card 100%);
  }
}

.method-name {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: $primary-color;
}

.agreement-section {
  margin-bottom: 20px;

  .el-checkbox {
    font-size: 13px;
    color: $text-secondary;
  }

  .link-text {
    color: $primary-color;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}

.submit-section {
  .submit-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: $border-radius-sm;

    .el-icon {
      margin-right: 6px;
    }

    &:disabled {
      background: $text-light;
      border-color: $text-light;
    }
  }
}
</style>
