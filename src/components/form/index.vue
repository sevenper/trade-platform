<!--
 form 表单封装
-->
<script setup>
import { ref, reactive, watch } from "vue";

// const iconLoading = ref(false)

const props = defineProps({
  queryForm: Array,
  querySet: Object,
  paramsForm: Object,
  btnIconLoading: Boolean
});
  
const paramsForm = reactive(props.paramsForm);
const emit = defineEmits(['formSave']);
const onFinish = () => {
  console.log(paramsForm)
	emit("formSave", paramsForm);
};

watch(() => props.btnIconLoading,
(newVal) => {console.log(newVal,'watch')},
 { deep: true, immediate: true }
)


</script>

<template >
  <a-form
    :model="paramsForm"
    @finish="onFinish"
	:layout="querySet.direction"
	:label-col="querySet.labelCol"
	:wrapper-col="querySet.wrapperCol"
   
  >
    <span v-for="(item, index) in queryForm" :key="index">
      <a-form-item :label="item.label" :name="item.bindV">
        <a-input
			v-if="item.type === 'input'"
			:type="item.inputType"
			  v-model:value="paramsForm[item.bindV]"
			  :placeholder="item.placeholder"
			  :size="item.size"
			  allowClear
			  
        />
       <a-input-password
		  v-if="item.type === 'inputPWD'"
		  :type="item.inputType"
		  v-model:value="paramsForm[item.bindV]"
		  :placeholder="item.placeholder"
		  :size="item.size"
		  allowClear
        />
      </a-form-item>
    </span>

    <slot v-if="$slots.imgUp" name="imgUp" />
      
      <slot v-if="$slots.confirmLogin" name="confirmLogin" />

    <a-form-item>
     <a-button class="btn-style" :loading="btnIconLoading" :style="querySet.btnStyle" :size="querySet.btnSize" type="primary" html-type="submit" >{{
        querySet.btnName
      }}</a-button>
    </a-form-item>
  </a-form>
</template>

<style lang="scss" scoped>
	
	.btn-style{
		font-size: 24px;
		padding: 4px 14px;
		height: auto;
	}
</style>
