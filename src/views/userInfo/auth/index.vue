<script setup>
import { onMounted, ref, reactive, inject, getCurrentInstance } from 'vue'
import formIndex from '@/components/form/index.vue'
import imgUpload from '@/components/img-upload/index.vue'
import { queryForm, querySet, imgSet, paramsForm } from './config'
import * as api from '@/axios/api'
import { useAppStore } from '@/store/index'
const message = inject('message')
import auth1 from '@/assets/img/user/auth1.png'
import auth2 from '@/assets/img/user/auth2.png'
import leftMenu from '@/components/appCom/leftMenu.vue'
const store = useAppStore()
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const btnIconLoading = ref(false)
const img = reactive({
  img1Key: '',
  img2Key: '',
})

const formSaveFun = async (dataV) => {
  if (!dataV.realName || !dataV.idCard) {
    message.info(textI18n('other.a22'))
    return
  }
  btnIconLoading.value = true

  let params = {
    realName: dataV.realName,
    idCard: dataV.idCard,
    img2key: img['img2Key'],
    img1key: img['img1Key'],
    idCardEn: '',
    img3key: '',
  }
  console.log(params, 'params')
  try {
    let data = await api.userAuth(params)
    if (data?.status === 0) {
      setTimeout(() => {
        btnIconLoading.value = false
        message.success(data.msg)
        store.userInfo()
      }, 2000)
    }
  } catch (error) {
    btnIconLoading.value = false
    // message.error(error);
  }
}

const frontFun = async (dataV) => {
  img['img1Key'] = dataV
}
const backFun = async (dataV) => {
  img['img2Key'] = dataV
}

onMounted(() => {
  let userInfo = store.$state.userInfoData
  console.log(userInfo)
  if (userInfo?.realName) {
    //input 回显
    Object.keys(paramsForm).forEach((key) => {
      paramsForm[key] = userInfo[key]
      img['img1Key'] = userInfo.img1Key
      img['img2Key'] = userInfo.img2Key
    })
  }
})
</script>

<template>
  <div class="body-warp">
    <div class="left-warp">
      <left-menu></left-menu>
    </div>

    <div class="right-warp">
      <p class="right-warp-title">{{ $t('tips.a2') }}</p>
      <div>
        <formIndex
          :queryForm="queryForm"
          :querySet="querySet"
          :paramsForm="paramsForm"
          @formSave="formSaveFun"
          :btnIconLoading="btnIconLoading"
        >
          <template #imgUp>
            <div class="card-style">
              <div class="card-img">
                <imgUpload
                  class="img-style"
                  @imgAddr="frontFun"
                  :defaultImg="auth1"
                  :updateImg="img['img1Key']"
                  :styleWH="imgSet"
                >
                </imgUpload>
                <p>{{ $t('user.a1') }}</p>
              </div>
              <div class="card-img">
                <imgUpload
                  class="img-style"
                  @imgAddr="backFun"
                  :defaultImg="auth2"
                  :updateImg="img['img2Key']"
                  :styleWH="imgSet"
                >
                </imgUpload>
                <p>{{ $t('user.a2') }}</p>
              </div>
            </div>
          </template>
        </formIndex>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.img-style {
}

.body-warp {
  display: flex;
  .left-warp {
    width: 256px;
  }
  .right-warp {
    width: 1000px;
    margin-left: 12vw;
    background: #ffffff;
    padding: 80px 15vw;
    .right-warp-title {
      font-weight: 500;
      font-size: 24px;
      color: #000000;
      text-align: center;
      margin-bottom: 40px;
    }
    .card-style {
      display: flex;
      margin: 60px 0;
      text-align: center;
      .card-img {
        width: 100%;
        > p {
          font-size: 16px;
          color: #999999;
        }
      }
    }
  }
}
</style>
