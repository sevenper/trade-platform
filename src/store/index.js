import { defineStore } from "pinia";
import * as api from '@/axios/api';
import { setCache, getCache, removeAllCache } from "@/utils/cache";
import { CacheUserInfo, CacheInfoSite, CacheBankInfo, CachePriceInfo, CacheToken, CacheStockDetail } from "@/constants/cacheKey";
import router from "@/router";
import { Modal, message } from "ant-design-vue";
import { textI18n } from "@/utils/utils";


export const useAppStore = defineStore("useAppStore", {
  state: () => {
    return {
      infoSite: getCache(CacheInfoSite, { isSessionStorage: true }, {}),
      userInfoData: getCache(CacheUserInfo, { isSessionStorage: true }, {}),
      cardInfo: getCache(CacheBankInfo, { isSessionStorage: true }, {}),
      priceInfo: getCache(CachePriceInfo, { isSessionStorage: true }, {}),
	  token: getCache(CacheToken, { isSessionStorage: true }, {})["token"],
	  stockDetail: getCache(CacheStockDetail, { isSessionStorage: true }, {}),
      isMoneyHide: false,

    }
  },
	
	getters: {
		// 0 总资金 1 可用 2 占用 3 冻结 4 总盈亏（持仓+平仓）
		amtArr: state =>{
			return [
				{
					0: state.userInfoData.enableAmt + 
						state.userInfoData.allFreezAmt +
						state.priceInfo.djzj +
						state.userInfoData.allProfitAndLose || 0,
					1: state.userInfoData.enableAmt || 0,
				    2: state.userInfoData.allFreezAmt || 0,
				    3: state.priceInfo.djzj || 0,
				    4: state.userInfoData.allProfitAndLose || 0,
				},
				{
				  0:
					state.userInfoData.hkAmt +
					  state.userInfoData.hkFreezAmt +
					  state.userInfoData.hkDjzj +
					  state.userInfoData.hkFreezeFunds +
					  state.userInfoData.hkProfitAndLose || 0,
				  1: state.userInfoData.hkAmt || 0,
				  2: state.userInfoData.hkFreezAmt || 0,
				  3: state.userInfoData.hkDjzj + state.userInfoData.hkFreezeFunds || 0,
				  4: state.userInfoData.hkProfitAndLose || 0,
				},
			]
		}
	},

  actions: {
    updateState(data) {
      Object.keys(data).forEach((x) => {
        this.state[x] = data[x];
      });
    },


    async initApp() {  //初始化
      try {
        let { data } = await api.getInfoSite()
        this.infoSite = data
        setCache(CacheInfoSite, data, true);
      } catch (err) {
		  console.log(err)
        return err
      }
    },

    async userInfo() { //获取用户信息
      try {
        let { data } = await api.getUserInfo()
        this.userInfoData = data
        setCache(CacheUserInfo, data, true);

      } catch (err) {
        return err
      }
    },

    async getCardDetail() { //获取银行卡信息
      try {
        let { data } = await api.getBankCard()
		if(data) {
			this.cardInfo = data
			setCache(CacheBankInfo, data, true);
		}
      } catch (err) {
        return err
      }
    },

    async getPriceInfo() { //获取金额信息
      try {
        let { data } = await api.getprice()
        this.priceInfo = data
        setCache(CachePriceInfo, data, true);
      } catch (err) {
        return err
      }
    },

    async logOut() {
		let that = this
      Modal.confirm({
        title: textI18n('user.a14'),
        content: textI18n('user.a15'),
		okText: textI18n('con.a14'),
		cancelText: textI18n('con.a15'),
        async onOk() {
          try {
            let data = await api.logout()
            // 清除 sessionStorage 的所有值   localStorage不用清除
            if (data?.status === 0) removeAllCache(true)
			
			that.token = ''
			that.userInfoData = {}
			that.cardInfo = {}
			that.initApp()
			
            router.replace('/');
          } catch (err) {
			  console.log(err)
            return err
          }
        },

        onCancel() {
          message.warning(textI18n('con.a16'))
        },
      });
    },
	
	async logOutFun() {
		try {
		  let data = await api.logout()
		  // 清除 sessionStorage 的所有值   localStorage不用清除
		  if (data?.status === 0) removeAllCache(true)
			this.token = ''
			this.userInfoData = {}
			this.cardInfo = {}
			this.initApp()
		   router.replace('/');
		} catch (err) {
					  console.log(err)
		  return err
		}
	}

  }


});
