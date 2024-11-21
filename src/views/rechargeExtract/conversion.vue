<script setup>
    import { computed, onMounted, reactive, ref, watch, inject, getCurrentInstance } from "vue"
    import { useRouter } from "vue-router";
	import { useAppStore } from "@/store/index";
	
	import * as api from "@/axios/api";
	const message = inject("message");
	const store = useAppStore()
    const router = useRouter();
	const {
	  proxy: { $t: textI18n },
	} = getCurrentInstance();
	const iconLoading = ref(false)
	const infoSite = computed(() => {return store.$state.infoSite})
	const amtArr = computed(() => store.amtArr)
    const goBack = () => {
        router.go(-1)
    }
    const amt = ref('')
	const cunNum = ref(0) // 选中
	const cunEnterNum = ref(0)
	const currency = reactive(['TRY', 'USD'])
	const newCurrency = reactive({
			0: ['USD'],
			1: ['TRY']
		})
	const rateInfo = reactive([
		{ 0: infoSite.value.hkRate},
		{ 0: Math.floor((1 / infoSite.value.hkRate) * 100) / 100}
	]
	)
	const changeFun = (index) => {
		cunNum.value = index
	}
	const allAmount = () => {
		amt.value = amtArr.value[cunNum.value][1]
		console.log(amt.value)
	}
	const toConfirm = async () => {
		if (!amt.value) {
		    message.warning(textI18n('tips.a1'));
		    return;
		}
		if (!amtArr.value[cunNum.value][1]) {
		    message.warning(textI18n('other.a23'));
		    return;
		}
		if (amt.value > amtArr.value[cunNum.value][1]) {
		    message.warning(textI18n('other.a24'));
		    return;
		}
		let params = {
		    amt: amt.value,
			toId: !cunNum.value ? '5' : '63',
			fromId: cunNum.value ? '5' : '63'
		}
		
		iconLoading.value = true;
		try {
			  let data = await api.AmtChange(params);
			  if(data?.status === 0){
				  setTimeout(async () => {
					iconLoading.value = false;
					 message.success(textI18n('tips.a4'));
					 amt.value = ''
					 store.userInfo();
					 store.getPriceInfo();
				  }, 3000);
			  }
		} catch (error) {
			iconLoading.value = false
		}
	}
	const rateCalculate = computed(() => {
		 return rateInfo[cunNum.value][cunEnterNum.value]
	})
	const getAmt = computed(() => {
		return parseFloat((rateInfo[cunNum.value][cunEnterNum.value] * amt.value).toFixed(2)) 
	})

</script>

<template>
    <div class="back">
        <div>
            <span  @click="goBack">{{ $t('con.a1') }}</span>
        </div>
    </div>
    <div class="content">
        <div class="wrapper">
            <div class="cont-l">
                <p class="title"> {{ $t('money.a19') }}<span>{{ $t('money.a20') }}</span> </p>
                <p>{{ $t('money.a21') }}</p>
                <img src="@assets/img/common/conv.png" alt="">
            </div>
            <div class="cont-r">
                <p class="r-title" >{{ $t('money.a20')  }}</p>
                <div class="conv-wrap">
                    <div class="conv-box" >
                        <p class="c-tip">
                            <span>{{ $t('money.a32') }}</span>
                            <span>{{  $t('money.a23') }}{{amtArr[cunNum][1]}}</span>
                        </p>
                        <div class="insert">
                            <a-input size="large" v-model:value="amt" :placeholder="$t('tips.a1')"></a-input>
                            <div class="right" >
                                <a-button size="small" type="text" @click="allAmount">{{ $t('money.a24') }}</a-button>
									
								<a-popover placement="bottom" trigger="click" >
								   <template #content>
									   <div class="current-pop"> 
											<p v-for="(item, index) in currency" @click="changeFun(index)">{{item}}</p>
									   </div>
								   </template>
								   
								   <span>
				
								   <img :src="$imgUrl(`/assets/img/common/${currency[cunNum]}.png`)">
								   {{ currency[cunNum]}}</span>
								 </a-popover>
								
                            </div>
                        </div>
                    </div>
                    <div class="conv-box" >
                        <p class="c-tip">
                            <span>{{ $t('money.a33') }}</span>
                        </p>
                        <div class="insert">
                            <span class="get-text">
								<i>{{ $t('money.a34') }}</i>
								<em>{{ getAmt }}</em> <!-- 预计获得 -->
							</span>
                            <div class="right" >
                                <a-popover placement="bottom" trigger="click" >
                                   <template #content>
                                	   <div class="current-pop"> 
                                			<p v-for="(item, index) in newCurrency[cunNum]">{{item}}</p>
                                	   </div>
                                   </template>
                                   
                                   <span>
									   <img :src="$imgUrl(`/assets/img/common/${newCurrency[cunNum][cunEnterNum]}.png`)">
                        
                                    {{ newCurrency[cunNum][cunEnterNum] }}
									</span>
                                 </a-popover>
                            </div>
                        </div>
                    </div>
                    <img class="img" src="@assets/img/common/jt.png" alt="">
                </div>
                <!-- <div class="conv-tip"> -->
                   <!-- <div><span>{{ $t('money.a9') }}</span><span>100000</span></div>
                    <div><span>{{ $t('money.a10') }}</span><span>1.10%</span></div>
                    <div><span>{{ $t('money.a11') }}</span><span>1-5h</span></div>
                    <div><span>{{ $t('money.a12') }}</span><span>工作日10:00 到 15 :00 之间</span></div> -->
                <!-- </div> -->
                <p class="flex-bet">
                    <span>{{  $t('money.a25') }}</span>
                    <span>1{{ currency[cunNum]}} ≈ {{ rateCalculate }} {{ newCurrency[cunNum][cunEnterNum] }}</span>
                </p>
                <a-button class="sum-btn" size="large" type="primary" block :loading="iconLoading" @click="toConfirm">{{  $t('money.a26') }}</a-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
	
