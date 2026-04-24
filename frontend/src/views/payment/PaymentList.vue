<template>
  <div class="payment-list-container page-container">
    <div class="page-header">
      <h1 class="page-title">缴费记录</h1>
      <el-button type="primary" @click="goToPayment">
        <el-icon><Plus /></el-icon>
        立即缴费
      </el-button>
    </div>

    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-icon total">
          <el-icon :size="24"><Wallet /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">¥{{ totalAmount.toFixed(2) }}</div>
          <div class="stat-label">累计缴费</div>
        </div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-icon count">
          <el-icon :size="24"><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ paymentList.length }}</div>
          <div class="stat-label">缴费笔数</div>
        </div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-icon latest">
          <el-icon :size="24"><Clock /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ latestPeriod }}</div>
          <div class="stat-label">最近缴费</div>
        </div>
      </div>
    </div>

    <div class="filter-buttons">
      <div class="filter-buttons-inner">
        <el-button
          v-for="btn in filterButtons"
          :key="btn.value"
          :type="currentFilter === btn.value ? 'primary' : 'default'"
          size="small"
          @click="currentFilter = btn.value"
        >
          {{ btn.label }}
          <span v-if="btn.count > 0" class="btn-count">{{ btn.count }}</span>
        </el-button>
      </div>
    </div>

    <div class="list-section">
      <div class="payment-card" v-for="item in filteredPaymentList" :key="item.id">
        <div class="card-header">
          <div class="payment-info">
            <div class="payment-icon">
              <el-icon :size="22" :color="getMethodColor(item.paymentMethod)">{{ getMethodIcon(item.paymentMethod) }}</el-icon>
            </div>
            <div class="payment-detail">
              <div class="payment-type">{{ item.type }}</div>
              <div class="payment-period">{{ item.period }}</div>
            </div>
          </div>
          <div class="payment-status">
            <el-tag :type="getStatusType(item.status)" size="small">
              {{ getStatusText(item.status) }}
            </el-tag>
          </div>
        </div>

        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">缴费金额</span>
              <span class="info-value highlight">¥{{ item.amount.toFixed(2) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">缴费时长</span>
              <span class="info-value">{{ item.duration }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">支付方式</span>
              <span class="info-value">{{ getMethodName(item.paymentMethod) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">订单编号</span>
              <span class="info-value code">{{ item.orderNo }}</span>
            </div>
          </div>

          <div class="gift-section" v-if="item.gifts && item.gifts.length > 0">
            <div class="gift-header">
              <el-icon :size="14" color="#FF6B6B"><Gift /></el-icon>
              <span class="gift-label">预缴赠品</span>
            </div>
            <div class="gift-list">
              <span
                v-for="(gift, index) in item.gifts"
                :key="gift.name"
                class="gift-tag"
              >
                {{ gift.name }}{{ gift.quantity > 1 ? ` x${gift.quantity}` : '' }}
                <span v-if="index < item.gifts.length - 1" class="separator">、</span>
              </span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="payment-time">
            <el-icon :size="14"><Calendar /></el-icon>
            <span>支付时间：{{ item.payTime }}</span>
          </div>
          <div class="actions">
            <el-button type="primary" text size="small">
              <el-icon><View /></el-icon>
              查看详情
            </el-button>
            <el-button type="primary" text size="small" v-if="item.status === 'success'">
              <el-icon><Printer /></el-icon>
              电子票据
            </el-button>
          </div>
        </div>
      </div>

      <div class="empty-state" v-if="filteredPaymentList.length === 0">
        <el-icon :size="64" color="#999"><Wallet /></el-icon>
        <p>{{ currentFilter === 'all' ? '暂无缴费记录' : '暂无该状态的缴费记录' }}</p>
        <el-button type="primary" v-if="currentFilter === 'all'" @click="goToPayment">
          <el-icon><Plus /></el-icon>
          立即缴费
        </el-button>
      </div>
    </div>

    <div class="pagination-section" v-if="filteredPaymentList.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="5"
        :total="filteredPaymentList.length"
        layout="prev, pager, next"
        background
        small
      />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentFilter = ref('all')
const currentPage = ref(1)

const paymentList = reactive([
  {
    id: 1,
    orderNo: 'WY202401150001',
    type: '物业费',
    period: '2024年1月 - 2024年12月',
    duration: '12个月',
    amount: 3255,
    paymentMethod: 'wechat',
    status: 'success',
    payTime: '2024-01-15 10:30:25',
    gifts: [
      { name: '优质大米', quantity: 2 },
      { name: '精选面粉', quantity: 1 },
      { name: '食用油', quantity: 1 }
    ]
  },
  {
    id: 2,
    orderNo: 'WY202312200003',
    type: '物业费',
    period: '2023年10月 - 2023年12月',
    duration: '3个月',
    amount: 813.75,
    paymentMethod: 'alipay',
    status: 'success',
    payTime: '2023-12-20 14:22:18',
    gifts: [
      { name: '优质大米', quantity: 1 }
    ]
  },
  {
    id: 3,
    orderNo: 'WY202310080002',
    type: '物业费',
    period: '2023年7月 - 2023年9月',
    duration: '3个月',
    amount: 813.75,
    paymentMethod: 'bank',
    status: 'success',
    payTime: '2023-10-08 09:15:42',
    gifts: [
      { name: '优质大米', quantity: 1 }
    ]
  },
  {
    id: 4,
    orderNo: 'WY202307050001',
    type: '物业费',
    period: '2023年1月 - 2023年6月',
    duration: '6个月',
    amount: 1627.5,
    paymentMethod: 'wechat',
    status: 'success',
    payTime: '2023-07-05 16:45:33',
    gifts: [
      { name: '优质大米', quantity: 1 },
      { name: '精选面粉', quantity: 1 }
    ]
  },
  {
    id: 5,
    orderNo: 'WY202401200002',
    type: '物业费',
    period: '2024年2月 - 2024年2月',
    duration: '1个月',
    amount: 271.25,
    paymentMethod: 'wechat',
    status: 'pending',
    payTime: '-',
    gifts: []
  }
])

const filterButtons = computed(() => {
  const counts = {
    all: paymentList.length,
    success: paymentList.filter(item => item.status === 'success').length,
    pending: paymentList.filter(item => item.status === 'pending').length,
    refund: paymentList.filter(item => item.status === 'refund').length
  }

  return [
    { label: '全部', value: 'all', count: counts.all },
    { label: '已支付', value: 'success', count: counts.success },
    { label: '待支付', value: 'pending', count: counts.pending },
    { label: '已退款', value: 'refund', count: counts.refund }
  ]
})

const filteredPaymentList = computed(() => {
  if (currentFilter.value === 'all') {
    return paymentList
  }
  return paymentList.filter(item => item.status === currentFilter.value)
})

const totalAmount = computed(() => {
  return paymentList
    .filter(item => item.status === 'success')
    .reduce((sum, item) => sum + item.amount, 0)
})

const latestPeriod = computed(() => {
  const successList = paymentList.filter(item => item.status === 'success')
  return successList.length > 0 ? successList[0].period : '暂无'
})

const getStatusType = (status) => {
  const map = {
    success: 'success',
    pending: 'warning',
    refund: 'info',
    failed: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    success: '已支付',
    pending: '待支付',
    refund: '已退款',
    failed: '支付失败'
  }
  return map[status] || '未知'
}

const getMethodIcon = (method) => {
  const map = {
    wechat: 'ChatDotRound',
    alipay: 'Money',
    bank: 'CreditCard'
  }
  return map[method] || 'Wallet'
}

const getMethodColor = (method) => {
  const map = {
    wechat: '#07C160',
    alipay: '#1677FF',
    bank: '#FF8C42'
  }
  return map[method] || '#999'
}

const getMethodName = (method) => {
  const map = {
    wechat: '微信支付',
    alipay: '支付宝',
    bank: '银行卡'
  }
  return map[method] || '其他支付'
}

const goToPayment = () => {
  router.push('/payment')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.payment-list-container {
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

.stats-section {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;

  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: $border-color;
  margin: 0 16px;

  @media (max-width: $breakpoint-mobile) {
    margin: 0 8px;
  }
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &.total {
    background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
    color: white;
  }

  &.count {
    background: linear-gradient(135deg, $success-color 0%, #6BCB77 100%);
    color: white;
  }

  &.latest {
    background: linear-gradient(135deg, $info-color 0%, #95E1A3 100%);
    color: white;
  }

  @media (max-width: $breakpoint-mobile) {
    width: 40px;
    height: 40px;

    .el-icon {
      font-size: 20px !important;
    }
  }
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;

  @media (max-width: $breakpoint-mobile) {
    font-size: 15px;
  }
}

.stat-label {
  font-size: 12px;
  color: $text-light;
}

.filter-buttons {
  padding: 16px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;

  @media (max-width: $breakpoint-mobile) {
    padding: 12px;
  }
}

.filter-buttons-inner {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: $breakpoint-mobile) {
    gap: 6px;
  }
}

.btn-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: rgba($primary-color, 0.15);
  color: $primary-color;
  font-size: 11px;
  font-weight: 500;
  border-radius: 9px;
  margin-left: 4px;
}

.list-section {
  margin-top: 16px;
}

.payment-card {
  background: $bg-card;
  border-radius: $border-radius;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px $shadow-color;
  overflow: hidden;
  transition: $transition;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px $shadow-color;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid $border-color;
  background: linear-gradient(135deg, $bg-light 0%, $bg-card 100%);

  @media (max-width: $breakpoint-mobile) {
    padding: 14px 16px;
  }
}

.payment-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.payment-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba($primary-color, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.payment-type {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}

.payment-period {
  font-size: 12px;
  color: $text-secondary;
}

.card-content {
  padding: 16px 20px;

  @media (max-width: $breakpoint-mobile) {
    padding: 14px 16px;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-label {
  font-size: 13px;
  color: $text-secondary;
}

.info-value {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;

  &.highlight {
    color: $primary-color;
    font-size: 16px;
    font-weight: 700;
  }

  &.code {
    font-family: 'SF Mono', Monaco, monospace;
    font-size: 12px;
  }
}

.gift-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px dashed $border-color;
}

.gift-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.gift-label {
  font-size: 13px;
  font-weight: 600;
  color: $text-secondary;
}

.gift-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.gift-tag {
  font-size: 13px;
  color: $text-primary;

  .separator {
    color: $text-light;
  }
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: $bg-color;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: $breakpoint-mobile) {
    padding: 10px 16px;
  }
}

.payment-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: $text-light;

  .el-icon {
    color: $text-light;
  }
}

.actions {
  display: flex;
  gap: 8px;

  .el-button {
    .el-icon {
      margin-right: 2px;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;

  p {
    margin-top: 16px;
    margin-bottom: 24px;
    color: $text-secondary;
    font-size: 14px;
  }

  .el-button {
    .el-icon {
      margin-right: 4px;
    }
  }
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>
