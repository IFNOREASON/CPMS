<template>
  <div class="parking-container page-container">
    <div class="page-header">
      <h1 class="page-title">车位管理</h1>
    </div>

    <div v-if="hasParking" class="has-parking-view">
      <div class="parking-info-section card">
        <div class="section-title-bar">
          <el-icon :size="18" color="#FF8C42"><Car /></el-icon>
          <span class="section-title">我的车位</span>
        </div>

        <div class="parking-detail-grid">
          <div class="parking-detail-item">
            <div class="detail-icon">
              <el-icon :size="24" color="#FF8C42"><Location /></el-icon>
            </div>
            <div class="detail-info">
              <div class="detail-label">车位编号</div>
              <div class="detail-value">{{ parkingInfo.parkingNo }}</div>
            </div>
          </div>
          <div class="parking-detail-item">
            <div class="detail-icon">
              <el-icon :size="24" color="#FF8C42"><OfficeBuilding /></el-icon>
            </div>
            <div class="detail-info">
              <div class="detail-label">车位区域</div>
              <div class="detail-value">{{ parkingInfo.area }}</div>
            </div>
          </div>
          <div class="parking-detail-item">
            <div class="detail-icon">
              <el-icon :size="24" color="#FF8C42"><Wallet /></el-icon>
            </div>
            <div class="detail-info">
              <div class="detail-label">月管理费</div>
              <div class="detail-value highlight">¥{{ parkingInfo.monthlyFee }}</div>
            </div>
          </div>
          <div class="parking-detail-item">
            <div class="detail-icon">
              <el-icon :size="24" color="#FF8C42"><EditPen /></el-icon>
            </div>
            <div class="detail-info">
              <div class="detail-label">车位类型</div>
              <div class="detail-value">{{ parkingInfo.type }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="expire-section card" :class="{ urgent: daysUntilExpire <= 15 }">
        <div class="expire-icon">
          <el-icon :size="48"><Warning /></el-icon>
        </div>
        <div class="expire-content">
          <div class="expire-title">
            <span v-if="daysUntilExpire > 0">距离车位管理费到期还有</span>
            <span v-else class="expired-text">车位管理费已过期</span>
          </div>
          <div class="expire-value" v-if="daysUntilExpire > 0">
            <span class="days">{{ daysUntilExpire }}</span>
            <span class="unit">天</span>
          </div>
          <div class="expire-detail" v-if="daysUntilExpire > 0">
            <span>到期日期：{{ expireDate }}</span>
          </div>
          <div class="expire-detail expired" v-else>
            <span class="expired-warning">请尽快续费，逾期将影响车位使用</span>
          </div>
        </div>
        <div class="expire-action">
          <el-button type="primary" size="large" @click="showPaymentDialog = true">
            <el-icon><Wallet /></el-icon>
            立即续费
          </el-button>
        </div>
      </div>

      <div class="payment-history-section card">
        <div class="section-title-bar">
          <el-icon :size="18" color="#FF8C42"><Document /></el-icon>
          <span class="section-title">缴费记录</span>
        </div>
        <div class="history-list">
          <div v-for="item in paymentHistory" :key="item.id" class="history-item">
            <div class="history-info">
              <div class="history-period">{{ item.period }}</div>
              <div class="history-time">{{ item.payTime }}</div>
            </div>
            <div class="history-amount">
              <span class="amount">¥{{ item.amount }}</span>
              <el-tag type="success" size="small">已支付</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-parking-view">
      <div class="empty-parking-section card">
        <div class="empty-icon">
          <el-icon :size="64" color="#999"><Car /></el-icon>
        </div>
        <div class="empty-title">暂无车位</div>
        <div class="empty-desc">您当前没有绑定车位，请选择空余车位进行购买或租赁</div>
        <el-button type="primary" size="large" @click="showSelector = true">
          <el-icon><Plus /></el-icon>
          选择车位
        </el-button>
      </div>

      <div class="parking-stats-section card">
        <div class="section-title-bar">
          <el-icon :size="18" color="#FF8C42"><TrendCharts /></el-icon>
          <span class="section-title">车位使用情况</span>
        </div>
        <div class="stats-grid">
          <div class="stat-card total">
            <div class="stat-icon">
              <el-icon :size="20"><OfficeBuilding /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ parkingStats.total }}</div>
              <div class="stat-name">总车位数</div>
            </div>
          </div>
          <div class="stat-card available">
            <div class="stat-icon">
              <el-icon :size="20"><CircleCheck /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ parkingStats.available }}</div>
              <div class="stat-name">空余车位</div>
            </div>
          </div>
          <div class="stat-card occupied">
            <div class="stat-icon">
              <el-icon :size="20"><Close /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ parkingStats.occupied }}</div>
              <div class="stat-name">已售车位</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="showSelector"
      title="选择车位"
      width="80%"
      :close-on-click-modal="false"
      class="parking-selector-dialog"
    >
      <div class="parking-selector">
        <div class="selector-header">
          <div class="area-selector">
            <span class="label">选择区域：</span>
            <el-radio-group v-model="selectedArea" size="small">
              <el-radio-button
                v-for="area in parkingAreas"
                :key="area.value"
                :label="area.value"
              >
                {{ area.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="legend">
            <div class="legend-item">
              <div class="legend-box available"></div>
              <span>空余</span>
            </div>
            <div class="legend-item">
              <div class="legend-box occupied"></div>
              <span>已售</span>
            </div>
            <div class="legend-item">
              <div class="legend-box selected"></div>
              <span>已选</span>
            </div>
          </div>
        </div>

        <div class="parking-map">
          <div class="screen-label">
            <el-icon :size="16"><ArrowUp /></el-icon>
            <span>入口方向</span>
            <el-icon :size="16"><ArrowUp /></el-icon>
          </div>

          <div class="parking-grid">
            <div
              v-for="(row, rowIndex) in currentParkingGrid"
              :key="rowIndex"
              class="parking-row"
            >
              <div class="row-label" v-if="rowIndex % 2 === 0">
                A{{ Math.floor(rowIndex / 2) + 1 }}
              </div>
              <div
                v-for="(spot, colIndex) in row"
                :key="colIndex"
                class="parking-spot"
                :class="{
                  available: spot.status === 'available',
                  occupied: spot.status === 'occupied',
                  selected: spot.status === 'selected',
                  'is-aisle': spot.isAisle
                }"
                @click="selectSpot(spot)"
              >
                <template v-if="!spot.isAisle">
                  <div class="spot-number" v-if="spot.status !== 'occupied'">{{ spot.no }}</div>
                  <div class="spot-icon" v-else>
                    <el-icon :size="18"><Car /></el-icon>
                  </div>
                </template>
              </div>
              <div class="row-label" v-if="rowIndex % 2 === 1">
                A{{ Math.floor(rowIndex / 2) + 1 }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer-content">
          <div class="selected-info" v-if="selectedSpot">
            <span>已选择车位：</span>
            <span class="spot-highlight">{{ selectedSpot.no }}</span>
            <span class="price-info">
              <span class="price-label">车位价格：</span>
              <span class="price-value">¥{{ parkingPrice.salePrice }}/个（购买）</span>
              <span class="or">或</span>
              <span class="price-value">¥{{ parkingPrice.monthlyRent }}/月（租赁）</span>
            </span>
          </div>
          <div class="no-selected" v-else>
            <span>请点击空余车位进行选择</span>
          </div>
          <div class="button-group">
            <el-button @click="showSelector = false">取消</el-button>
            <el-button type="primary" :disabled="!selectedSpot" @click="confirmSelectSpot">
              确认选择
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showPaymentDialog"
      title="车位管理费缴费"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="payment-content">
        <div class="payment-info-item">
          <span class="label">车位编号</span>
          <span class="value">{{ hasParking ? parkingInfo.parkingNo : selectedSpot?.no }}</span>
        </div>
        <div class="payment-info-item">
          <span class="label">缴费类型</span>
          <el-radio-group v-model="paymentType" size="large">
            <el-radio value="purchase" v-if="!hasParking">购买</el-radio>
            <el-radio value="rent" v-if="!hasParking">租赁</el-radio>
            <el-radio value="renew">续费</el-radio>
          </el-radio-group>
        </div>

        <div class="duration-section" v-if="paymentType !== 'purchase'">
          <div class="duration-label">选择缴费时长</div>
          <div class="duration-options">
            <div
              v-for="duration in durationOptions"
              :key="duration.value"
              class="duration-option"
              :class="{ active: selectedDuration === duration.value }"
              @click="selectedDuration = duration.value"
            >
              <div class="duration-months">{{ duration.label }}</div>
              <div class="duration-price">¥{{ (parkingPrice.monthlyRent * duration.value).toFixed(0) }}</div>
              <div class="discount" v-if="duration.discount > 0">
                省 ¥{{ (parkingPrice.monthlyRent * duration.value * duration.discount).toFixed(0) }}
              </div>
            </div>
          </div>
        </div>

        <div class="summary-section">
          <div class="summary-row">
            <span class="summary-label">费用明细</span>
            <span class="summary-value">
              <template v-if="paymentType === 'purchase'">
                车位购买费：¥{{ parkingPrice.salePrice }}
              </template>
              <template v-else>
                {{ selectedDurationLabel }}：¥{{ paymentAmount.toFixed(2) }}
              </template>
            </span>
          </div>
          <div class="summary-row total">
            <span class="summary-label">应付金额</span>
            <span class="summary-value total">¥{{ paymentAmount.toFixed(2) }}</span>
          </div>
        </div>

        <div class="agreement-section">
          <el-checkbox v-model="agreed" size="large">
            我已阅读并同意
            <span class="link-text">《车位使用协议》</span>
          </el-checkbox>
        </div>
      </div>

      <template #footer>
        <div class="payment-footer">
          <div class="total-info">
            <span class="total-label">应付：</span>
            <span class="total-amount">¥{{ paymentAmount.toFixed(2) }}</span>
          </div>
          <div class="button-group">
            <el-button @click="showPaymentDialog = false">取消</el-button>
            <el-button type="primary" :disabled="!agreed" @click="handlePayment">
              立即支付
            </el-button>
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const hasParking = ref(false)

const parkingInfo = reactive({
  parkingNo: 'B-128',
  area: '地下B区',
  monthlyFee: 300,
  type: '产权车位'
})

const daysUntilExpire = ref(23)
const expireDate = '2024-05-15'

const paymentHistory = reactive([
  { id: 1, period: '2024年1月-2024年4月', amount: 1200, payTime: '2024-01-10 10:30' },
  { id: 2, period: '2023年10月-2023年12月', amount: 900, payTime: '2023-10-08 14:20' },
  { id: 3, period: '2023年7月-2023年9月', amount: 900, payTime: '2023-07-05 09:15' }
])

const parkingStats = reactive({
  total: 500,
  available: 156,
  occupied: 344
})

const parkingPrice = reactive({
  salePrice: 150000,
  monthlyRent: 300
})

const parkingAreas = [
  { value: 'A', label: 'A区（地下一层）' },
  { value: 'B', label: 'B区（地下二层）' },
  { value: 'C', label: 'C区（地下三层）' }
]

const selectedArea = ref('A')
const selectedSpot = ref(null)
const showSelector = ref(false)
const showPaymentDialog = ref(false)

const paymentType = ref('renew')
const selectedDuration = ref(12)
const agreed = ref(false)

const durationOptions = [
  { value: 1, label: '1个月', discount: 0 },
  { value: 3, label: '3个月', discount: 0.02 },
  { value: 6, label: '6个月', discount: 0.05 },
  { value: 12, label: '12个月', discount: 0.1 }
]

const generateParkingGrid = (area) => {
  const grid = []
  const rows = 8
  const cols = 10

  for (let r = 0; r < rows; r++) {
    const row = []
    for (let c = 0; c < cols; c++) {
      if (r % 2 === 1 && c >= 3 && c <= 6) {
        row.push({ isAisle: true })
      } else {
        const spotNo = `${area}${String(r + 1).padStart(2, '0')}${String(c + 1).padStart(2, '0')}`
        const random = Math.random()
        const status = random < 0.3 ? 'available' : 'occupied'
        row.push({
          no: spotNo,
          row: r,
          col: c,
          status: status
        })
      }
    }
    grid.push(row)
  }
  return grid
}

const parkingGridData = reactive({
  A: generateParkingGrid('A'),
  B: generateParkingGrid('B'),
  C: generateParkingGrid('C')
})

const currentParkingGrid = computed(() => {
  return parkingGridData[selectedArea.value]
})

const selectedDurationLabel = computed(() => {
  const option = durationOptions.find(o => o.value === selectedDuration.value)
  return option ? option.label : ''
})

const paymentAmount = computed(() => {
  if (paymentType.value === 'purchase') {
    return parkingPrice.salePrice
  }
  const option = durationOptions.find(o => o.value === selectedDuration.value)
  if (!option) return 0
  const baseAmount = parkingPrice.monthlyRent * selectedDuration.value
  const discountAmount = baseAmount * option.discount
  return baseAmount - discountAmount
})

const selectSpot = (spot) => {
  if (spot.isAisle || spot.status === 'occupied') return

  if (selectedSpot.value) {
    const prevSpot = findSpotByNo(selectedSpot.value.no)
    if (prevSpot) {
      prevSpot.status = 'available'
    }
  }

  if (spot.status === 'available') {
    spot.status = 'selected'
    selectedSpot.value = spot
  } else if (spot.status === 'selected') {
    spot.status = 'available'
    selectedSpot.value = null
  }
}

const findSpotByNo = (no) => {
  for (const area in parkingGridData) {
    for (const row of parkingGridData[area]) {
      for (const spot of row) {
        if (spot.no === no) return spot
      }
    }
  }
  return null
}

const confirmSelectSpot = () => {
  if (!selectedSpot.value) {
    ElMessage.warning('请先选择一个车位')
    return
  }
  showSelector.value = false
  paymentType.value = 'rent'
  showPaymentDialog.value = true
}

const handlePayment = () => {
  if (!agreed.value) {
    ElMessage.warning('请先阅读并同意车位使用协议')
    return
  }

  ElMessage.success('支付成功！')
  showPaymentDialog.value = false

  if (!hasParking.value) {
    hasParking.value = true
    parkingInfo.parkingNo = selectedSpot.value.no
    parkingInfo.area = `${selectedArea.value}区（${selectedArea.value === 'A' ? '地下一层' : selectedArea.value === 'B' ? '地下二层' : '地下三层'}）`
    parkingInfo.type = paymentType.value === 'purchase' ? '产权车位' : '租赁车位'
    selectedSpot.value = null
  }

  daysUntilExpire.value = 365
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.parking-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.page-header {
  margin-bottom: 24px;

  @media (max-width: $breakpoint-mobile) {
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

.parking-info-section,
.expire-section,
.payment-history-section,
.empty-parking-section,
.parking-stats-section {
  padding: 20px;
  margin-bottom: 16px;
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;

  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
  }
}

.parking-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.parking-detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: $bg-light;
  border-radius: $border-radius-sm;
}

.detail-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba($primary-color, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-label {
  font-size: 13px;
  color: $text-light;
}

.detail-value {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;

  &.highlight {
    color: $primary-color;
  }
}

.expire-section {
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba($success-color, 0.08) 0%, rgba($info-color, 0.05) 100%);
  border-left: 4px solid $success-color;

  &.urgent {
    background: linear-gradient(135deg, rgba($danger-color, 0.08) 0%, rgba($secondary-color, 0.05) 100%);
    border-left-color: $danger-color;
  }

  @media (max-width: $breakpoint-mobile) {
    flex-wrap: wrap;
    gap: 12px;
  }
}

.expire-icon {
  margin-right: 16px;
  color: $success-color;

  .urgent & {
    color: $danger-color;
  }

  @media (max-width: $breakpoint-mobile) {
    margin-right: 12px;
  }
}

.expire-content {
  flex: 1;
}

.expire-title {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 8px;

  .expired-text {
    color: $danger-color;
    font-weight: 600;
  }
}

.expire-value {
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

.expire-detail {
  font-size: 12px;
  color: $text-light;

  &.expired {
    .expired-warning {
      color: $danger-color;
    }
  }
}

.expire-action {
  margin-left: 16px;

  @media (max-width: $breakpoint-mobile) {
    width: 100%;
    margin-left: 0;

    .el-button {
      width: 100%;
    }
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: $bg-light;
  border-radius: $border-radius-sm;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-period {
  font-size: 14px;
  font-weight: 500;
  color: $text-primary;
}

.history-time {
  font-size: 12px;
  color: $text-light;
}

.history-amount {
  display: flex;
  align-items: center;
  gap: 10px;

  .amount {
    font-size: 16px;
    font-weight: 700;
    color: $primary-color;
  }
}

.empty-parking-section {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: $border-radius-sm;

  &.total {
    background: linear-gradient(135deg, rgba($primary-color, 0.1) 0%, rgba($primary-light, 0.05) 100%);
    .stat-icon {
      background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
    }
  }

  &.available {
    background: linear-gradient(135deg, rgba($success-color, 0.1) 0%, rgba($info-color, 0.05) 100%);
    .stat-icon {
      background: linear-gradient(135deg, $success-color 0%, $info-color 100%);
    }
  }

  &.occupied {
    background: linear-gradient(135deg, rgba($text-light, 0.1) 0%, rgba($border-color, 0.05) 100%);
    .stat-icon {
      background: linear-gradient(135deg, $text-light 0%, $border-color 100%);
    }
  }
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: $text-primary;
}

.stat-name {
  font-size: 13px;
  color: $text-secondary;
}

:deep(.parking-selector-dialog) {
  .el-dialog__body {
    padding: 20px;
  }
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.area-selector {
  display: flex;
  align-items: center;
  gap: 10px;

  .label {
    font-size: 14px;
    color: $text-secondary;
  }
}

.legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $text-secondary;
}

.legend-box {
  width: 24px;
  height: 24px;
  border-radius: 4px;

  &.available {
    background: $bg-light;
    border: 2px solid $border-color;
  }

  &.occupied {
    background: $text-light;
    border: 2px solid $text-light;
  }

  &.selected {
    background: rgba($primary-color, 0.15);
    border: 2px solid $primary-color;
  }
}

.parking-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: $bg-light;
  border-radius: $border-radius;
}

.screen-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 16px;
}

.parking-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.parking-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.row-label {
  width: 30px;
  font-size: 12px;
  color: $text-light;
  font-weight: 600;
  text-align: center;
}

.parking-spot {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: $transition;

  &.available {
    background: $bg-card;
    border: 2px solid $border-color;

    &:hover {
      border-color: $primary-color;
      background: rgba($primary-color, 0.05);
    }
  }

  &.occupied {
    background: $text-light;
    border: 2px solid $text-light;
    cursor: not-allowed;

    .spot-icon {
      color: white;
    }
  }

  &.selected {
    background: rgba($primary-color, 0.15);
    border: 2px solid $primary-color;

    .spot-number {
      color: $primary-color;
      font-weight: 700;
    }
  }

  &.is-aisle {
    background: transparent;
    border: none;
    cursor: default;
  }

  @media (max-width: $breakpoint-mobile) {
    width: 32px;
    height: 32px;
  }
}

.spot-number {
  font-size: 11px;
  font-weight: 500;
  color: $text-secondary;

  @media (max-width: $breakpoint-mobile) {
    font-size: 9px;
  }
}

.dialog-footer-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  .spot-highlight {
    font-size: 16px;
    font-weight: 700;
    color: $primary-color;
  }

  .price-info {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: $text-secondary;

    .price-value {
      color: $primary-color;
      font-weight: 600;
    }

    .or {
      color: $text-light;
    }
  }
}

.no-selected {
  font-size: 14px;
  color: $text-light;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.payment-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: $bg-light;
  border-radius: $border-radius-sm;

  .label {
    font-size: 14px;
    color: $text-secondary;
  }

  .value {
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;
  }
}

.duration-section {
  .duration-label {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 12px;
  }
}

.duration-options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

.duration-option {
  position: relative;
  padding: 16px 12px;
  border: 2px solid $border-color;
  border-radius: $border-radius-sm;
  text-align: center;
  cursor: pointer;
  transition: $transition;

  &:hover {
    border-color: $primary-light;
  }

  &.active {
    border-color: $primary-color;
    background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-light, 0.03) 100%);
  }
}

.duration-months {
  font-size: 16px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4px;
}

.duration-price {
  font-size: 14px;
  color: $primary-color;
  font-weight: 600;
  margin-bottom: 4px;
}

.discount {
  font-size: 11px;
  color: $danger-color;
  font-weight: 500;
}

.summary-section {
  padding: 16px;
  background: $bg-light;
  border-radius: $border-radius-sm;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;

  &.total {
    padding-top: 12px;
    margin-top: 8px;
    border-top: 1px dashed $border-color;
  }

  .summary-label {
    font-size: 14px;
    color: $text-secondary;
  }

  .summary-value {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;

    &.total {
      font-size: 20px;
      color: $primary-color;
    }
  }
}

.agreement-section {
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

.payment-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

.total-info {
  display: flex;
  align-items: baseline;
  gap: 6px;

  .total-label {
    font-size: 14px;
    color: $text-secondary;
  }

  .total-amount {
    font-size: 22px;
    font-weight: 700;
    color: $primary-color;
  }
}
</style>