.back {
    width: 100%;
    height: 63px;
    background: rgba(56,142,255, .1);
    display: flex;
    justify-content: center;
    align-items: center;
    &>div {
        width: 1004px;
        height: 100%;
        position: relative;
        padding-left: 18px;
        display: flex;
        align-items: center;
        &::before {
            content: "";
            position: absolute;
            width: 12px;
            height: 24px;
            background: url('@assets/img/common/back.png') 100% 100% no-repeat;
            transform: scale(.5);
            left: 0;
            margin-top: 2px;
        }
        > span{
            cursor: pointer;
        }
    }
}
.content {
    display: flex;
    justify-content: center;
    .wrapper {
        max-width: 1004px;
        min-width: 960px;
		padding: 0 20px;
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
    }
    .cont-l {
        max-width: 348px;
        text-align: center;
        padding-top: 72px;
        .title {
            font-size: 48px;
            font-weight: bold;
            & + p {
                color: #919395;
                font-size: 24px;
            }
            span {
                font-weight: bold;
                color: #0066FF;
            }
        }
        img {
            width: 100%;
            margin-top: 53px;
        }
    }
    .cont-r {
        max-width: 540px;
        height: 580px;
        background: #FFFFFF;
        border-radius: 20px 20px 20px 20px;
        border: 1px solid #DDDDDD;
        margin-top: 38px;
        padding: 34px 41px;
        box-sizing: border-box;
        .sum-btn {
            // height: 68px;
            border-radius: 32px;
			margin-top: 10px;
			font-size: 16px;
			height: auto;
        }
        .r-title {
            font-size: 26px;
            font-weight: bold;
            line-height: 37px;
            margin-bottom: 8px;
        }
        .conv-wrap {
            position: relative;
            .img {
                width: 50px;
                height: 50px;
                position: absolute;
                top: 63px;
                left: 204px;
            }
        }
        .conv-box {
            width: 100%;
            // height: 82px;
            background: #FFFFFF;
            border-radius: 10px;
            border: 1px solid #DDDDDD;
            margin-bottom: 14px;
            .c-tip {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                line-height: 17px;
                padding: 15px 12px 2px;
                margin: 0;
                span:first-child {
                    font-weight: 500;
                    font-size: 14px;
                    color: #000000;
                }
                span:nth-child(2) {
                    color: #919395;
                    font-size: 12px;
                }
            }
        }
    }
    .insert {
        display: flex;
        align-items: center;
        .ant-input {
            border: 0;
            font-size: 20px;
            &:focus {
                outline: none;
                box-shadow: none;
            }
        }
        .get-text {
            display: inline-block;
            width: 100%;
            padding-left: 12px;
            font-weight: bold;
            margin-top: 5px;
			> i{
				font-size: 14px;
				font-style: normal;
				color: #999;
			}
			> em {
				font-size: 20px;
				font-style: normal;
				margin-left: 20px;
			}
        }
        .right {
            // width: 147px;
			display: flex;
			align-items: center;
			padding: 0 10px;
            .ant-btn {
                background-color: #F5F5F5;
                font-size: 14px;
                border-radius: 12px;
				height: auto;
            }
            span {
				display: flex;
                // display: inline-block;
                // position: relative;
                padding-left: 15px;
                font-size: 16px;
				cursor: pointer;
				> img{
					width: 20px;
					margin-right: 8px;
				}
                // &::before {
                //     content: "";
                //     position: absolute;
                //     width: 20px;
                //     height: 20px;
                //     border-radius: 10px;
                //     background-color: #919395;
                //     left: 10px;
                // }
            }
			
        }
    }
    .conv-tip {
        width: 458px;
        height: 110px;
        background: #F5F8FD;
        border-radius: 10px 10px 10px 10px;
        font-size: 12px;
        padding: 12px;
        box-sizing: border-box;
        &>div{
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 6px;
        }
    }
    .flex-bet {
        width: 100%;
        padding: 45px 13px 9px;
        box-sizing: border-box;
        span {
            font-size: 14px;
        }
    }
}
.current-pop{
	padding: 10px 20px;
	> p{
		height: 40px;
		line-height: 40px;
		cursor: pointer;
	}
}
</style>