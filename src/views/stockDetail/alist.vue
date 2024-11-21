<script setup>
	import { reactive, getCurrentInstance, ref, watch, onMounted, onUnmounted, computed, nextTick, inject } from "vue";
	import { setCache, getToken } from "@/utils/cache";
	import { CacheStockDetail } from "@/constants/cacheKey";
	import * as api from "@/axios/api";
	
	import { LoadingOutlined } from "@ant-design/icons-vue"
	import zixuan from '@assets/img/common/zixuan.png'
	import zixuan1 from '@assets/img/common/zixuan2.png'	
	import { useAppStore } from "@/store/index";
	
	const message = inject("message");
	const store = useAppStore()
	const ishasNextPage = ref(true);
	const initLoading = ref(true);
	const pageNum = ref(1)
	const pageSize = ref(20)
	const dataLists = ref([]);
	const tokenExists = computed(() => {return store.$state.token})
	const {
	  proxy: { $t: textI18n },
	} = getCurrentInstance();

	const props = defineProps({
		country: '5'
	})
	
	const emit = defineEmits(["listStockClick"]);
	const checkScrollBottom = (event) => {
	  const { target } = event;
	  if ((target.clientHeight + target.scrollTop >= target.scrollHeight - 5) && ishasNextPage.value) {
		pageNum.value ++
		
		if(props.country === '-1'){ //自选列表
			   zixuanList()
			   return
		}
		if(props.country === '0'){ //指数列表
			   getListMarket()
			   return
		}
		getListStock(props.country)
	  }
	}
	
	
	// 默认国家
	const getListStock = async (countryId) => {
		
	  let params = {
	    countryId,
	    pageNum: pageNum.value,
	    pageSize: pageSize.value,
	  };
	  const { data } = await api.getStock(params);
	  initLoading.value = false;
	  ishasNextPage.value = data.hasNextPage
	  dataLists.value = [...dataLists.value, ...data.list];
	 
	  if(tokenExists.value && getToken()){
		  dataLists.value.forEach(item => {
		     //检测是否已经添加了自选
		    getOption(item.stockGid).then(status => {
		      item.isOptionOpt = status
		    })
		  })
	  }
	};
	
	// 指数
	const getListMarket = async () => {
	  const { data } = await api.getListMarket();
	 
	  dataLists.value = [...dataLists.value, ...data];
	 initLoading.value = false;
	 ishasNextPage.value = data.hasNextPage
	 
	};
	// 自选列表
	const zixuanList = async () => {
	  let params = {
	        pageNum: pageNum.value,
	        pageSize: pageSize.value
	    };
	    let {data} = await api.getMyList(params);
	     dataLists.value = [...dataLists.value, ...data.list];
		 initLoading.value = false;
		 ishasNextPage.value = data.hasNextPage
	};
	

const getOption = async (code) => {
  let params = { code };
  let data = await api.isOption(params);
  // 0 --> 未添加 1 已添加
  return data.status;
}
// 点击添加/取消自选
const zixuanClick = async (ele, type) => {
	if(!tokenExists || !getToken()){
	  message.warning(textI18n('login.a8'))
	  return
	}
  let gid = ele.stock_gid ?  ele.stock_gid :  ele.stockGid
  try {
    let response;
    if (type === 0) {
        response = await addAPI(gid);
    } else {
        response = await cancelAPI(gid);
    }
    if (response?.status === 0) {
      message.success(response.msg);
      if(ele.stock_gid){ //如果是自选列表，更新自选列表接口
        dataLists.value = dataLists.value.filter(item => item.stock_gid !== ele.stock_gid)
        return
      }
      dataLists.value.forEach((item) => {
		  if(item.stockGid === ele.stockGid ){
			  item.isOptionOpt = !item.isOptionOpt
		  }
      })
    }
  } catch (error){}
};
// 添加自选
const addAPI = async (code) => {
  let params = {code, type:1}
  let data = await api.addOption(params);
  return data
}
// 取消自选
const cancelAPI = async (code) => {
  let params = { code }
  let data = await api.delOption(params);
  return data
}

