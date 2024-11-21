<script setup>
import { ref, inject, computed, getCurrentInstance } from 'vue'
import app from '@/constants/app'
const instance = getCurrentInstance()
const message = inject('message')
const emit = defineEmits()
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const fileList = ref([])
const loading = ref(true)
//上传请求地址
const queryUrl = ref(app.api + '/api/user/upload.do')
// 上传图片地址
const uploadUrl = ref('')

const props = defineProps({
  defaultImg: String, //默认图片
  updateImg: String, //保存后接口返回图片
  styleWH: Object, //样式
})

const handleChange = (info) => {
  console.log(info, 'info')
  if (info.file.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file.status === 'done') {
    uploadUrl.value = info.file.response.data
    emit('imgAddr', info.file.response.data) //上传之后的图片地址
  }
  if (info.file.status === 'error') {
    loading.value = false
    message.error(textI18n('other.a11'))
  }
}
const beforeUpload = (file) => {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  if (!isJpgOrPng) {
    message.error(textI18n('other.a10'))
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error(textI18n('other.a12'))
  }
  return isJpgOrPng && isLt2M
}
const imageUrl = computed(() => {
  return instance.appContext.config.globalProperties.$imagePrefix
})
</script>
<template>
  <a-upload
    v-model:file-list="fileList"
    name="upload_file"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :action="queryUrl"
    :before-upload="beforeUpload"
    @change="handleChange"
  >
    <img v-if="uploadUrl" :src="imageUrl + uploadUrl" :style="props.styleWH" />
    <div v-else style="width: 100%">
      <img v-if="props.updateImg" :src="imageUrl + props.updateImg" :style="props.styleWH" />
      <img v-else :src="props.defaultImg" :style="props.styleWH" />
    </div>
  </a-upload>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep(.ant-upload-select) {
    width: 90% !important;
    height: 90% !important;
    border: none !important;
    background: none !important;
  }
}
</style>
