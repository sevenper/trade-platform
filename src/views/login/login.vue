<script setup>
import { ref, reactive, inject, getCurrentInstance, onMounted } from "vue";
import formIndex from '@/components/form/index.vue'

import { queryForm, querySet, paramsForm } from "./config";
import * as api from '@/axios/api';
import { setCache, getCache, removeCache } from "@/utils/cache";
import { CacheToken, CachePhone, CacheUserPwd } from "@/constants/cacheKey";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from '../../store/index'
const route = useRoute();
const {
  proxy: { $t: textI18n },
} = getCurrentInstance();

const urlParams = route.query  //获取url参数type  login 1 register 2
const formChild = ref(null)
const message = inject("message");
const router = useRouter();
const store = useAppStore()
const config = reactive({
    login: 1, // 1登录，2注册
    checked: true, //记住密码
})
const queryDataForm = ref([])
const btnIconLoading = ref(false)

if(urlParams?.type) config.login = Number(urlParams?.type)

const validateFormData = (dataV) => {
    if (!dataV.phone) {
        message.error(textI18n('placeholder.a2'));
        return false;
    }
    if (!dataV.userPwd) {
        message.error(textI18n('placeholder.a4'));
        return false;
    }
    if (!dataV.invitecode && config.login === 2) {
        message.error(textI18n('placeholder.a8'));
        return false;
    }
    return true;
};

const formSaveFun = async (dataV) => {
    // 参数验证
    if (!validateFormData(dataV)) {
        return;
    }
	btnIconLoading.value = true
	loginFun(dataV)
}
const loginFun = async (dataV) => {
	try {
	    let response;
	    if (config.login === 1) {
	        response = await loginAPI(dataV);
	    } else {
	        response = await registerAPI(dataV);
	    }
	    if (response?.status === 0) {
	        if (config.login === 1) {
	            if(config.checked){
	                setCache(CachePhone, dataV.phone, false)
	                setCache(CacheUserPwd, dataV.userPwd, false)
	            }else{
	                removeCache(CachePhone, false)
	                removeCache(CacheUserPwd, false)
	            }
	            // store.userInfo();
	            // store.getCardDetail();
	            // store.getPriceInfo();
				setTimeout(() => {
					btnIconLoading.value = false
					 message.success(response.msg);
					 router.replace('/');
				 }, 2000);
	        } else {
				btnIconLoading.value = false
	            router.replace('/login');
	        }
	    }
	} catch (error) {
		btnIconLoading.value = false
	    // message.error(error);
	}
}
const loginAPI = async ({ phone, userPwd }) => {
    let params = { phone, userPwd };
    let data = await api.login(params);
    if (data?.status === 0) {
		store.$state.token = data.data
        setCache(CacheToken, data.data, true);
    }
    return data;
};

const registerAPI = async ({ phone, userPwd, invitecode }) => {
    let params = { phone, userPwd, agentCode: invitecode };
    let data = await api.register(params);
    return data;
};

const resetFields = () => {
	Object.keys(paramsForm).forEach((key) => {
	   paramsForm[key] = ''
	});
};

const goLogin = () => {
    config.login = config.login === 1 ? 2 : 1
	initForm()
    
};

const init = () => {
    // // 如果缓存有账号密码，则默认
    const cacheMap = {
        phone: {
            cacheKey: CachePhone,
            defaultValue: ''
        },
        userPwd: {
            cacheKey: CacheUserPwd,
            defaultValue: ''
        }
    };
    Object.keys(paramsForm).forEach((key) => {
        const cacheInfo = cacheMap[key];
        if (cacheInfo) {
            paramsForm[key] = getCache(cacheInfo.cacheKey, { isSessionStorage: false }, cacheInfo.defaultValue);
        }
    });
}
const initForm = () => {
	querySet.btnName = config.login === 1 ? textI18n('login.a5') :  textI18n('login.a6')
	queryDataForm.value = config.login === 1 ? queryForm.slice(0, queryForm.length - 1) : queryForm
	config.login === 1 ? delete paramsForm['invitecode'] : paramsForm
	if(config.login === 1) init()
	if(config.login === 2) resetFields()
}

onMounted (() => {
	initForm()
})

</script>

