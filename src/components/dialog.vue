<script setup>
import { ref, watch } from 'vue'
const emit = defineEmits(['confirmDialog', 'cancel'])
const props = defineProps({
  open: Boolean,
  dialogConfig: Object,
  confirmLoading: Boolean,
})

const handleOk = (e) => {
  emit('confirmDialog')
}

const handleCancel = (e) => {
  console.log(e, 'e')
  emit('cancel')
}
watch(
  () => props.confirmLoading,
  (newVal) => {
    // console.log(newVal, 'watch')
  },
  { deep: true, immediate: true },
)
</script>

<template>
  <div ref="basemodal">
    <a-modal
      :open="open"
      :title="dialogConfig.title"
      @ok="handleOk"
      @cancel="handleCancel"
      :getContainer="() => $refs['basemodal']"
      :ok-text="dialogConfig.oktext"
      :cancel-text="dialogConfig.canceltext"
      :footer="dialogConfig.footer"
      :confirm-loading="confirmLoading"
    >
      <slot></slot>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
:deep(.ant-modal-header) {
  text-align: center;
  margin-bottom: 60px;
  .ant-modal-title {
    font-weight: bold;
    font-size: 28px;
    color: #000000;
  }
}
</style>
