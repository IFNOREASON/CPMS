<template>
  <div class="visitor-unified-container page-container">
    <div class="page-header">
      <h1 class="page-title">访客预约</h1>
    </div>

    <div class="visitor-form-section card">
      <div class="section-title-bar">
        <el-icon :size="20" color="#FF8C42"><Edit /></el-icon>
        <span class="section-title">新增预约</span>
      </div>

      <div class="tips-card">
        <div class="tips-header">
          <el-icon :size="18" color="#FF8C42"><InfoFilled /></el-icon>
          <span class="tips-title">预约须知</span>
        </div>
        <ul class="tips-list">
          <li>访客预约成功后，将生成访客通行码，访客可凭码进入小区</li>
          <li>请提前填写访客信息，预约时间最长可提前7天</li>
          <li>临时访客通行码有效期为24小时</li>
        </ul>
      </div>

      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" class="form-content">
        <el-form-item label="访客姓名" prop="visitorName">
          <el-input v-model="formData.visitorName" placeholder="请输入访客姓名" />
        </el-form-item>

        <el-form-item label="访客电话" prop="visitorPhone">
          <el-input v-model="formData.visitorPhone" placeholder="请输入访客电话号码" />
        </el-form-item>

        <el-form-item label="访客身份证" prop="visitorIdCard">
          <el-input v-model="formData.visitorIdCard" placeholder="请输入访客身份证号（选填）" />
        </el-form-item>

        <el-form-item label="访问地址" prop="address">
          <el-select v-model="formData.address" placeholder="请选择访问地址" style="width: 100%">
            <el-option label="1号楼 2单元 301室" value="1-2-301" />
          </el-select>
        </el-form-item>

        <el-form-item label="访问类型">
          <el-radio-group v-model="formData.visitType">
            <el-radio value="temporary">
              <span class="radio-label">临时访客</span>
              <span class="radio-hint">单次访问，有效期24小时</span>
            </el-radio>
            <el-radio value="frequent">
              <span class="radio-label">常访客人</span>
              <span class="radio-hint">可设置有效期，多次访问</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="访问时间">
          <div class="time-section">
            <el-date-picker
              v-model="formData.visitDate"
              type="date"
              placeholder="选择访问日期"
              style="width: 100%"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
            <div class="time-range">
              <el-time-select
                v-model="formData.startTime"
                placeholder="开始时间"
                start="08:00"
                step="00:30"
                end="22:00"
                style="width: 48%"
              />
              <span class="time-divider">至</span>
              <el-time-select
                v-model="formData.endTime"
                placeholder="结束时间"
                start="08:00"
                step="00:30"
                end="23:59"
                style="width: 48%"
              />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="来访人数">
          <el-input-number v-model="formData.visitorCount" :min="1" :max="10" />
          <span class="hint-text">人</span>
        </el-form-item>

        <el-form-item label="访问事由" prop="reason">
          <el-input
            v-model="formData.reason"
            type="textarea"
            :rows="3"
            placeholder="请简述访问事由（选填）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="是否需要车位">
          <el-radio-group v-model="formData.needParking">
            <el-radio :value="false">不需要</el-radio>
            <el-radio :value="true">需要</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div class="action-section">
        <el-button size="large" class="reset-btn" @click="resetForm">
          <el-icon><Refresh /></el-icon>
          重置
        </el-button>
        <el-button type="primary" size="large" class="submit-btn" @click="handleSubmit">
          <el-icon><Check /></el-icon>
          提交预约
        </el-button>
      </div>
    </div>

    <div class="visitor-list-section">
      <div class="section-title-bar">
        <el-icon :size="20" color="#FF8C42"><Document /></el-icon>
        <span class="section-title">预约历史</span>
        <el-tag type="info" size="small">{{ visitorList.length }} 条记录</el-tag>
      </div>

      <div class="filter-buttons card">
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
        <div class="visitor-card" v-for="item in filteredVisitorList" :key="item.id">
          <div class="card-header">
            <div class="visitor-info">
              <el-avatar :size="40" class="visitor-avatar">
                <el-icon :size="24"><User /></el-icon>
              </el-avatar>
              <div class="visitor-detail">
                <div class="visitor-name">{{ item.visitorName }}</div>
                <div class="visitor-phone">{{ item.visitorPhone }}</div>
              </div>
            </div>
            <el-tag :type="getStatusType(item.status)" size="small">
              {{ getStatusText(item.status) }}
            </el-tag>
          </div>

          <div class="card-content">
            <div class="info-grid">
              <div class="info-item">
                <el-icon :size="14"><Location /></el-icon>
                <span class="info-text">{{ item.address }}</span>
              </div>
              <div class="info-item">
                <el-icon :size="14"><Clock /></el-icon>
                <span class="info-text">{{ item.visitTime }}</span>
              </div>
              <div class="info-item">
                <el-tag size="small" :type="item.visitType === 'temporary' ? 'info' : 'warning'">
                  {{ item.visitType === 'temporary' ? '临时访客' : '常访客人' }}
                </el-tag>
              </div>
              <div class="info-item" v-if="item.needParking">
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
                <el-icon :size="14"><InfoFilled /></el-icon>
                请将通行码告知访客，凭码进入小区
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="create-time">
              <el-icon :size="14"><Calendar /></el-icon>
              <span>创建时间：{{ item.createTime }}</span>
            </div>
            <div class="actions">
              <template v-if="item.status === 'active'">
                <el-button type="primary" text size="small">
                  <el-icon><CopyDocument /></el-icon>
                  复制通行码
                </el-button>
                <el-button type="primary" text size="small">
                  <el-icon><Share /></el-icon>
                  转发访客
                </el-button>
              </template>
              <template v-if="item.status === 'pending' || item.status === 'active'">
                <el-button type="danger" text size="small">
                  <el-icon><Close /></el-icon>
                  取消预约
                </el-button>
              </template>
              <el-button type="primary" text size="small">
                <el-icon><View /></el-icon>
                详情
              </el-button>
            </div>
          </div>
        </div>

        <div class="empty-state" v-if="filteredVisitorList.length === 0">
          <el-icon :size="64" color="#999"><User /></el-icon>
          <p>{{ currentFilter === 'all' ? '暂无访客预约记录' : '暂无该状态的预约记录' }}</p>
          <el-button type="primary" v-if="currentFilter === 'all'" @click="scrollToForm">
            <el-icon><Plus /></el-icon>
            立即预约
          </el-button>
        </div>
      </div>

      <div class="pagination-section" v-if="filteredVisitorList.length > 0">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="5"
          :total="filteredVisitorList.length"
          layout="prev, pager, next"
          background
          small
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const formRef = ref(null)

