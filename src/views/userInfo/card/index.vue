<script setup>
import { ref, reactive, inject, onMounted, getCurrentInstance, computed } from "vue";
import * as api from "@/axios/api";
import formIndex from '@/components/form/index.vue'
import { queryForm, querySet, dialogConfig, paramsForm } from "./config";
import { useRouter } from "vue-router";
import { useAppStore } from '@/store/index'
import { replaceString } from '@/utils/utils'
import myModal from "@components/dialog.vue";
const store = useAppStore()
const message = inject("message");
const router = useRouter();

const cardRef = ref()
const openDialog = ref(false);

const btnIconLoading = ref(false)
const {
  proxy: { $t: textI18n },
} = getCurrentInstance();

  
const handleClick = (type) => {
  const { title, btnName } =
    type === "edit"
      ? {
          title: textI18n("card.a2"),
		  btnName: textI18n("card.a2")
        }
      : {
          title: textI18n("card.a1"),
		  btnName: textI18n("card.a1")
        };
		console.log(cardRef.value, 'cardRef.value')
		if (type==="edit") {
		  //input 回显
		  Object.keys(paramsForm).forEach((key) => {
				 paramsForm[key] = cardInfo.value[key];
		  });
		}
  dialogConfig.title = title;
  querySet.btnName = btnName;
  handleCancelModal(true)
};

const handleCancelModal = (type) => {
  // 处理取消事件
  console.log("模态框被关闭");
  openDialog.value = type;
};

const formSaveFun = async (dataV) => {
	if(!dataV.bankNo || !dataV.bankName || !dataV.userName){
		message.info(textI18n("other.a19")); 
		return
	}
	btnIconLoading.value = true
	
    let params = {
        bankName: dataV.bankName,
        bankNo: dataV.bankNo,
        userName: dataV.userName,
        bankAddress: 1
        // bankCode: JTYH
        // transferId: 
    };
	console.log(cardInfo.value)
    const isAddType = cardInfo.value?.bankNo
	
	try {
		let data = await (isAddType ? api.updateBankCard(params) : api.addBankCard(params));
		if (data?.status === 0) {
			setTimeout(() => {
				btnIconLoading.value = false
				message.success(data.data);
				store.getCardDetail()
				handleCancelModal()
			 }, 2000);
		}
	} catch (error) {
		btnIconLoading.value = false
	    // message.error(error);
	}
}
const cardInfo = computed(() => {
	 console.log(store.$state.cardInfo, 'store.$state.cardInfo')
	 
	 return store.$state.cardInfo})
 const cardNo = computed(() => {return replaceString(store.$state.cardInfo.bankNo, 3, 6) || ''})
 

  
onMounted(() => {
	store.getCardDetail()
  
});


</script>

<template>
	
	<div class="body-warp">
	  <div class="left-warp">
	   <left-menu ></left-menu>
	  </div>
	
	  <div class="right-warp">
		   <p>{{$t('card.a3')}}</p>
		<div v-if="cardInfo?.bankNo">
			<div class="card-list" >
				<p>{{cardNo}}</p>
				<div class="card-bottom">
					<img src="@assets/img/user/visa.png">
					<span>{{cardInfo.bankName}}</span>
					<span>{{cardInfo.bankCode}}</span>
				</div>
			</div>
			<div class="bottom-div" >
				 <a-button class="bottom-btn" type="primary" size="large" @click="handleClick('edit')">
					{{ $t('card.a2') }}
				 </a-button>
			</div>
		</div>
		
		<div class="addcard-div" v-else @click="handleClick('add')">
			<div class="addcard-div-item">
				<img src="@assets/img/user/add-card.png">
				<p class="title">{{$t('card.a1')}}</p>
				<p class="tips">{{$t('card.a4')}}</p>
			</div>
			
		</div>
		
	   </div>
	   <myModal
	     class="big-modal"
	     :open="openDialog"
	     :dialogConfig="dialogConfig"
	     @cancel="handleCancelModal"
	   >
	   <formIndex
			ref="cardRef"
			:btnIconLoading="btnIconLoading"
	       :queryForm="queryForm"
	       :querySet="querySet"
		   :paramsForm="paramsForm"
	       @formSave="formSaveFun"
	   >
	   </formIndex>
	   </myModal>
	
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
		  padding: 80px 12vw 100px 12vw;
		  > p{
		    font-weight: 500;
		    font-size: 24px;
		    color: #000000;
		    // text-align: center;
		    margin-bottom: 40px;
		  }
		  .addcard-div{
			  min-width: 600px;
			  background: #F9FAFC;
			  border-radius: 20px 20px 20px 20px;
			  border: 3px solid #EFEFEF;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  cursor: pointer;
			  .addcard-div-item{
				  text-align: center;
				  padding-bottom: 30px;
				  > img{
					  width: 150px;
				  }
				  .title{
					  font-weight: bold;
					  font-size: 30px;
					  color: #48538A;
				  }
				  .tips{
					  font-weight: 500;
					  font-size: 24px;
					  color: #9D9E9F;
					  margin-top: 20px;
				  }
			  }
			 
		  }
		  .card-list{
			  width: 100%;
			  max-height: 260px;
			  padding: 20px;
			  background: url("@assets/img/user/card-bg.png");
			  background-size: 100% 100%;
			  > p{
				  font-weight: bold;
				  font-size: 48px;
				  color: #FFFFFF;
			  }
			  .card-bottom{
				  display: flex;
				  align-items: center;
				  margin-top:80px;
				  > img{
					  width: 70px;
				  }
				  > span{
					  display: inline-block;
					  margin-left: 10px;
					  font-weight: 500;
					  font-size: 26px;
					  color: #F6F5FD;
				  }
			  }
		  }
		  .bottom-div{
			  margin-top: 70px;
			  .bottom-btn{
				 width: 100%;
				 font-size: 24px;
				 height: auto;
			  }
			
		  }
	  }
  }
</style>
