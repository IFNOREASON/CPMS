<template>
  <div class="repair-container page-container">
    <div class="page-header">
      <h1 class="page-title">提交报修</h1>
      <el-button type="primary" text @click="goToRepairList">
        <el-icon><List /></el-icon>
        报修记录
      </el-button>
    </div>

    <div class="repair-form card">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" class="form-content">
        <el-form-item label="报修类型" prop="repairType">
          <el-select v-model="formData.repairType" placeholder="请选择报修类型" style="width: 100%">
            <el-option label="水电故障" value="water_electric" />
            <el-option label="公共设施损坏" value="public_facility" />
            <el-option label="家居维修" value="home_repair" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="报修地址" prop="address">
          <el-select v-model="formData.address" placeholder="请选择报修地址" style="width: 100%">
            <el-option label="1号楼 2单元 301室" value="1-2-301" />
          </el-select>
        </el-form-item>

        <el-form-item label="问题描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="请详细描述您遇到的问题，以便我们更好地为您服务..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="上传图片">
          <div class="upload-section">
            <el-upload
              class="uploader"
              action="#"
              :auto-upload="false"
              :limit="5"
              :on-change="handleUploadChange"
              :on-exceed="handleExceed"
              list-type="picture-card"
            >
              <el-icon class="upload-icon"><Plus /></el-icon>
              <div class="upload-text">上传图片</div>
              <div class="upload-hint">最多5张</div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 jpg、png 格式，单张图片不超过 5MB
                </div>
              </template>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="期望时间">
          <el-date-picker
            v-model="formData.expectedTime"
            type="datetime"
            placeholder="选择期望维修时间"
            style="width: 100%"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>

        <el-form-item label="是否紧急">
          <el-radio-group v-model="formData.isUrgent">
            <el-radio :value="false">普通</el-radio>
            <el-radio :value="true">
              <span class="urgent-text">紧急报修</span>
            </el-radio>
          </el-radio-group>
          <div class="urgent-hint">
            紧急报修将优先安排维修人员，请谨慎选择
          </div>
        </el-form-item>
      </el-form>
    </div>

    <div class="action-section">
      <el-button size="large" class="cancel-btn">取消</el-button>
      <el-button type="primary" size="large" class="submit-btn" @click="handleSubmit">
        提交报修
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
  repairType: '',
  address: '',
  description: '',
  phone: '',
  expectedTime: '',
  isUrgent: false
})

const rules = {
  repairType: [
    { required: true, message: '请选择报修类型', trigger: 'change' }
  ],
  address: [
    { required: true, message: '请选择报修地址', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入问题描述', trigger: 'blur' },
    { min: 10, message: '问题描述至少10个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const handleUploadChange = (file, fileList) => {
  console.log('上传文件:', file.name)
}

const handleExceed = () => {
  console.log('超出图片数量限制')
}

const goToRepairList = () => {
  router.push('/repair/list')
}

const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交报修:', formData)
    }
  })
}
</script>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.repair-container {
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

.form-content {
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
}

.upload-section {
  .uploader {
    :deep(.el-upload--picture-card) {
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: $bg-color;
      border: 2px dashed $border-color;
      border-radius: $border-radius-sm;
      
      &:hover {
        border-color: $primary-color;
      }
    }
  }
}

.upload-icon {
  font-size: 28px;
  color: $text-light;
}

.upload-text {
  font-size: 14px;
  color: $text-secondary;
  margin-top: 4px;
}

.upload-hint {
  font-size: 12px;
  color: $text-light;
}

.urgent-text {
  color: $danger-color;
  font-weight: 600;
}

.urgent-hint {
  font-size: 12px;
  color: $text-light;
  margin-top: 8px;
  margin-left: 8px;
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
