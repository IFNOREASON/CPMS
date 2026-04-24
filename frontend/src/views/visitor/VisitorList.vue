<template>
  <div class="visitor-list-container page-container">
    <div class="page-header">
      <h1 class="page-title">预约记录</h1>
      <el-button type="primary" @click="goToVisitor">
        <el-icon><Plus /></el-icon>
        新增预约
      </el-button>
    </div>

    <div class="filter-section card">
      <div class="filter-tabs">
        <div
          v-for="tab in tabs"
          :key="tab.value"
          class="filter-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-count">{{ tab.count }}</span>
        </div>
      </div>
    </div>

    <div class="list-section">
      <div class="visitor-card" v-for="item in visitorList" :key="item.id">
        <div class="card-header">
          <div class="visitor-name">{{ item.visitorName }}</div>
          <el-tag :type="getStatusType(item.status)" size="small">
            {{ getStatusText(item.status) }}
          </el-tag>
        </div>
        <div class="card-content">
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">访客电话：</span>
              <span class="info-value">{{ item.visitorPhone }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">访问地址：</span>
              <span class="info-value">{{ item.address }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">访问时间：</span>
              <span class="info-value">{{ item.visitTime }}</span>
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <span class="info-label">访问类型：</span>
              <el-tag size="small" :type="item.visitType === 'temporary' ? 'info' : 'warning'">
                {{ item.visitType === 'temporary' ? '临时访客' : '常访客人' }}
              </el-tag>
            </div>
            <div class="info-item" v-if="item.needParking">
              <span class="info-label">车位需求：</span>
              <el-tag size="small" type="primary">需要停车位</el-tag>
            </div>
          </div>
          <div class="passcode-section" v-if="item.status === 'active'">
            <div class="passcode-label">访客通行码：</div>
            <div class="passcode-box">
              <span class="passcode-digit" v-for="(digit, index) in item.passCode" :key="index">
                {{ digit }}
              </span>
            </div>
            <div class="passcode-tip">
              <el-icon><InfoFilled /></el-icon>
              请将通行码告知访客，凭码进入小区
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="create-time">
            <span>创建时间：{{ item.createTime }}</span>
          </div>
          <div class="actions">
            <template v-if="item.status === 'active'">
              <el-button type="primary" text size="small">
                复制通行码
              </el-button>
              <el-button type="primary" text size="small">
                转发访客
              </el-button>
            </template>
            <template v-if="item.status === 'pending' || item.status === 'active'">
              <el-button type="danger" text size="small">
                取消预约
              </el-button>
            </template>
            <el-button type="primary" text size="small">
              查看详情
            </el-button>
          </div>
        </div>
      </div>

      <div class="empty-state" v-if="visitorList.length === 0">
        <el-icon :size="64" color="#999"><User /></el-icon>
        <p>暂无访客预约记录</p>
        <el-button type="primary" @click="goToVisitor">立即预约</el-button>
      </div>
    </div>

    <div class="pagination-section" v-if="visitorList.length > 0">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="10"
        :total="total"
        layout="prev, pager, next"
        background
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('all')
const currentPage = ref(1)
const total = ref(5)

const tabs = [
  { label: '全部', value: 'all', count: 0 },
  { label: '待生效', value: 'pending', count: 1 },
  { label: '进行中', value: 'active', count: 2 },
  { label: '已过期', value: 'expired', count: 2 },
  { label: '已取消', value: 'cancelled', count: 0 }
]

const visitorList = reactive([
  {
    id: 1,
    visitorName: '李四',
    visitorPhone: '139****5678',
    address: '1号楼 2单元 301室',
    visitTime: '2024-01-16 10:00 - 18:00',
    visitType: 'temporary',
    needParking: true,
    status: 'active',
    passCode: ['8', '4', '6', '2'],
    createTime: '2024-01-15 09:30'
  },
  {
    id: 2,
    visitorName: '王五',
    visitorPhone: '138****1234',
    address: '1号楼 2单元 301室',
    visitTime: '2024-01-20 14:00 - 20:00',
    visitType: 'frequent',
    needParking: false,
    status: 'pending',
    passCode: [],
    createTime: '2024-01-15 14:00'
  },
  {
    id: 3,
    visitorName: '保洁阿姨',
    visitorPhone: '137****9876',
    address: '1号楼 2单元 301室',
    visitTime: '2024-01-14 09:00 - 12:00',
    visitType: 'frequent',
    needParking: false,
    status: 'expired',
    passCode: [],
    createTime: '2024-01-13 16:00'
  }
])

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    active: 'success',
    expired: 'info',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待生效',
    active: '进行中',
    expired: '已过期',
    cancelled: '已取消'
  }
  return map[status] || '未知'
}

const goToVisitor = () => {
  router.push('/visitor')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.visitor-list-container {
  max-width: 800px;
  margin: 0 auto;
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

.filter-section {
  margin-bottom: 20px;
  padding: 0;
  overflow: hidden;
}

.filter-tabs {
  display: flex;
  overflow-x: auto;
  padding: 0 8px;
  
  @media (max-width: $breakpoint-mobile) {
    padding: 0 4px;
  }
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 16px 20px;
  font-size: 14px;
  color: $text-secondary;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: $transition;
  
  &:hover {
    color: $primary-color;
  }
  
  &.active {
    color: $primary-color;
    font-weight: 600;
    border-bottom-color: $primary-color;
  }
}

.tab-count {
  background: rgba($primary-color, 0.1);
  color: $primary-color;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
}

.visitor-card {
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
}

.visitor-name {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
}

.card-content {
  padding: 16px 20px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.info-label {
  color: $text-secondary;
}

.info-value {
  color: $text-primary;
  font-weight: 500;
}

.passcode-section {
  margin-top: 20px;
  padding: 16px;
  background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-light, 0.1) 100%);
  border-radius: $border-radius-sm;
  border: 1px dashed $primary-light;
}

.passcode-label {
  font-size: 14px;
  color: $text-secondary;
  margin-bottom: 12px;
}

.passcode-box {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.passcode-digit {
  width: 48px;
  height: 56px;
  background: $bg-card;
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: $primary-color;
  box-shadow: 0 2px 8px $shadow-color;
}

.passcode-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  color: $text-light;
  
  .el-icon {
    font-size: 14px;
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
}

.create-time {
  font-size: 13px;
  color: $text-light;
}

.actions {
  display: flex;
  gap: 8px;
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
}

.pagination-section {
  display: flex;
  justify-content: center;
  padding: 20px 0 40px;
}
</style>
