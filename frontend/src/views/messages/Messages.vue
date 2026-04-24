<template>
  <div class="messages-container page-container">
    <div class="page-header">
      <h1 class="page-title">消息中心</h1>
      <el-button type="primary" text @click="markAllRead">
        <el-icon><Check /></el-icon>
        全部已读
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
          <span v-if="tab.unread > 0" class="unread-badge">{{ tab.unread }}</span>
        </div>
      </div>
    </div>

    <div class="message-list">
      <div
        class="message-card"
        v-for="item in messageList"
        :key="item.id"
        :class="{ unread: !item.isRead }"
        @click="handleMessageClick(item)"
      >
        <div class="message-icon" :class="item.type">
          <el-icon :size="22">{{ getMessageIcon(item.type) }}</el-icon>
        </div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-title">{{ item.title }}</span>
            <span class="message-time">{{ item.time }}</span>
          </div>
          <div class="message-desc">{{ item.description }}</div>
          <div class="message-extra" v-if="item.extra">
            <el-tag size="small" :type="item.extra.type">{{ item.extra.text }}</el-tag>
          </div>
        </div>
        <div class="message-status">
          <div v-if="!item.isRead" class="unread-dot"></div>
        </div>
      </div>

      <div class="empty-state" v-if="messageList.length === 0">
        <el-icon :size="64" color="#999"><Bell /></el-icon>
        <p>暂无消息</p>
      </div>
    </div>

    <div class="pagination-section" v-if="messageList.length > 0">
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
import { reactive, ref, h } from 'vue'
import { ElMessageBox } from 'element-plus'

const activeTab = ref('all')
const currentPage = ref(1)
const total = ref(12)

const tabs = [
  { label: '全部', value: 'all', unread: 3 },
  { label: '系统通知', value: 'system', unread: 1 },
  { label: '工单消息', value: 'repair', unread: 2 },
  { label: '缴费提醒', value: 'payment', unread: 0 },
  { label: '公告通知', value: 'notice', unread: 0 }
]

const messageList = reactive([
  {
    id: 1,
    type: 'system',
    title: '系统维护通知',
    description: '系统将于今晚22:00-次日02:00进行例行维护，期间部分功能可能无法使用，请提前做好准备。',
    time: '2024-01-15 10:30',
    isRead: false,
    extra: null
  },
  {
    id: 2,
    type: 'repair',
    title: '报修工单已分配',
    description: '您提交的报修工单（客厅灯不亮）已分配给维修师傅王师傅，请保持电话畅通。',
    time: '2024-01-15 09:15',
    isRead: false,
    extra: { type: 'primary', text: '处理中' }
  },
  {
    id: 3,
    type: 'repair',
    title: '报修工单已完成',
    description: '您的报修工单（厨房水龙头漏水）已完成维修，维修师傅：李师傅，服务评价：5星。',
    time: '2024-01-14 16:20',
    isRead: true,
    extra: { type: 'success', text: '已完成' }
  },
  {
    id: 4,
    type: 'system',
    title: '访客预约已生效',
    description: '您预约的访客李四的通行码已生效，通行码：8462，有效期至今日23:59。',
    time: '2024-01-14 08:00',
    isRead: true,
    extra: { type: 'warning', text: '进行中' }
  },
  {
    id: 5,
    type: 'payment',
    title: '物业费缴费提醒',
    description: '您的2024年第一季度物业费即将到期，请于1月31日前完成缴费，逾期将产生滞纳金。',
    time: '2024-01-10 14:00',
    isRead: true,
    extra: { type: 'danger', text: '待缴费' }
  }
])

const getMessageIcon = (type) => {
  const map = {
    system: 'InfoFilled',
    repair: 'Tools',
    payment: 'Wallet',
    notice: 'BellFilled'
  }
  return h(map[type] || 'Message')
}

const handleMessageClick = (item) => {
  console.log('点击消息:', item)
}

const markAllRead = () => {
  ElMessageBox.confirm(
    '确定将所有消息标记为已读吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    console.log('全部已读')
  }).catch(() => {
    console.log('取消')
  })
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.messages-container {
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

.unread-badge {
  background: $danger-color;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.message-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-card {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  background: $bg-card;
  border-radius: $border-radius;
  box-shadow: 0 4px 12px $shadow-color;
  cursor: pointer;
  transition: $transition;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px $shadow-color;
  }
  
  &.unread {
    background: linear-gradient(90deg, rgba($primary-color, 0.03) 0%, transparent 100%);
    border-left: 3px solid $primary-color;
  }
}

.message-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
  
  &.system {
    background: rgba($info-color, 0.1);
    color: $info-color;
  }
  
  &.repair {
    background: rgba($primary-color, 0.1);
    color: $primary-color;
  }
  
  &.payment {
    background: rgba($danger-color, 0.1);
    color: $danger-color;
  }
  
  &.notice {
    background: rgba($warning-color, 0.15);
    color: #D4A017;
  }
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 12px;
}

.message-title {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 12px;
  color: $text-light;
  white-space: nowrap;
  flex-shrink: 0;
}

.message-desc {
  font-size: 14px;
  color: $text-secondary;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 8px;
}

.message-extra {
  display: flex;
  align-items: center;
}

.message-status {
  margin-left: 12px;
  padding-top: 4px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background: $primary-color;
  border-radius: 50%;
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