const handleClick = (item) => {
	setCache(CacheStockDetail, item, true);
	store.$state.stockDetail = item
	emit("listStockClick", item)
}

watch(
  () => props.country,
  async (newVal) => {
   pageNum.value = 1
   dataLists.value = []
   if(newVal === '-1'){ //自选列表
	   zixuanList()
	   return
   }
   if(newVal === '0'){ //指数列表
	   getListMarket()
	   return
   }
   getListStock(newVal)
  },
  { deep: true, immediate: true }
);
</script>


<template>
	<a-list
		 class="detail-list"
		 :loading="initLoading"
		 item-layout="horizontal"
		 :data-source="dataLists"
		 @scroll="checkScrollBottom"
	  >
	  
	  <template #loadMore>
	    <div class="bottom-div" v-if="!initLoading">
	  		<p><LoadingOutlined v-if="ishasNextPage" /> {{ishasNextPage ? $t('con.a23') : $t('con.a24')}}</p>
	    </div>
	  </template>
	  <template #renderItem="{ item }">
	    <a-list-item @click="handleClick(item)">
			<!-- country 国家列表添加取消自选按钮 -->
			<a-tooltip v-if="item.stockName">  
			 <template #title> {{ item.isOptionOpt ? $t('other.a3') : $t('other.a2') }}</template>
			<img
			  class="zixuan-img" 
			  @click.stop="zixuanClick(item, item.isOptionOpt)"
			  :src="item.isOptionOpt ? zixuan : zixuan1"
			  >
			 </a-tooltip>	
			<!-- country end -->
			<!--  自选列表取消自选按钮 -->
			<a-tooltip v-if="item.stock_name">  
				 <template #title> {{ $t('other.a3') }}</template>
				<img
				  class="zixuan-img" 
				  @click.stop="zixuanClick(item, 1)"
				  :src="zixuan"
				  >
			 </a-tooltip>	
			<!-- end -->
			
		   <a-list-item-meta :description="item.stockCode || item.indexCode || item.stock_code" >
			 <template #title>
				 <a-tooltip>
				 	<template #title> 
					{{ item.stockName || item.indexName || item.stock_name}}</template>
					<span class="name">{{ item.stockName || item.indexName || item.stock_name}}</span>
			   </a-tooltip>
			 </template>
		 
		   </a-list-item-meta>
		   <p class="price">
			 {{ item.last }}
		   </p>
		   <p
			 class="present"
			  :class="[item.chg_pct === 0 ? 'f-text-normal' : item.chg_pct > 0 ? 'f-text-up' : 'f-text-down']"
		   >
			 {{ item.chg_pct }}%
		   </p>
	
	    </a-list-item>
	  </template>
	
	</a-list>
	  
	
</template>


<style lang="scss" scoped>
	.detail-list{
		::v-deep{
			.ant-list-item{
				padding: 12px 16px;
				cursor: pointer;
				.ant-list-item-meta-content{
					.ant-list-item-meta-title{
						line-height: 20px;
						.name{
							width: 100%;
							font-weight: bold;
							font-size: 14px;
							color: #FFFFFF;
							display: inline-block;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}
					.ant-list-item-meta-description{
						font-weight: 500;
						font-size: 12px;
						color: #7E8697;
					}
				}
			}
			.ant-list-item:hover{
				background: #1B1E28;
			}
			
		}
		
		.price{
			font-weight: bold;
			font-size: 12px;
			color: #FFFFFF;
			width: 26%;
			text-align: right;
		}
		.present{
			font-weight: bold;
			font-size: 12px;
			color: #00A27E;
			width: 26%;
			text-align: right;
		}
		.bottom-div{
			color: #fff;
			font-size: 16px;
			text-align: center;
		}
		.zixuan-img{
			width: 20px;
			height: 20px;
			margin-right: 10px;
		}
	}
</style>