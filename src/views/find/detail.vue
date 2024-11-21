<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  getCurrentInstance,
  reactive,
} from "vue";
import { formatTime } from "@/utils/utils";
import { getCache } from "@/utils/cache";
import { CacheFindDetail } from "@/constants/cacheKey";
const dataLists = ref([]);
const dataDetail = reactive(getCache(CacheFindDetail, { isSessionStorage: true }, {}))


</script>

<template>
  <div class="back">
    <div>
      <i>{{ $t("menu.a1") }}</i>
      <em>>{{ $t("menu.a8") }}</em>
    </div>
  </div>
  <div class="content">
        <div class="left-div">
          <div class="item" >
           
                <p class="item-title">{{ dataDetail.title }}</p>
               
                <div class="item-bot">
                  <p>
                    {{ $t("record.a1") }}：{{ formatTime(dataDetail.updateTime) }}
                  </p>
                  <p>{{ $t("con.a22") }}：{{ dataDetail.views }}</p>
                </div>
             
                <img class="item-img" :src="$imagePrefix + dataDetail.imgurl" />
            
				 <p class="item-content">{{ dataDetail.content }}</p>
          </div>
        
        </div>
     
  </div>
</template>

<style lang="scss" scoped>
.back {
  width: 100%;
  height: 63px;
  //   background: rgba(56, 142, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    width: 1200px;
    height: 100%;
    position: relative;
    padding-left: 38px;
    display: flex;
    align-items: center;
    > i {
      font-weight: 500;
      font-size: 16px;
      color: #9aa5b5;
      font-style: normal;
      margin-right: 5px;
    }
    > em {
      font-weight: 500;
      font-size: 16px;
      color: #000000;
      font-style: normal;
    }
  }
}
.content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 10px 38px 38px 38px;
  .left-div {
    margin-right: 40px;
    .item {
      margin-bottom: 60px;
	  text-align: center;
      .item-title {
        font-weight: 500;
        font-size: 26px;
        color: #000000;
		text-align: center;
		padding: 20px 40px;
      }

      .item-content {
        font-weight: 500;
        font-size: 16px;
        color: #000000;
        margin-top: 30px;
		text-indent: 2em;
		text-align: left;
		line-height: 40px;
      }
      .item-bot {
		  padding: 20px 40px;
		display: flex;
		justify-content: center;
        > p {
          font-weight: 500;
          font-size: 14px;
          color: #999999;
		  &:last-child {
		    margin-left: 30px;
		  }
        }
		
      }
      .item-img {
        width: 40%;
        border-radius: 10px 10px 10px 10px;
        border: 1px solid #707070;
      }
    }
  
  }

}
</style>