<template>
    <div >
      <div class="login-wrap">
            <div class="login-content">
				<Transition  name="slide-fade" appear>
                <div class="login-left" v-if="config.login == 2">
                    <img class="img" src="@/assets/img/login/login_l.png" />
                </div>
				</Transition>
                <div class="login-right">
                    <h3 class="title">{{config.login == 1 ? $t('login.a1') : $t('login.a0') }}</h3>
                    <div class="type-warp">
                        <div clas="type-left">
                            <!-- <a-button type="text" class="btn" size="small" @click="changeLogtype(item.value)" v-for="item in acount" :key="item.value" :class="config.actType == item.value ? 'active': ''" >{{item.name}}</a-button> -->
                        </div>
                        <div clas="type-right">
                            <span style="font-size: 14px">{{ $t('login.a2')}}</span>
                            <a-button @click="goLogin" type="link" size="small">{{config.login == 1 ? $t('login.a6') : $t('login.a5') }}</a-button>
                        </div>
                    </div>

                    <formIndex 
                        ref="formChild"
						:btnIconLoading="btnIconLoading"
                        :queryForm="queryDataForm" 
                        :querySet="querySet"
						:paramsForm="paramsForm"
                        @formSave="formSaveFun">
                        <template #confirmLogin v-if="config.login == 1">
                            <a-row>
                                <a-col :span="24" class="forget">
                                    <a-checkbox v-model:checked="config.checked">{{$t('login.a3')}}</a-checkbox>
                                    <a-button type="text">{{$t('login.a4')}}</a-button>
                                </a-col>
                            </a-row>
                        </template>
                    </formIndex>
                   <a-row>
                        <a-col :span="24" class="type-btn">
                            <a-button type="text"> Google </a-button>
                            <a-button type="text"> </a-button>
                            <a-button type="text"> </a-button>
                        </a-col>
                    </a-row>
                </div>
                <div class="login-left code" v-if="config.login == 1">
					<Transition  name="slide-fade" appear>
                    <img class="img" src="@/assets/img/login/app_code.png" />
					</Transition>
					<Transition  name="slide-fade" appear>
                    <span>
                        {{$t('other.a13')}}<a-button size="small" type="link">{{$t('other.a14')}}</a-button>{{$t('other.a15')}}
                    </span>
					</Transition>
                </div>
            </div>
        </div>
    </div>    
</template>

<style lang="scss" scoped>
	.slide-fade-enter-active {
	  // transition: all 0.3s ease-out;
	   transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
	}
	.slide-fade-enter-from {
	  transform: translateX(20px);
	  opacity: 0;
	}
	
    .login-wrap {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F9F9F9;
        .login-content {
            display: flex;
            justify-content: space-between;
            background: #FFFFFF;
            width: 904px;
			align-items: center;
            // height: 605px;
            box-shadow: 0px 1px 30px 1px rgba(0,0,0,0.05);
            border-radius: 30px;
            padding: 53px 66px 43px 57px;
            box-sizing: border-box;
            .login-left {
                display: flex;
                height: 100%;
                align-items: center;
                .img {
                    width: 370px;
                    height: 370px
                }
                &.code {
                    flex-direction: column;
                    justify-content: center;
                    width: 370px;
                    img {
                        width: 168px;
                        height: 168px;
                    }
                    span {
                        display: inline-block;
                        font-size: 16px;
                        color: #56565B;
                        margin-top: 20px;
                    }
                    .ant-btn {
                        padding: 0;
						font-size: 18px;
                    }
                }
            }
            .login-right {
                // max-width: 360px;
                h3 {
                    text-align: center;
                    font-weight: 550;
                    font-size: 36px;
                    color: #292C33;
                    margin-bottom: 21px;
                }
            }
        }
        .type-warp {
            display: flex;
            justify-content: space-between;
            padding-top: 24px;
            padding-bottom: 17px;
            .btn {
                line-height: 1;
                padding: 0 14px;
                border-radius: 20px;
                &+.btn {
                    margin-left: 10px;
                }
            }
            .active {
                background-color: #292C33;
                color: #FFFFFF;
            }
        }
        .my-custom-icon {
            display: inline-block;
            width: 21px;
            height: 20px;
            background: url(../../assets/img/login/close_eye.png) 100% 100% no-repeat;
        }
        .ant-form-item {
            margin-bottom: 16px
        }
        .forget {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: -4px;
            margin-bottom: 20px;
            
            .ant-checkbox-wrapper  {
                color: #56565B;
            }
            .ant-btn {
                padding: 0;
                color: #919395;
                &:hover {
                    background-color: unset;
                }
            }
        }
        .type-btn {
            display: flex;
            justify-content: space-between;
            margin-top: 29px;
            .ant-btn {
                height: 50px;
                background-color: #F2F3F5;
                background-repeat: no-repeat;
                    background-size: 22px 22px;
                &:first-child {
					font-size: 16px;
                    width: 151px;
                    background-image: url('@assets/img/login/chorm.png');
                    background-position: 20px center;
                }
                &:nth-child(2) {
                    width: 84px;
                    margin-left: 31px;
                    background-image: url('@assets/img/login/apple.png');
                    background-position: 31px center;
                }
                &:nth-child(3) {
                    width: 84px;
                    margin-left: 31px;
                    background-image: url('@assets/img/login/new.png');
                    background-position: 31px center;
                }
            }
        }
    }
</style>
