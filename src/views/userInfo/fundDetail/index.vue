<script setup>
import leftMenu from "@/components/appCom/leftMenu.vue";
import { recordTypeToText, tablePage } from './config'
import { onMounted, onUnmounted, ref, inject } from "vue";
import { FileDoneOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { formatTime } from '@/utils/utils'
import * as api from '@/axios/api';
const message = inject("message");

const dataLists = ref([])

const init = async () => {
	 tablePage.isLoading = true;
	let params = {
	    pageNum: tablePage.pageNum,
	    pageSize: tablePage.pageSize
	};
	let { data } = await api.cashDetail(params);
	
	let dataList;
	dataList = [...dataLists.value, ...data.list];

	dataLists.value = dataList.map((item, key) => {
	  return {
	    ...item,
		recordJ: JSON.parse(item.record)
	  };
	});
	
	tablePage.total = data.total;
	tablePage.isLoading = dataLists.value.length === tablePage.total ? true : false
}
// 监听滚动事件 当用户滚动到距离底部5px时，会自动加载更多数据
const handleScroll = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (
    clientHeight + scrollTop >= scrollHeight - 5 &&
    !tablePage.isLoading &&
    dataLists.value.length < tablePage.total
  ) {
    tablePage.pageNum++;
    init();
  }
};
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  init();
});
// 卸载时移除滚动事件
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});


</script>

