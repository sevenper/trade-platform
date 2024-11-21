<script setup>
import { onMounted, ref } from "vue";
import * as api from '@/axios/api';
import { setCache } from "@/utils/cache";
import { CacheStockDetail } from "@/constants/cacheKey";
// import { groupBy } from '@/utils/utils'
import { useRouter } from "vue-router";
const router = useRouter();
import { useAppStore } from "@/store/index";
const store = useAppStore()
const zsList = ref([])

onMounted(() => {
  init();
});
const init = () => {
    getListMarket()
}
const listClick = (item) => {
	store.$state.stockDetail = item
	setCache(CacheStockDetail, item, true);
	router.push('/stockdetail');
}

const getListMarket = async () => {
  const { data } = await api.getListMarket();
  zsList.value = data
//   const groupedArray = Object.values(groupBy(data, 'countryId'));
};
</script>
<template>
    <div class="zs-div">
        <div class="zs-div-item" v-for="(item, index) in zsList" :key="index" @click="listClick(item)">
            <div>
                <div class="title">
                    <p class="name">{{ item.indexName }}</p>
                    <p class="code">{{ item.indexCode }}</p>
                </div>
                <p class="last" :class="[item.chg_pct === 0 ? 'f-text-normal' : item.chg_pct > 0 ? 'f-text-up' : 'f-text-down']">{{ item.last }}</p>
                <div class="btm-div">
                    <p class="chg" :class="[item.chg_pct === 0 ? 'f-text-normal' : item.chg_pct > 0 ? 'f-text-up' : 'f-text-down']">{{ item.chg }}</p>
                    <p class="chg-pct" :class="[item.chg_pct === 0 ? 'f-text-normal' : item.chg_pct > 0 ? 'f-text-up' : 'f-text-down']">{{ item.chg_pct }}%</p>
                </div>
               
            </div>
            
        </div>
    </div>
</template>

<style lang="scss" scoped>

.zs-div::-webkit-scrollbar {
    display: none;
}
.zs-div{
    display: flex;
    overflow-x: scroll;
    .zs-div-item{
        display: flex;
        align-items: center;
        padding: 10px 20px;
        background: #FFFFFF;
        margin-right: 15px;
        font-weight: 500;
        font-size: 16px;
        color: #000000;
        cursor: pointer;
        .title{
            
            // display: flex;
            .name{
                font-weight: 500;
                font-size: 16px;
                color: #000000;
                width: 160px;
                // display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .code{
                font-weight: 500;
                font-size: 14px;
                color: #999999;
            }
        }
        .btm-div{
            font-size: 14px;
            display: flex;
            justify-content: space-between;
        }
    }
}

</style>