const formData = reactive({
  visitorName: '',
  visitorPhone: '',
  visitorIdCard: '',
  address: '',
  visitType: 'temporary',
  visitDate: '',
  startTime: '',
  endTime: '',
  visitorCount: 1,
  reason: '',
  needParking: false
})

const rules = {
  visitorName: [
    { required: true, message: '请输入访客姓名', trigger: 'blur' }
  ],
  visitorPhone: [
    { required: true, message: '请输入访客电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  address: [
    { required: true, message: '请选择访问地址', trigger: 'change' }
  ],
  reason: [
    { max: 200, message: '访问事由不能超过200字', trigger: 'blur' }
  ]
}

const currentFilter = ref('all')
const currentPage = ref(1)

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

const filterButtons = computed(() => {
  const counts = {
    all: visitorList.length,
    pending: visitorList.filter(item => item.status === 'pending').length,
    active: visitorList.filter(item => item.status === 'active').length,
    expired: visitorList.filter(item => item.status === 'expired').length,
    cancelled: visitorList.filter(item => item.status === 'cancelled').length
  }

  return [
    { label: '全部', value: 'all', count: counts.all },
    { label: '待生效', value: 'pending', count: counts.pending },
    { label: '进行中', value: 'active', count: counts.active },
    { label: '已过期', value: 'expired', count: counts.expired },
    { label: '已取消', value: 'cancelled', count: counts.cancelled }
  ]
})

const filteredVisitorList = computed(() => {
  if (currentFilter.value === 'all') {
    return visitorList
  }
  return visitorList.filter(item => item.status === currentFilter.value)
})

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

const resetForm = () => {
  formRef.value?.resetFields()
  formData.visitType = 'temporary'
  formData.visitorCount = 1
  formData.needParking = false
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const newVisitor = {
        id: Date.now(),
        visitorName: formData.visitorName,
        visitorPhone: formData.visitorPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
        address: '1号楼 2单元 301室',
        visitTime: `${formData.visitDate} ${formData.startTime} - ${formData.endTime}`,
        visitType: formData.visitType,
        needParking: formData.needParking,
        status: 'pending',
        passCode: [],
        createTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-')
      }

      visitorList.unshift(newVisitor)
      ElMessage.success('预约提交成功！')
      resetForm()
    }
  })
}

