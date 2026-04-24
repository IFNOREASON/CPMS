<template>
  <div class="repair-list-container page-container">
    <div class="page-header">
      <h1 class="page-title">报修记录</h1>
      <el-button type="primary" @click="goToRepair">
        <el-icon><Plus /></el-icon>
        提交报修
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
      <div class="repair-card" v-for="item in repairList" :key="item.id">
        <div class="card-header">
          <div class="repair-type">{{ item.typeName }}</div>
          <el-tag :type="getStatusType(item.status)" size="small">
            {{ getStatusText(item.status) }}
          </el-tag>
        </div>
        <div class="card-content">
          <div class="repair-title">{{ item.title }}</div>
          <div class="repair-desc">{{ item.description }}</div>
          <div class="repair-meta">
            <div class="meta-item">
              <el-icon><Location /></el-icon>
              <span>{{ item.address }}</span>
            </div>
            <div class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>{{ item.createTime }}</span>
            </div>
          </div>
          <div class="repair-images" v-if="item.images && item.images.length > 0">
            <div
              v-for="(img, index) in item.images.slice(0, 3)"
              :key="index"
              class="image-item"
            >
              <div class="image-placeholder">
                <el-icon><Picture /></el-icon>
              </div>
            </div>
            <div v-if="item.images.length > 3" class="image-more">
              +{{ item.images.length - 3 }}
            </div>
          </div>
        </div>
        <div class="card-footer">
          <template v-if="item.status === 'pending' || item.status === 'processing'">
            <div class="worker-info" v-if="item.workerName">
              <span>维修人员：</span>
              <span class="worker-name">{{ item.workerName }}</span>
              <el-button type="primary" text size="small">
                <el-icon><Phone /></el-icon>
                联系
              </el-button>
            </div>
            <el-button type="danger" text size="small" v-if="item.status === 'pending'">
              取消报修
            </el-button>
          </template>
          <template v-else-if="item.status === 'completed'">
            <div class="rating-info">
              <el-rate v-model="item.rating" disabled :max="5" />
              <span class="rating-text">{{ item.rating > 0 ? '已评价' : '待评价' }}</span>
            </div>
            <el-button type="primary" text size="small" v-if="item.rating === 0">
              评价服务
            </el-button>
          </template>
          <el-button type="primary" text size="small">
            查看详情
          </el-button>
        </div>
      </div>

      <div class="empty-state" v-if="repairList.length === 0">
        <el-icon :size="64" color="#999"><Document /></el-icon>
        <p>暂无报修记录</p>
        <el-button type="primary" @click="goToRepair">立即报修</el-button>
      </div>
    </div>

    <div class="pagination-section" v-if="repairList.length > 0">
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
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeTab = ref('all')
const currentPage = ref(1)
const total = ref(8)

const tabs = [
  { label: '全部', value: 'all', count: 0 },
  { label: '待分配', value: 'pending', count: 2 },
  { label: '处理中', value: 'processing', count: 1 },
  { label: '已完成', value: 'completed', count: 5 },
  { label: '已取消', value: 'cancelled', count: 0 }
]

const repairList = reactive([
  {
    id: 1,
    title: '客厅灯不亮',
    description: '客厅的吸顶灯突然不亮了，检查过开关和灯泡都没有问题，可能是电路问题...',
    typeName: '水电故障',
    type: 'water_electric',
    status: 'processing',
    address: '1号楼 2单元 301室',
    createTime: '2024-01-15 14:30',
    workerName: '王师傅',
    workerPhone: '139****1234',
    images: [1, 2, 3, 4],
    rating: 0
  },
  {
    id: 2,
    title: '楼道灯损坏',
    description: '2单元楼道3层的灯坏了，晚上上下楼很不方便',
    typeName: '公共设施',
    type: 'public_facility',
    status: 'pending',
    address: '1号楼 2单元 楼道',
    createTime: '2024-01-14 19:20',
    workerName: '',
    images: [],
    rating: 0
  },
  {
    id: 3,
    title: '厨房水龙头漏水',
    description: '厨房水龙头一直滴水，关不严实，需要维修',
    typeName: '水电故障',
    type: 'water_electric',
    status: 'completed',
    address: '1号楼 2单元 301室',
    createTime: '2024-01-10 09:15',
    workerName: '李师傅',
    images: [1],
    rating: 5
  },
  {
    id: 4,
    title: '空调不制冷',
    description: '卧室空调不制冷了，已经清洗过滤网还是不行',
    typeName: '家居维修',
    type: 'home_repair',
    status: 'completed',
    address: '1号楼 2单元 301室',
    createTime: '2024-01-05 11:00',
    workerName: '张师傅',
    images: [],
    rating: 4
  }
])

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待分配',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || '未知'
}

const goToRepair = () => {
  router.push('/repair')
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.repair-list-container {
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

.repair-card {
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

.repair-type {
  font-size: 13px;
  font-weight: 600;
  color: $primary-color;
  background: rgba($primary-color, 0.1);
  padding: 4px 10px;
  border-radius: 4px;
}

.card-content {
  padding: 16px 20px;
}

.repair-title {
  font-size: 16px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 8px;
}

.repair-desc {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.6;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.repair-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $text-light;
  
  .el-icon {
    font-size: 14px;
  }
}

.repair-images {
  display: flex;
  gap: 10px;
}

.image-item {
  width: 72px;
  height: 72px;
  border-radius: $border-radius-sm;
  overflow: hidden;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: $bg-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $text-light;
  font-size: 28px;
}

.image-more {
  width: 72px;
  height: 72px;
  border-radius: $border-radius-sm;
  background: $bg-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: $text-secondary;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: $bg-color;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: $text-secondary;
  
  .worker-name {
    font-weight: 500;
    color: $text-primary;
  }
}

.rating-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  font-size: 13px;
  color: $text-light;
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
