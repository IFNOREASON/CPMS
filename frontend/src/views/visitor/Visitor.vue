<template>
  <div class="visitor-container page-container">
    <div class="page-header">
      <h1 class="page-title">访客预约</h1>
      <el-button type="primary" text @click="goToVisitorList">
        <el-icon><List /></el-icon>
        预约记录
      </el-button>
    </div>

    <div class="tips-card card">
      <div class="tips-header">
        <el-icon :size="20" color="#FF8C42"><InfoFilled /></el-icon>
        <span class="tips-title">预约须知</span>
      </div>
      <ul class="tips-list">
        <li>访客预约成功后，将生成访客通行码，访客可凭码进入小区</li>
        <li>请提前填写访客信息，预约时间最长可提前7天</li>
        <li>临时访客通行码有效期为24小时</li>
      </ul>
    </div>

    <div class="visitor-form card">
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
    </div>

    <div class="action-section">
      <el-button size="large" class="cancel-btn">取消</el-button>
      <el-button type="primary" size="large" class="submit-btn" @click="handleSubmit">
        提交预约
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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

const goToVisitorList = () => {
  router.push('/visitor/list')
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交预约:', formData)
    }
  })
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.visitor-container {
  max-width: 700px;
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

.tips-card {
  margin-bottom: 20px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tips-title {
  font-size: 15px;
  font-weight: 600;
  color: $primary-color;
}

.tips-list {
  list-style: none;
  padding-left: 28px;
  
  li {
    position: relative;
    font-size: 13px;
    color: $text-secondary;
    line-height: 1.8;
    margin-bottom: 4px;
    
    &::before {
      content: '';
      position: absolute;
      left: -20px;
      top: 8px;
      width: 6px;
      height: 6px;
      background: $primary-color;
      border-radius: 50%;
    }
  }
}

.form-content {
  :deep(.el-form-item) {
    margin-bottom: 24px;
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
  padding-bottom: 40px;
  
  @media (max-width: $breakpoint-mobile) {
    gap: 12px;
    margin-top: 16px;
  }
}

.cancel-btn {
  flex: 1;
  height: 48px;
  font-size: 16px;
  border-color: $border-color;
  color: $text-secondary;
  
  &:hover {
    border-color: $primary-color;
    color: $primary-color;
  }
}

.submit-btn {
  flex: 2;
  height: 48px;
  font-size: 16px;
}
</style>
