<script setup>
import leftMenu from "@/components/appCom/leftMenu.vue";
</script>

<template>
     <div class="body-warp">
        <div class="left-warp">
          <left-menu></left-menu>
        </div>

        <div class="right-warp">
            系统消息
        </div>
    </div>
</template>

<style lang="scss" scoped>
.body-warp{
  display: flex;
  .left-warp{

  }
  .right-warp{
    margin-left: 20px
  }
}
</style>