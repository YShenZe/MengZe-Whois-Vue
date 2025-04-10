<template>
  <div class="container">
    <el-card class="main-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="28" color="#409EFF"><Search /></el-icon>
          <span class="title">梦泽Whois系统</span>
        </div>
      </template>

      <div class="search-box">
        <el-input 
          v-model="domain" 
          placeholder="键入域名以查询..."
          @keyup.enter="handleQuery"
          clearable
          size="large"
        >
          <template #prepend>
            <el-icon><Link /></el-icon>
          </template>
          <template #append>
            <el-button 
              type="primary" 
              :icon="Search" 
              @click="handleQuery"
              :loading="loading"
              size="large"
            >
            </el-button>
          </template>
        </el-input>
      </div>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        class="alert-box"
      />

      <div v-if="result" class="result-area">
        <el-tabs v-model="activeTab" class="result-tabs">
          <el-tab-pane label="解析结果" name="parsed">
            <div class="parsed-result" ref="screenshotContent">
              <pre>{{ translatedResult }}</pre>
            </div>
          </el-tab-pane>
          <el-tab-pane label="原始数据" name="raw">
            <el-input
              v-model="result"
              type="textarea"
              :rows="15"
              readonly
              class="raw-data"
            />
          </el-tab-pane>
        </el-tabs>

        <div class="action-btns">
          <el-button 
            type="success" 
            :icon="Camera" 
            @click="captureScreenshot"
            plain
          >
            保存截图
          </el-button>
          <el-button 
            type="danger" 
            :icon="Delete" 
            @click="clearAll"
            plain
          >
            清空结果
          </el-button>
        </div>
      </div>

      <div class="footer">
        <el-divider />
        <span class="copyright">© 2024 Whois查询工具 v1.0</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import html2canvas from 'html2canvas'
import { 
  Search,
  Link,
  Camera,
  Delete
} from '@element-plus/icons-vue'

const domain = ref('')
const result = ref('')
const error = ref('')
const loading = ref(false)
const activeTab = ref('parsed')
const screenshotContent = ref(null)

const translateMap = {
  'Domain Name': '域名',
  'Registrar': '注册商',
  'Creation Date': '创建日期',
  'Expiration Date': '到期日期',
  'Updated Date': '更新日期',
  'Name Server': '域名服务器',
  'Registrant': '注册人',
  'Admin': '管理员',
  'Tech': '技术支持',
  'Status': '状态',
  'Domain Status': '域名状态',
  'Registered On': '注册时间',
  'Registry Expiry Date': '注册局到期日',
  'Registrar WHOIS Server': 'WHOIS服务器'
}

const translatedResult = computed(() => {
  return result.value.split('\n').map(line => {
    const [keyPart, ...valueParts] = line.split(':')
    const value = valueParts.join(':').trim()
    
    const matchedKey = Object.keys(translateMap).find(enKey => 
      keyPart.trim().toLowerCase().startsWith(enKey.toLowerCase())
    )

    return matchedKey 
      ? `${translateMap[matchedKey]}：${value}`
      : line
  }).join('\n')
})

const handleQuery = async () => {
  if (!domain.value) {
    error.value = '请输入要查询的域名'
    return
  }

  try {
    loading.value = true
    error.value = ''
    const response = await axios.get('/api/whois', {
      params: { domain: domain.value.trim() }
    })
    result.value = response.data.result
  } catch (err) {
    error.value = err.response?.data?.error || '查询失败，请检查网络连接'
    result.value = ''
  } finally {
    loading.value = false
  }
}

const captureScreenshot = async () => {
  try {
    const canvas = await html2canvas(screenshotContent.value, {
      backgroundColor: '#FFFFFF',
      scale: 2,
      useCORS: true
    })
    
    const link = document.createElement('a')
    link.download = `whois_${domain.value}_${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (err) {
    error.value = '截图保存失败：' + err.message
  }
}

const clearAll = () => {
  domain.value = ''
  result.value = ''
  error.value = ''
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 20px;
  min-height: 100vh;
}

.main-card {
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.main-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 1px;
}

.search-box {
  margin: 25px 0;
}

.alert-box {
  margin: 15px 0;
}

.result-area {
  margin-top: 25px;
}

.parsed-result {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.8;
  color: #2d3748;
}

.parsed-result pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.raw-data {
  font-family: 'JetBrains Mono', monospace;
}

.action-btns {
  margin-top: 25px;
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.footer {
  margin-top: 30px;
  text-align: center;
}

.copyright {
  font-size: 14px;
  color: #718096;
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }

  .title {
    font-size: 20px;
  }

  .parsed-result {
    padding: 15px;
    font-size: 14px;
  }
}
</style>