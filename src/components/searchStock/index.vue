<script setup>
	import { reactive, getCurrentInstance, ref, watch, onMounted, onUnmounted, computed, nextTick, inject } from "vue";
	import myModal from "@/components/dialog.vue";
	import { dialogConfig } from "./config";
	import * as api from '@/axios/api';
	import zixuan from '@assets/img/common/zixuan.png'
	import zixuan1 from '@assets/img/common/zixuan1.png'
	import {  setCache, getCache, getToken, removeCache } from "@/utils/cache";
	import { CacheStockDetail, CacheSeachData } from '@/constants/cacheKey'
	import { useRouter } from "vue-router";
	import { ClearOutlined, LoadingOutlined } from "@ant-design/icons-vue"
	import useDebounceThrottle from '@/utils/debounce';
	import { useAppStore } from "@/store/index";

	const store = useAppStore()
	const router = useRouter()
	const message = inject("message");
	const emit = defineEmits(["onCancel"]);
	const {
	  proxy: { $t: textI18n },
	} = getCurrentInstance();
	
	const handleCancelModal = (type) => {
	  // 处理取消事件
		hSearch()
	  console.log("模态框被关闭");
	  emit('onCancel', false)
	};
	const historyList = ref([])
	const initLoading = ref(true);
	const pageNum = ref(1)
	const pageSize = ref(6)
	const ishasNextPage = ref(true)
	
	const searchList = ref([])
	const keyWords = ref()
	
	const debounceTrigger = useDebounceThrottle(() => {
		if(keyWords.value) historyList.value.push(keyWords.value)
		setCache(CacheSeachData, historyList.value, false);	
	    onLoadMore()
	}, 2000, 'debounce');
	
	const hSearch = (key) => {
		pageNum.value= 1
		searchList.value = []
		keyWords.value = key
		onLoadMore()
	}
	const inputChange = async (e) => {
		// console.log(e, 'searchInput')
		initLoading.value = true;
		pageNum.value= 1
		searchList.value = []
		
		debounceTrigger()
	}
	
	const onLoadMore = async () => {
	  let params = {
	  	keyWords: keyWords.value,
	  	pageNum: pageNum.value,
	  	pageSize: pageSize.value,
	  };
	  let { data } = await api.getStock(params);
	  ishasNextPage.value = data.hasNextPage
	  initLoading.value = false;
	   if(tokenExists.value && getToken()){
	   	  data.list.forEach(item => {
	   	     //检测是否已经添加了自选
	   	    getOption(item.stockGid).then(status => {
	   	      item.isOptionOpt = status
	   	    })
	   	  })
	   }
	    searchList.value = [...searchList.value, ...data.list];
	};
	const getOption = async (code) => {
	  let params = { code };
	  let data = await api.isOption(params);
	  // 0 --> 未添加 1 已添加
	  return data.status;
	}
	// 点击添加/取消自选
	const zixuanClick = async (gid, type) => {
	  // console.log(gid, type)
	   if(!tokenExists.value || !getToken()){
		  message.warning(textI18n('login.a8'))
		  return
	   }
	  try {
	    let response;
	    if (type === 0) {
	        response = await addAPI(gid);
	    } else {
	        response = await cancelAPI(gid);
	    }
	    console.log(response)
	    if (response?.status === 0) {
	      message.success(response.msg);
	      // onLoadMore()
		  searchList.value.forEach((item) => {
			  if(item.stockGid === gid ){
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
	const checkScrollBottom = (event) => {
	  const { target } = event;
	  if ((target.clientHeight + target.scrollTop >= target.scrollHeight - 5) && ishasNextPage.value) {
		pageNum.value ++	
		onLoadMore()
	  }
	}
	const clearHistory = () => {
		hSearch()
		historyList.value = []
		removeCache(CacheSeachData, false)
	}
	
	const handleClick = (item) => {
		console.log(item, 'search  list')
		setCache(CacheStockDetail, item, true);
		store.$state.stockDetail = item
		router.push('/stockdetail');
		handleCancelModal()
	}
	const tokenExists = computed(() => {return store.$state.token})
	onMounted(() => {
		historyList.value = getCache(CacheSeachData, { isSessionStorage: false }, []);
		onLoadMore()
	}) 

	
</script>


<template>
	
	<myModal
	  class="big-modal"
	  :dialogConfig="dialogConfig"
	  @cancel="handleCancelModal"
	>
	
	<a-input :placeholder="$t('placeholder.a0')" size="large" allowClear v-model:value="keyWords" @input="inputChange">
	  <template #prefix>
	    <i class="icon icon-search"></i>
	  </template>
	</a-input>
	<div class="history-div" v-if="historyList.length">
		<div class="title"><p>{{$t('other.a4')}}</p>
		<a-tooltip @click="clearHistory">
		   <template #title> {{ $t('other.a5') }}</template>
			<ClearOutlined /> 
		</a-tooltip>
		</div>
		
		<div class="content">
			<span v-for="(item, index) in historyList" :key="index" @click="hSearch(item)">{{item}}</span>
		</div>
	</div>
	 <a-list
		 class="search-list"
		 :loading="initLoading"
		 item-layout="horizontal"
		 :data-source="searchList"
		 @scroll="checkScrollBottom"
	   >
		 <template #loadMore>
		   <div class="bottom-div" v-if="!initLoading">
			 <p><LoadingOutlined v-if="ishasNextPage" /> {{ishasNextPage ? $t('con.a23') : $t('con.a24')}}</p>
		   </div>
		 </template>
		 <template #renderItem="{ item }">
		   <a-list-item @click="handleClick(item)">
			   <a-list-item-meta :description="item.stockCode" >
				 <template #title>
				   <span class="name">{{ item.stockName }}</span>
				 </template>
			 
			   </a-list-item-meta>
			   <p class="price">
			     {{ item.last }}
			   </p>
			   <p
			     class="present"
			      :class="[item.chg_pct === 0 ? 'f-text-normal' : item.chg_pct > 0 ? 'f-text-up' : 'f-text-down']"
			   >
			     {{ item.chg }}
			   </p>
			   <p
			     class="present"
			      :class="[item.chg_pct === 0 ? 'f-text-normal' : item.chg_pct > 0 ? 'f-text-up' : 'f-text-down']"
			   >
			     {{ item.chg_pct }}%
			   </p>
			  <template #actions>
				  <a-tooltip>
				     <template #title> {{ item.isOptionOpt ? $t('other.a3') : $t('other.a2')   }}</template>
				    <img
				      class="zixuan-img" 
				      @click.stop="zixuanClick(item.stockGid, item.isOptionOpt)"
				      :src="item.isOptionOpt ? zixuan : zixuan1"
				      >
				   </a-tooltip>
			  
			   </template>
		
		   </a-list-item>
		 </template>
	   </a-list>
	</myModal>
	
</template>



<style lang="scss" scoped>
	.big-modal{
		::v-deep{
			.ant-modal{
				top: 66px;
				width: 80vw !important;
			}
			
			.ant-modal-body{
				margin-top: 30px;
				.ant-list{
					height: 500px;
					overflow-y: scroll;
				}
				.ant-list::-webkit-scrollbar {
				    display: none;
				}
				.history-div{
					padding: 10px 0;
					.title{
						font-weight: bold;
						font-size: 18px;
						color: #56565B;
						margin-bottom: 10px;
						display: flex;
						justify-content: space-between;
						.anticon-clear{
							cursor: pointer;
						}
					}
					.content{
						> span{
							cursor: pointer;
							font-size: 18px;
							background: #efefef;
							margin: 0 10px;
							padding: 0 8px;
							border-radius: 4px 4px 4px 4px;
						}
					}
				}
				.search-list{
					cursor: pointer;
					.ant-list-item{
						padding: 12px 0;
					}
					.bottom-div{
						padding: 20px 0;
						text-align: center;
					}
					.zixuan-img{
						width: 20px;
						height: 20px;
						cursor: pointer;
					}
					.name{
						font-weight: bold;
						font-size: 24px;
						color: #000000;
					}
					
					.ant-list-item-meta-title{
						width: 80%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.ant-list-item-meta-description{
						font-weight: 500;
						font-size: 16px;
						color: #707070;
					}
					.price{
						font-weight: bold;
						font-size: 24px;
						color: #000000;
						width: 14%;
						text-align: right;
					}
					.present{
						width: 14%;
						font-weight: bold;
						font-size: 24px;
						text-align: right;
					}
				}
			}
		}
		.icon-search {
		  width: 18px;
		  height: 18px;
		  background: url("@assets/img/common/search-icon.png") no-repeat center
		    center;
		  background-size: 100% 100%;
		}
		
	}
	
	
</style>