<script setup>
import { computed } from 'vue'
import { useAppStore } from "@/store/index";
const store = useAppStore()
import footerVue from "@/components/footer/index.vue"

const infoSite = computed(() => {return store.$state.infoSite})

</script>

<template>
    <div class="banner">
        <div class="banner-text">
            <p class="title">{{ $t("about.a0") }}</p>
            <p class="sub-title">{{ $t("about.a1") }}</p>
        </div>
    </div>
    <div class="content">
        <p v-html="infoSite.companyInfo"></p>
    </div>
    <div class="about-us">
        <p class="title">{{ $t("home.a21") }}</p>
        <a-button>{{ $t("home.a22") }}</a-button>
    </div>
    <footerVue></footerVue>
</template>

<style lang="scss" scoped>
.banner {
    width: 100%;
    height: 350px;
    background: url("@assets/img/home/banner2.png") 100% 100% no-repeat;
    overflow: hidden;
    .banner-text {
        margin-top: 101px;
        margin-left: 395px;
        .title {
            font-size: 68px;
            color: #000000;
            line-height: 81px;
            line-height: 95px;
        }
        .sub-title {
            font-size: 26px;
            color: #000;
            line-height: 37px;
        }
    }
}
.content {
    margin: 50px auto;
    max-width: 1180px;
	padding: 0 20px;
	> p{
	  text-indent: 2ch;
	}
   
}
.about-us {
  width: 100%;
  height: 307px;
  background: url("@assets/img/home/bg.png") 100% 100% no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  .title {
    font-weight: 800;
    font-size: 42px;
    color: #ffffff;
    margin-bottom: 92px;
  }
  .ant-btn {
    width: 150px;
    height: 48px;
    border-radius: 8px 8px 8px 8px;
    border: 1px solid #ffffff;
    background: transparent;
    font-size: 18px;
    color: #fff;
  }
}
</style>