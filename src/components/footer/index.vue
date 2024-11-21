<script setup>
// [['港股','美股','美股碎段','ETF','保证金账户'],['关于我们','联系我们','常见问题'],['客户协议','期货合约客户协议及风险披露','平台钱包和自动申购服务协议']];
const fbLi = [
  ["/", "/", "/", "/"],
  ["/", "/", "/"],
  ["/", "/", "/"],
];
</script>
<template>
  <div class="footer">
    <div class="footer-box">
      <div class="footer-bottom">
        <div class="footer-bt-left">
          <div class="footer-ul" v-for="(item, index) in fbLi" :key="index">
            <div class="ul-title">{{ $t(`footer.a${index}`) }}</div>
            <ul>
              <li v-for="(childItem, childIndex) in item" :key="childIndex">
                <RouterLink :to="childItem">{{
                  $t(`footer.a${index}_${childIndex}`)
                }}</RouterLink>
              </li>
            </ul>
          </div>
        </div>
        <div class="footer-bt-right">
          <div class="info-smal">{{ $t("footer.b0") }}</div>
          <div class="info-smal mb-10">{{ $t("footer.b0_0") }}</div>
          <div class="info-big">+852 2127 0660</div>
          <div class="info-smal">{{ $t("footer.b1") }}</div>
          <div class="info-smal mb-10">{{ $t("footer.b1_0") }}</div>
          <div class="info-smal">hk-gcs@tigerbrokers.com.hk</div>
          <div class="info-smal">{{ $t("footer.b2") }}</div>
        </div>
      </div>
      <div class="footer-web-info">
          CPDMa3s(PDMaas.com)苏ICP备202202510号-1
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.footer {
  position: relative;
  width: 100%;
  padding-bottom: 200px;
  background: #000000;
  color: #fff;
  .router-link-active {
    color: #fff;
    padding: 0;
  }
  .footer-box {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    .footer-bottom {
      padding: 60px 20px 0 20px;
      flex: 1;
      display: flex;
      .footer-bt-left {
        display: flex;
        flex: 1;
        .footer-ul {
          flex: 1;
          .ul-title {
            font-weight: bold;
            color: #fff;
            .router-link-active {
              font-size: 20px;
            }
          }
          ul {
            margin-top: 10px;
            padding: 0;
            overflow: hidden;
            li {
              margin-top: 14px;
              .router-link-active {
                font-size: 14px;
              }
            }
          }
        }
      }
      .footer-bt-right {
        text-align: right;
        .info-smal {
          font-size: 14px;
          margin-bottom: 4px;

          &.mb-10 {
            margin-bottom: 16px;
          }
        }
        .info-big {
          font-size: 28px;
          font-weight: bold;
          margin: 22px 0 22px;
        }
      }
    }
    .footer-web-info{
      color: #707070;
      position: absolute;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
