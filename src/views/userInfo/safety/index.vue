<script setup>
import { ref, reactive, onMounted, computed, inject, getCurrentInstance } from 'vue'
import leftMenu from '@/components/appCom/leftMenu.vue'
import imgUpload from '@/components/img-upload/index.vue'
import myModal from '@components/dialog.vue'
import formIndex from '@/components/form/index.vue'
import {
  dialogConfig,
  querySet,
  queryFormFund,
  queryFormPass,
  imgSet,
  paramsFormPass,
  paramsFormFund,
} from './config'
import * as api from '@/axios/api'
import { useAppStore } from '@/store/index'
const store = useAppStore()
const message = inject('message')
import router from '@/router'
const openDialog = ref(false)
const openType = ref('') //  login登录密码，  zijin资金密码
const {
  proxy: { $t: textI18n },
} = getCurrentInstance()
const img = ref()
import auth1 from '@/assets/img/common/ai.png'
const queryForm = ref()
const paramsForm = ref()

const btnIconLoading = ref(false)
const formSaveFun = async (dataV) => {
  // 判断密码格式，判断两个密码是否相同  newPwdConfirm
  // 参数验证
  if (!validateFormData(dataV)) {
    return
  }
  btnIconLoading.value = true
  try {
    let response
    if (openType.value === 'login') {
      response = await updatePassAPI(dataV)
    } else {
      response = await updateFundAPI(dataV)
    }
    if (response?.status === 0) {
      setTimeout(() => {
        btnIconLoading.value = false
        message.success(data.data)
        handleCancelModal()
      }, 2000)
    }
  } catch (error) {
    btnIconLoading.value = false
    // message.error(error);
  }
}

const updatePassAPI = async ({ oldPwd, newPwd }) => {
  let params = { oldPwd, newPwd }
  let data = await api.changePassword(params)
  if (data?.status === 0) {
    message.success(data.msg)
    setTimeout(() => {
      store.logOutFun()
      handleCancelModal()
    }, 1000)
  }
}
const updateFundAPI = async ({ tixian_password, new_tixian_password }) => {
  let params = { tixian_password, new_tixian_password }
  let data = await api.tixian(params)

  if (data?.status === 0) {
    message.success(data.msg)
    handleCancelModal()
  }
}

const handleClick = (type) => {
  openType.value = type
  const { title, value, formV } =
    type === 'login'
      ? {
          title: textI18n('user.a12'),
          value: queryFormPass.value,
          formV: queryFormPass.value,
        }
      : {
          title: textI18n('user.a13'),
          value: queryFormFund.value,
          formV: paramsFormFund.value,
        }

  dialogConfig.title = title
  queryForm.value = value
  paramsForm.value = formV
  openDialog.value = true
}
const handleCancelModal = (type) => {
  // 处理取消事件
  console.log('模态框被关闭')
  openDialog.value = false
}

const validateField = (field, placeholderKey) => {
  if (!field) {
    message.error(textI18n(placeholderKey))
    return false
  }
  return true
}

const validatePasswordsMatch = (password, confirmPassword, placeholderKey) => {
  if (password !== confirmPassword) {
    message.error(textI18n(placeholderKey))
    return false
  }
  return true
}

const validateFormData = (dataV) => {
  let isValid = true

  if (openType.value === 'login') {
    isValid =
      validateField(dataV.oldPwd, 'placeholder.a10') &&
      validateField(dataV.newPwd, 'placeholder.a11') &&
      validateField(dataV.newPwdConfirm, 'placeholder.a12') &&
      validatePasswordsMatch(dataV.newPwd, dataV.newPwdConfirm, 'placeholder.a15')
  } else {
    isValid =
      validateField(dataV.tixian_password, 'placeholder.a13') &&
      validateField(dataV.new_tixian_password, 'placeholder.a14') &&
      validatePasswordsMatch(dataV.tixian_password, dataV.new_tixian_password, 'placeholder.a15')
  }

  return isValid
}