const scrollToForm = () => {
  document.querySelector('.visitor-form-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.visitor-unified-container {
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

.visitor-form-section {
  padding: 20px;
  margin-bottom: 24px;

  @media (max-width: $breakpoint-mobile) {
    padding: 16px;
    margin-bottom: 16px;
  }
}

.tips-card {
  padding: 16px;
  background: linear-gradient(135deg, rgba($primary-color, 0.05) 0%, rgba($primary-light, 0.08) 100%);
  border-radius: $border-radius-sm;
  border: 1px dashed $primary-light;
  margin-bottom: 20px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  color: $primary-color;
}

.tips-list {
  list-style: none;
  padding-left: 24px;
  margin: 0;

  li {
    position: relative;
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.8;
    margin-bottom: 2px;

    &::before {
      content: '';
      position: absolute;
      left: -16px;
      top: 8px;
      width: 5px;
      height: 5px;
      background: $primary-color;
      border-radius: 50%;
    }
  }
}

.form-content {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}

.radio-label {
  font-weight: 500;
  color: $text-primary;
}

.radio-hint {
  font-size: 12px;
  color: $text-light;
  margin-left: 8px;
}

.time-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 12px;
}

.time-divider {
  font-size: 14px;
  color: $text-secondary;
}

.hint-text {
  font-size: 14px;
  color: $text-secondary;
  margin-left: 12px;
}

.action-section {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid $border-color;

  @media (max-width: $breakpoint-mobile) {
    gap: 12px;
    margin-top: 16px;
  }
}

.reset-btn,
.submit-btn {
  flex: 1;
  height: 46px;
  font-size: 15px;
  border-radius: $border-radius-sm;

  .el-icon {
    margin-right: 4px;
  }
}

.reset-btn {
  border-color: $border-color;
  color: $text-secondary;

  &:hover {
    border-color: $primary-color;
    color: $primary-color;
  }
}

.submit-btn {
  border-radius: $border-radius-sm;
}

.visitor-list-section {
  .section-title-bar {
    padding-bottom: 8px;
    margin-bottom: 12px;
  }
}

.filter-buttons {
  padding: 16px;
  margin-bottom: 16px;

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
  background: linear-gradient(135deg, $bg-light 0%, $bg-card 100%);

  @media (max-width: $breakpoint-mobile) {
    padding: 14px 16px;
  }
}

.visitor-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.visitor-avatar {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  color: white;
}

.visitor-detail {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.visitor-name {
  font-size: 15px;
  font-weight: 600;
  color: $text-primary;
}

.visitor-phone {
  font-size: 13px;
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: $text-secondary;

  .el-icon {
    color: $primary-color;
  }
}

.info-text {
  color: $text-primary;
  font-weight: 500;
}

.passcode-section {
  margin-top: 16px;
  padding: 14px;
  background: linear-gradient(135deg, rgba($success-color, 0.05) 0%, rgba(107, 203, 119, 0.08) 100%);
  border-radius: $border-radius-sm;
  border: 1px dashed $success-color;
}

.passcode-label {
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 10px;
}

.passcode-box {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.passcode-digit {
  width: 44px;
  height: 52px;
  background: $bg-card;
  border-radius: $border-radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  color: $success-color;
  box-shadow: 0 2px 8px rgba($success-color, 0.2);
}

.passcode-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: $text-light;

  .el-icon {
    color: $success-color;
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

.create-time {
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