<template>
   <div class="body-warp">
    <div class="left-warp">
     <left-menu></left-menu>
    </div>

    <div class="right-warp">
        <p>{{$t('con.a34')}}</p>
		<div v-for="(item, index) in dataLists"  :key="index" class="list-item">
			<div class="list-item-title">
				<FileDoneOutlined :style="{ color: '#0066FF'}"/> <p>{{ recordTypeToText[item.recordType] }}</p>
			</div>
			
			
			<div class="list" v-if="item.recordType === 1">
			    <div class="item">
			        <i>{{ $t('fundDetail.a13') }}:</i>
			        <em>{{ item.recordJ.indexName }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a14') }}:</i>
			        <em>{{ item.recordJ.indexCode }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a7') }}:</i>
			        <em>{{ item.recordJ.totalProfitAndLoss }}</em>
			    </div>
			</div>
			
			<div class="list" v-if="item.recordType === 2 || item.recordType === 3">
			    <div class="item">
			        <i>{{ $t('fundDetail.a15') }}:</i>
			        <em>{{ item.recordJ.fundingByDay }}</em>
			    </div>
			    <div class="item">
			       <i>{{ $t('fundDetail.a16') }}:</i>
			        <em>{{ item.recordJ.frozenAmount }}</em>
			    </div>
			</div>
			<div class="list" v-if="item.recordType === 4">
			    <div class="item">
			        <i>{{ $t('fundDetail.a15') }}:</i>
			        <em>{{ item.recordJ.fundingByDay }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a16') }}:</i>
			        <em>{{ item.recordJ.frozenAmount }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a17') }}:</i>
			        <em>{{ item.recordJ.reason }}</em>
			    </div>
			</div>
			<div class="list" v-if="item.recordType === 5">
			    <div class="item">
			        <i>{{ $t('fundDetail.a18') }}:</i>
			        <em>{{ item.recordJ.stockName }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a19') }}:</i>
			        <em>{{ item.recordJ.stockCode }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a20') }}:</i>
			        <em>{{ item.recordJ.occupyThePrincipal }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a21') }}:</i>
			        <em>{{item.recordJ.totalHandlingFee}}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a22') }}:</i>
			        <em>{{ item.recordJ.storageFee }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a28') }}:</i>
			        <em>{{ item.recordJ.stampDuty }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a23') }}:</i>
			        <em>{{ item.recordJ.spreadFee }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a24') }}:</i>
			        <em>{{ item.recordJ.profitAndLoss }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a7') }}:</i>
			        <em>{{ item.recordJ.totalProfitAndLoss }}</em>
			    </div>
			</div>
			<div class="list" v-if="item.recordType === 6">
			    <div class="item">
			        <i>{{ $t('fundDetail.a25') }}:</i>
			        <em>{{ item.recordJ.futuresName }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a26') }}:</i>
			        <em>{{ item.recordJ.futuresCode }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a7') }}:</i>
			        <em>{{ item.recordJ.totalProfitAndLoss }}</em>
			    </div>
			</div>
			<div class="list" v-if="item.recordType === 7">
			    <div class="item">
			        <i>{{ $t('fundDetail.a8') }}:</i>
			        <em>{{ item.recordJ.stockName }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a19') }}:</i>
			        <em>{{ item.recordJ.stockCode }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a26') }}:</i>
			        <em>{{ item.recordJ.occupyThePrincipal }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a21') }}:</i>
			        <em>{{ item.recordJ.totalHandlingFee }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a27') }}:</i>
			        <em>{{ item.recordJ.deferredFee }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a28') }}:</i>
			        <em>{{ item.recordJ.stampDuty }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a24') }}:</i>
			        <em>{{ item.recordJ.profitAndLoss }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a7') }}:</i>
			        <em>{{ item.recordJ.totalProfitAndLoss }}</em>
			    </div>
			</div>
			<div class="list" v-if="item.recordType === 8">
			    <div class="item">
			        <i>{{ $t('fundDetail.a8') }}:</i>
			        <em>{{ item.recordJ.stockName }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a19') }}:</i>
			        <em>{{ item.recordJ.stockCode }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a29') }}:</i>
			        <em>{{ item.recordJ.additionalAmount }}</em>
			    </div>
			</div>
			<div class="list" v-if="item.recordType === 9">
			    <div class="item">
			        <i>{{ $t('fundDetail.a30') }}:</i>
			        <em>{{ item.recordJ.amountBefore }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a31') }}:</i>
			        <em>{{ item.recordJ.amountAfter }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a32') }}:</i>
			        <em>{{ item.recordJ.availableBefore }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a33') }}:</i>
			        <em>{{ item.recordJ.availableAfter }}</em>
			    </div>
			</div>
			<div class="list" v-if="item.recordType === 21 || item.recordType === 22 || item.recordType === 23">
			    <div class="item">
			        <i>{{ $t('fundDetail.a18') }}:</i>
			        <em>{{ item.recordJ.stockName }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a19') }}:</i>
			        <em>{{ item.recordJ.stockCode }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a20') }}:</i>
			        <em>{{ item.recordJ.occupyThePrincipal }}</em>
			    </div>
			</div>
			
			<div class="list" v-if="item.recordType === 69">
			    <div class="item">
			        <i>{{ $t('fundDetail.a34') }}:</i>
			        <em>{{ item.recordJ.amtFrom }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a35') }}:</i>
			        <em>{{ item.recordJ.transAmt }}</em>
			    </div>
			    <div class="item">
			        <i>{{ $t('fundDetail.a36') }}:</i>
			        <em>{{ item.recordJ.amtTo }}</em>
			    </div>
			</div>
			<div class="time">
			    <b v-if="item.addTime">{{ $t('fundDetail.a37') }}: {{formatTime(item.addTime)}}</b>
			</div>

		</div>
		<div class="table-page" >
			  <!-- 上滑加载 -->
		 <p v-if="!tablePage.isLoading && dataLists.length" class="f-color">
				<LoadingOutlined />{{ $t('con.a23') }}</p>
				<!-- 加载完成 -->
		  <p v-if="tablePage.isLoading " class="f-color">{{ $t('con.a24') }}</p>
		
		</div>
    </div>
	
  </div>
</template>

<style lang="scss" scoped>

.body-warp {
  display: flex;
	.left-warp{
		width: 256px;
	}
  .right-warp {
    width: 1000px;
    margin-left: 12vw;
    background: #ffffff;
    padding: 20px 10vw;
    > p{
      font-weight: 500;
      font-size: 24px;
      color: #000000;
      // text-align: center;
      margin-bottom: 40px;
    }
	
	.list-item{
		margin-top: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid #E5E5E5;
		.list-item-title{
			display: flex;
			margin-bottom: 10px;
			> span{
				font-size: 18px;
			}
			> p{
				margin-left: 5px;
				font-weight: 500;
				font-size: 18px;
				color: #000000;
				// margin-bottom: 10px;
			}
		}
		.list{
			.item{
				padding: 10px 0;
				display: flex;
				justify-content: space-between;
				
				> i{
					font-weight: 500;
					font-size: 16px;
					color: #999999;
					font-style: normal;
				}
				>em {
					
					font-weight: bold;
					font-size: 16px;
					color: #000000;
					font-style: normal;
				}
			}
		}
		.time{
			padding: 10px 0;
		}
	}
    .table-page{
      text-align: center;
      padding: 20px 0;
      .f-color{
        color: #999999;
      }
    }
    
  }
}

</style>