<script setup>
import { getCurrentInstance, ref, watch, onMounted, onUnmounted, computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLangName, supportLangs } from '@/i18n'
import { CacheLang } from '@/constants/cacheKey'
import { setCache, getToken } from '@/utils/cache'
import { useAppStore } from '@/store/index'
import { menuData, userMenu } from '@/router/menu'
import { useRouter } from 'vue-router'
import leftMenu from './leftMenu.vue'
import searchStock from '../searchStock/index.vue'
import { MenuOutlined } from '@ant-design/icons-vue'
const message = inject('message')
// import * as api from '@/axios/api'
const router = useRouter()
// const instance = getCurrentInstance()
const store = useAppStore()

const {
  proxy: { $t: textI18n },
} = getCurrentInstance()

const isMobile = ref(false) //根据屏幕展示不同菜单样式
const handleResize = () => {
  isMobile.value = window.innerWidth < 1024
}

const currentRoute = ref('')

const goPath = (path) => {
  const isIndexOrFindOrAbout =
    path === '/index' || path === '/find' || path === '/about' || path === '/home'
  console.log(tokenExists.value)
  console.log(getToken(), 'getToken()')
  if (tokenExists.value && getToken()) {
    if (currentRoute.value !== path && path) {
      router.push(path)
    }
  } else {
    if (isIndexOrFindOrAbout) {
      router.push(path)
    } else {
      message.warning(textI18n('login.a8'))
      // router.push('/login?type=1');
    }
  }
}

const goPage = (path) => {
  if (tokenExists.value && getToken()) {
    if (path === '/auth' && userInfo.value.isActive === 0) {
      //未认证
      router.push(path)
    }
    if (path === '/card' && (!cardInfo || Object.keys(cardInfo.value).length === 0)) {
      router.push(path)
    }
  } else {
    message.warning(textI18n('login.a8'))
  }
}
const { locale } = useI18n()
const langName = ref(getLangName(locale.value))
const langs = ref(Object.keys(supportLangs))
const change = (lang) => {
  setCache(CacheLang, lang)
  locale.value = lang
  langName.value = getLangName(lang)
}

import ggao from '@assets/img/common/ggao.png'
import xxi from '@assets/img/common/xxi.png'

import kai from '@assets/img/common/open_eye.png'
import guan from '@assets/img/common/close_eye.png'
const msgList = ref([
  // {
  //   type: '1', // 1系统公告， 2系统消息
  //   img: ggao,
  //   count: 4,
  //   countList: [
  //     {
  //       time: '2024/10/16 15:51',
  //       content: ``
  //     }
  //   ]
  // },
  {
    type: '2', // 1系统公告， 2系统消息
    img: xxi,
    count: 0,
    countList: null,
  },
])

const logHandle = (type) => {
  router.push(`/login?type=${type}`)
}

const hovered = ref(false)
const hide = () => {
  hovered.value = false
  store.logOut()
}
const handleHoverChange = (visible) => {
  hovered.value = visible
}

const openD = ref(false)

const onDrawer = (type) => {
  openD.value = type
}
const openStock = ref(false)
const searchStockFunClick = (bool) => {
  openStock.value = bool
}

const hideMoney = () => {
  store.$state.isMoneyHide = !store.$state.isMoneyHide
}

const kefu = () => {
  let kefuAddr
  if (!tokenExists.value || !getToken()) {
    kefuAddr = store.$state.infoSite.onlineService
  } else {
    kefuAddr = userInfo.value.challengePhone //普通客服
    // kefuAddr = userInfo.value.agentPhone  //入金客服
  }
  console.log(kefuAddr, 'kefuAddr')
  if (kefuAddr) window.open(kefuAddr)
}
// const imageUrl = computed(() => {
//   return instance.appContext.config.globalProperties.$imagePrefix;
// });

function updateMenuTitles(menu) {
  return menu.map((item) => ({
    ...item,
    title: textI18n(`${item.title}`),
    label: textI18n(`${item.label}`),
    children: item.children ? updateMenuTitles(item.children) : undefined,
  }))
}