if (store.$state.userInfoData?.nameAvatarImg) {
  img.value = store.$state.userInfoData.nameAvatarImg
}

const frontFun = async (dataV) => {
  img.value = dataV
  updateAvatarImg(dataV)
}

const updateAvatarImg = async (img) => {
  let data = await api.updateNameAvatarImg({ img })
  message.success(data.msg)
  store.userInfo()
}

onMounted(() => {
  store.userInfo()
})
</script>

<template>
  <div class="body-warp">
    <div class="left-warp">
      <left-menu></left-menu>
    </div>

    <div class="right-warp">
      <div class="right-warp-title">
        <i>{{ $t('menu.a15') }}</i>
        <img src="@/assets/img/user/auth.png" />
        <em>{{ $t('user.a11') }}</em>
      </div>

      <div class="list-item">
        <div class="list-item-left">
          <img src="@/assets/img/user/pwd.png" />
          <div class="list-item-left-text">
            <p>{{ $t('user.a16') }}</p>
            <i>{{ $t('user.a17') }}</i>
          </div>
        </div>

        <imgUpload
          class="img-style"
          @imgAddr="frontFun"
          :defaultImg="auth1"
          :updateImg="img"
          :styleWH="imgSet"
        >
        </imgUpload>
      </div>

      <div class="list-item">
        <div class="list-item-left">
          <img src="@/assets/img/user/pwd.png" />
          <div class="list-item-left-text">
            <p>{{ $t('user.a4') }}</p>
            <i>{{ $t('user.a5') }}</i>
          </div>
        </div>
        <a-button class="right-btn" size="size" @click="handleClick('login')">{{
          $t('user.a3')
        }}</a-button>
      </div>

      <div class="list-item">
        <div class="list-item-left">
          <img src="@/assets/img/user/pwd.png" />
          <div class="list-item-left-text">
            <p>{{ $t('user.a6') }}</p>
            <i>{{ $t('user.a7') }}</i>
          </div>
        </div>
        <a-button class="right-btn" size="size" @click="handleClick('zijin')">{{
          $t('user.a3')
        }}</a-button>
      </div>

      <div class="list-item mtop">
        <div class="list-item-left">
          <img src="@/assets/img/user/exit.png" />
          <div class="list-item-left-text">
            <p>{{ $t('user.a8') }}</p>
            <i>{{ $t('user.a9') }}</i>
          </div>
        </div>
        <a-button class="right-btn" size="size" @click="store.logOut()">{{
          $t('login.a7')
        }}</a-button>
      </div>
    </div>

    <myModal
      class="big-modal"
      :open="openDialog"
      :dialogConfig="dialogConfig"
      @cancel="handleCancelModal"
    >
      <formIndex
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
  .left-warp {
    width: 256px;
  }
  .right-warp {
    width: 1182px;
    margin-left: 12vw;
    background: #ffffff;
    padding: 80px 15vw;
    .right-warp-title {
      margin-bottom: 80px;
      display: flex;
      align-items: end;
      > i {
        font-weight: 500;
        font-size: 24px;
        color: #000000;
        font-style: normal;
        margin-right: 18px;
      }
      > em {
        font-weight: 500;
        font-size: 12px;
        color: #db403b;
        font-style: normal;
        margin-left: 5px;
      }
    }
    .mtop {
      margin-top: 80px;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      padding: 30px 5px;
      border-bottom: 1px solid #e5e5e5;
      .list-item-left {
        display: flex;
        align-items: center;
        .list-item-left-text {
          margin-left: 5px;
          > p {
            font-weight: 500;
            font-size: 14px;
            color: #000000;
          }
          > i {
            font-weight: 500;
            font-size: 12px;
            color: #56565b;
            font-style: normal;
          }
        }
        > img {
          width: 28px;
          height: 28px;
        }
      }
      .img-style {
        width: 5vw;
      }
      .right-btn {
        font-weight: bold;
        font-size: 14px;
        color: #000000;
        padding: 9px 22px;
        height: auto;
      }
    }
  }
}
</style>
