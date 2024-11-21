<template>
    <div :id="id"></div>
</template>
<script setup>
import { ref, onMounted, beforeMount } from "vue"
import * as echarts from 'echarts';

const id = ref('')
beforeMount(() => {
    id.value = '123'
})
onMounted(() => {
    var chartDom = document.getElementById(id.value);
    var myChart = echarts.init(chartDom);
})
</script>
<style scoped lang="scss"></style>