const computedMenu = computed(() => updateMenuTitles(menuData))
const computedUserMenu = computed(() => updateMenuTitles(userMenu))
const tokenExists = computed(() => {
  return store.$state.token
})
const userInfo = computed(() => {
  return store.$state.userInfoData
})
const cardInfo = computed(() => {
  return store.$state.cardInfo
})

watch(
  [() => router.currentRoute.value.path, store.$state.userInfoData, store.$state.cardInfo],
  ([newRoutePath, newUserValue, newCardValue], [oldRoutePath, oldUserValue, oldCardValue]) => {
    currentRoute.value = newRoutePath
  },
  // 配置选项
  { deep: true, immediate: true },
)

onMounted(() => {
  if (tokenExists.value && getToken()) {
    store.userInfo()
    store.getCardDetail()
    store.getPriceInfo()
  }
  handleResize() // 初始化判断
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

function pageAction(top) {
  if (top) {
    document.querySelector('html')?.scrollTo(0, 0)
  } else {
    document.querySelector('html')?.scrollTo(0, 1000000)
  }
}
</script>
<template>
  <div class="body-warp">
    <div class="header-warp">
      <div class="header-l">
        <h1>LOGO</h1>
        <p class="menu-icon" @click="onDrawer(true)" v-show="isMobile"><MenuOutlined /></p>

        <div v-show="!isMobile">
          <template v-for="item in computedMenu">
            <a-popover :key="item.key" v-if="item.children" placement="bottom">
              <template #content>
                <div
                  class="div-menu"
                  v-for="el in item.children"
                  :key="el.key"
                  @click="goPath(el.url)"
                  :class="currentRoute == el.url ? 'active' : ''"
                >
                  {{ el.title }}
                </div>
              </template>
              <a class="ant-dropdown-link kjfs">
                <span @click="item.children ? null : goPath(item.url)">{{ item.title }}</span>
                <img
                  class="arrow-down"
                  v-if="item.children"
                  src="@assets/img/common/arrow_down.png"
                />
              </a>
            </a-popover>
            <a class="ant-dropdown-link kjfs" v-else>
              <span @click="item.children ? null : goPath(item.url)">{{ item.title }}</span>
            </a>
          </template>
        </div>
      </div>
      <div class="header-r">
        <a-input :placeholder="$t('placeholder.a0')" @click="searchStockFunClick(true)">
          <template #prefix>
            <i class="icon icon-search"></i>
          </template>
        </a-input>

        <a-button type="text" v-if="!tokenExists || !getToken()" @click="logHandle(1)">{{
          $t('login.a5')
        }}</a-button>
        <a-button
          type="primary"
          v-if="!tokenExists || !getToken()"
          size="small"
          @click="logHandle(2)"
          >{{ $t('login.a6') }}</a-button
        >
        <div class="icon-wrap">
          <!-- 个人中心 -->
          <a-popover
            placement="bottom"
            trigger="hover"
            :open="hovered"
            @openChange="handleHoverChange"
          >
            <template #content>
              <div class="my-center">
                <div class="header">
                  <div class="msg-box">
                    <img
                      class="avai"
                      v-if="userInfo.nameAvatarImg && getToken()"
                      :src="$imagePrefix + userInfo.nameAvatarImg"
                    />
                    <img class="avai" v-else src="@assets/img/common/ai.png" />
                    <div class="user-info">
                      <p class="name" v-if="getToken()">{{ userInfo.realName }}</p>
                      <!-- <p class="acount">UID：504964097 <i class="icon"></i></p> -->
                    </div>
                    <!-- <a-button size="small">{{ $t('con.a4') }} <img class="conv" src="@assets/img/common/ext.png"></a-button> -->
                  </div>
                  <div class="msg-btn">
                    <!-- isActive 0 未认证 con.a5   1审核中 con.a29  2已认证con.a28-->

                    <span
                      @click="goPage('/auth')"
                      :class="[
                        userInfo.isActive === 0 && getToken()
                          ? 'status-null'
                          : userInfo.isActive === 1 && getToken()
                            ? 'status-reject'
                            : userInfo.isActive === 2 && getToken()
                              ? 'status-ready'
                              : 'status-null',
                      ]"
                    >
                      {{
                        userInfo.isActive === 0 && getToken()
                          ? $t('con.a5')
                          : userInfo.isActive === 1 && getToken()
                            ? $t('con.a29')
                            : userInfo.isActive === 2 && getToken()
                              ? $t('con.a28')
                              : $t('con.a5')
                      }}
                    </span>
                    <span
                      @click="goPage('/card')"
                      :class="[
                        !cardInfo || Object.keys(cardInfo).length === 0 || !getToken()
                          ? 'status-null'
                          : 'status-ready',
                      ]"
                    >
                      {{
                        !cardInfo || Object.keys(cardInfo).length === 0 || !getToken()
                          ? $t('con.a6')
                          : $t('con.a30')
                      }}</span
                    >
                  </div>
                </div>
                <div class="content-list">
                  <p class="money-title">
                    {{ $t('con.a7') }}

                    <img
                      :src="store.$state.isMoneyHide ? kai : guan"
                      class="img"
                      @click="hideMoney"
                    />
                  </p>
                  <p class="money">
                    {{ store.$state.isMoneyHide ? '****' : getToken() ? userInfo.enableAmt : '' }}
                  </p>
                  <!-- <p class="money-ext">≈$17842.84</p> -->
                  <ul class="path-ul">
                    <li
                      class="path-li"
                      v-for="(item, index) in computedUserMenu"
                      :key="index"
                      @click="goPath(item.url)"
                    >
                      <span>{{ item.title }}</span>
                      <img class="img" src="@assets/img/common/rjt.png" alt="" />
                    </li>
                  </ul>
                </div>
                <div class="loginout" @click="hide">{{ $t('login.a7') }}</div>
                <!-- <div class="loginout" @click="store.logOut()">{{ $t('login.a7') }}</div> -->
              </div>
            </template>
            <img
              v-if="userInfo.nameAvatarImg && getToken()"
              class="header-li-ava"
              :src="$imagePrefix + userInfo.nameAvatarImg"
            />
            <i v-else class="icon ai"></i>
          </a-popover>
          <!-- 消息 -->
          <!--  <a-popover placement="bottomLeft">
                <template #content>
                  <div class="mgs-wrap">
                      <div class="msg-title">
                        <span class="title">{{ $t('con.a8') }}</span>
                        <div>
                          <img class="clear" src="@assets/img/common/clear.png" />
                          <span class="read">{{ $t('con.a9') }}</span>
                        </div>
                      </div>
                      <div class="msg-type" v-for="(item, index) in msgList" :key="index">
                        <div class="flex-bet">
                          <div class="xtgg">
                            <img class="img" :src="item.img" />
                            <span class="title">{{ item.type == '1' ? $t('con.a10') : $t('con.a11') }}</span>
                          </div>
                          <a-badge v-if="item.count > 0" :count="item.count" />
                        </div>
                        <template v-if="item.count > 0 && item.countList && item.countList.length">
                          <div class="mes-content flex-bet">
                            <p class="content">
                              {{  item.countList[0].content  }}
                            </p>
                            <img class="img" src="@assets/img/common/rjt.png" alt="">
                          </div>
                          <p class="time">{{ item.countList[0].time }}</p>
                        </template>
                        <div v-else class="empty">
                          {{ $t('con.a12') }}
                        </div>
                      </div>
                  </div>
                </template>
                <i class="icon msg"></i>
            </a-popover>
          -->
          <a-popover placement="bottom">
            <template #content>
              <div class="down-wrap">
                <img class="app-code" src="@assets/img/login/app_code.png" />
                <p>{{ $t('con.a3') }}</p>
                <p>{{ $t('con.a2') }}</p>
              </div>
            </template>
            <i class="icon phone"></i>
          </a-popover>
          <!-- 国际化 -->
          <a-popover placement="bottom">
            <template #content>
              <div
                class="div-menu"
                @click="change(item)"
                :class="locale == item ? 'active' : ''"
                v-for="item in langs"
                :key="item"
              >
                {{ supportLangs[item].langName }}
              </div>
            </template>
            <i class="icon language"></i>
          </a-popover>
        </div>
      </div>
    </div>

    <left-menu :open="openD" @onClose="onDrawer"></left-menu>

    <searchStock :open="openStock" @onCancel="searchStockFunClick"></searchStock>

    <!-- 右侧固定 -->
    <div class="right-fixed">
      <img src="@assets/img/common/goUp.png" @click="pageAction(true)" />
      <img src="@assets/img/common/goDown.png" @click="pageAction(false)" />
      <img src="@assets/img/common/ai.png" @click="kefu" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.div-menu {
  height: 42px;
  width: 133px;
  line-height: 42px;
  font-weight: bold;
  font-size: 14px;
  color: #11131d;
  text-align: center;
  cursor: pointer;
  &.active {
    color: #447dff;
    background: linear-gradient(
      93deg,
      rgba(0, 102, 255, 0) 0%,
      rgba(0, 102, 255, 0.09) 52%,
      rgba(0, 102, 255, 0) 100%
    );
  }
}
.down-wrap {
  padding: 20px 33px;

  .app-code {
    width: 176px;
    height: auto;
  }
  p {
    text-align: center;
    font-size: 16px;
    line-height: 16px;
    color: #11131d;
    margin: 12px 0 0;
    padding: 0;
  }
}
.search-div {
  width: 500px;
}
.my-center {
  width: 354px;
  .msg-box {
    padding: 28px 28px 16px;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    .avai {
      width: 44px;
      height: 44px;
      border-radius: 50%;
    }
    .user-info {
      // width: 153px;
      width: 80%;
      .name {
        margin-left: 5px;
        line-height: 28px;
        font-weight: bold;
        font-size: 20px;
        color: #000000;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .acount {
        font-weight: 500;
        font-size: 12px;
        color: #919395;
        .icon {
          display: inline-block;
          width: 9px;
          height: 9px;
          background: url('@assets/img/common/copy.png') 100% 100% no-repeat center center;
        }
      }
    }
    :deep(.ant-btn) {
      height: 24px;
      border-radius: 12px;
      color: #9aa5b5;
      .conv {
        vertical-align: baseline;
        width: 10px;
        margin-left: 3px;
      }
    }
  }
  .msg-btn {
    padding: 0 28px 22px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #dddddd;
    span {
      padding: 7px 26px;
      font-weight: bold;
      font-size: 14px;
      line-height: 20px;
      border-radius: 6px;
      cursor: pointer;
      & + span {
        margin-left: 10px;
      }
    }
    // .wrz {
    //   background-color: rgba(238, 128, 47, .1);
    //   color: #EE802F;
    // }
    // .wbd {
    //   background-color: rgba(0, 120, 255, .1);
    //   color: #0066FF;
    // }
  }
  .content-list {
    width: 100%;
    padding: 18px 17px 0;
    box-sizing: border-box;
    p {
      margin: 0;
      padding: 0;
    }
    .money-title {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
      color: #9aa5b5;
      line-height: 20px;
      padding-bottom: 7px;
      .img {
        width: 21px;
        margin-left: 8px;
      }
    }
    .money {
      font-weight: bold;
      font-size: 20px;
      color: #000000;
      line-height: 28px;
    }
    .money-ext {
      font-weight: 500;
      font-size: 12px;
      color: #919395;
      line-height: 17px;
    }
  }
  .path-ul {
    width: 100%;
    margin: 0;
    padding: 0 18px 24px;
    .path-li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #919395;
      padding-top: 26px;
      font-size: 14px;
      font-weight: 500;
      position: relative;
      padding-left: 34px;
      cursor: pointer;
      &::before {
        content: '';
        position: absolute;
        width: 26px;
        height: 26px;
        background: #919395;
        left: 0;
      }
      .img {
        width: 6px;
      }
    }
  }
  .loginout {
    font-size: 14px;
    line-height: 20px;
    border-top: 1px solid #dddddd;
    text-align: center;
    cursor: pointer;
    font-weight: bold;
    color: #9aa5b5;
    padding: 18px 0;
  }
}
.mgs-wrap {
  width: 401px;
  padding: 29px 16px;
  box-sizing: border-box;
  .msg-title {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
    .title {
      font-weight: 500;
      font-size: 16px;
      color: #000000;
      line-height: 20px;
    }
    .read {
      font-weight: 500;
      font-size: 12px;
      color: #56565b;
      line-height: 17px;
    }
    .clear {
      width: 14px;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
  .msg-type {
    & + .msg-type {
      margin-top: 14px;
    }
    .xtgg {
      padding-right: 8px;
    }
    .flex-bet {
      align-items: center;
    }
    .img {
      width: 22px;
      margin-right: 4px;
      vertical-align: middle;
    }
    .title {
      font-weight: 500;
      font-size: 13px;
      color: #000000;
      line-height: 18px;
    }
    .mes-content {
      width: 100%;
      padding: 16px 5px 6px 26px;
      box-sizing: border-box;
      align-items: center;
      cursor: pointer;
      .content {
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3; //行数
        -webkit-box-orient: vertical;
        display: -webkit-box;
        line-height: 20px;
        font-weight: 500;
        font-size: 12px;
        color: #56565b;
        width: 318px;
      }
      .img {
        width: 6px;
      }
    }
    .time {
      font-weight: 500;
      font-size: 12px;
      color: #919395;
      line-height: 17px;
      padding: 0 26px 14px;
      border-bottom: 1px solid #dddddd;
    }
    .empty {
      border-bottom: 1px solid #dddddd;
      padding: 16px 26px 33px;
      font-weight: 500;
      font-size: 12px;
      color: #56565b;
      line-height: 17px;
    }
    &:last-child {
      .time,
      .empty {
        border-bottom: none;
      }
    }
  }
}
.body-warp {
  position: sticky;
  top: 0;
  z-index: 10;
  .icon {
    display: inline-block;
    vertical-align: bottom;
  }

  .header-warp {
    padding: 0 35px 0 18px;
    width: 100%;
    height: 66px;
    background: #161616;
    flex-shrink: 0;
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-l {
      display: flex;
      align-items: center;
      .menu-icon {
        margin-left: 24px;
        font-size: 24px;
        cursor: pointer;
      }

      .ant-dropdown-link {
        // margin-left: 31px;
        color: #fff;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        &.kjfs {
          // margin-left: 44px;
          padding: 0 20px;
          > span {
            font-weight: 500;
            font-size: 16px;
          }
        }
        &:hover {
          background: transparent;
        }

        .b-arrow {
          margin-left: 2px;
          width: 0;
          height: 0;
          border: 6px solid #8c8c93;
          border-left-color: transparent;
          border-bottom-color: transparent;
          border-right-color: transparent;
        }

        .arrow-down {
          width: 9px;
          height: 5px;
          margin-left: 6px;
          vertical-align: middle;
        }
      }

      .router-link-active {
        margin-left: 44px;
        color: #fff;
        font-size: 16px;

        &:hover {
          background: transparent;
        }
      }
    }

    .header-r {
      display: flex;
      height: 100%;
      align-items: center;
      :deep(.ant-btn-text) {
        color: #8c8c93;
      }
      .ant-input-affix-wrapper {
        width: 206px;
        height: 34px;
        background: #313132;
        border-radius: 4px 4px 4px 4px;
        border: unset;

        :deep(.ant-input) {
          background: transparent !important;
          color: #fff;
          font-size: 16px;

          &::placeholder {
            color: #8c8c93;
          }
        }
      }
      .icon-search {
        width: 18px;
        height: 18px;
        background: url('@assets/img/common/search-icon.png') no-repeat center center;
        background-size: 100% 100%;
      }
      .icon-wrap {
        display: flex;
        height: 26px;
        .icon {
          width: 60px;
          height: 100%;
          background-position: center center;
          background-repeat: no-repeat;
          background-size: 26px 26px;
        }
        .ai {
          cursor: pointer;
          background-image: url('@assets/img/common/ai.png');
        }
        .msg {
          background-image: url('@assets/img/common/msg.png');
        }
        .phone {
          background-image: url('@assets/img/common/phone.png');
        }
        .language {
          cursor: pointer;
          background-image: url('@assets/img/common/language.png');
        }

        .header-li-ava {
          cursor: pointer;
          margin-left: 20px;
        }
      }
    }

    h1 {
      font-size: 26px;
      font-weight: 800;
    }
  }
  .body-content {
    flex: 66px 1;
    background-color: #f9f9f9;
  }
}
.right-fixed {
  position: fixed;
  right: 33px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  img {
    width: 54px;
    height: 54px;
    cursor: pointer;
    & + img {
      margin-bottom: 16px;
    }
  }
}
</style>
