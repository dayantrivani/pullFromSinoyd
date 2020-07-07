<template>
<!-- 运维排名 -->
<div class="content_map">
  <div class="after_map right_bg" v-show="!isShow"></div>
  <div class="model_bg">
    <span class="title">运维排名</span>
    <div class="OpsRanking_carousel">
      <a-icon v-if="data.length > 10" class="left_circle" type="left-circle" @click="$refs.carousel.prev()"/>
      <a-icon v-if="data.length > 10" class="right_circle" type="right-circle" @click="$refs.carousel.next()"/>
      <a-carousel arrows autoplay class="oprer_carousel" ref="carousel">
        <div class="item" v-for="(item, i) in Math.ceil(data.length / 10)" :key="i">
          <ul v-for="(serial, index) in data.slice(i * 10, (i + 1) * 10)" :key="index">
            <li>
              <div class="left">{{ i * 10 + index + 1 }}</div>
              <div class="right">
                <p class="name">{{serial.corpName}}</p>
                <div class="all_account">
                  <div class="account" :style="{ 'width': `${serial.points < 0 ? 0 : serial.points / maxNum * 100}%` }"></div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </a-carousel>
    </div>
  </div>
</div>
</template>

<script>
import { getRank } from '@/api/modules/thematic-map.js';

export default {
  name: 'OpsRanking',
  props: {
    // 控制背景阴影的显示隐藏
    isShow: String,
  },
  data() {
    return {
      maxNum: 0,
      data: [
        { name: '运维企业名称1', num: 90 },
        { name: '运维企业名称1', num: 85 },
        { name: '运维企业名称1', num: 70 },
        { name: '运维企业名称1', num: 70 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
        { name: '运维企业名称1', num: 60 },
      ],
    };
  },
  mounted() {
    getRank().then((res) => {
      if (res.data.success && res.data.code === 200) {
        this.data = res.data.data;
        this.maxNum = this.data[0].points;
      } else {
        this.$message.warning(res.data.msg);
      }
    });
  },
};
</script>

<style lang="scss">
.OpsRanking_carousel{
  height: 100%;
  width: 90%;
  margin: 0 auto;
  margin-top: 10px;
  position: relative;
  &:hover{
    .left_circle{
      display: block;
    }
    .right_circle{
      display: block;
    }
  }
  i{
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    color: #fff;
    z-index: 2;
    height: 14px;
    cursor: pointer;
  }
  >.left_circle{
    left: -15px;
    display: none;
  }
  >.right_circle{
    right: -15px;
    display: none;
  }
  .oprer_carousel{
    height: 100%;
    width: 100%;
    z-index: 1;
    >.slick-slider{
      height: 100%;
      >.slick-list{
        height: 100%;
        >.slick-track{
          height: 100%;
          >.slick-slide{
            height: 100%;
            >div{
              height: 100%;
            }
          }
        }
      }
    }
    .slick-dots{
      display: none!important;
    }
    .item{
      height: 100%;
      >ul{
        width: 100%;
        height: 10%;
        >li{
          width: 100%;
          height: 100%;
          display: inline-block;
          color: #fff;
          >div{
            display: inline-block;
            float: left;
            height: 100%;
          }
          >.left{
            width: 30px;
            font-size: 20px;
            text-align: left;
            line-height: 55px;
          }
          >.right{
            width: calc(100% - 30px);
            >.name{
              font-size: 14px;
              text-align: left;
            }
            >.all_account{
              height: 12px;
              background: #23272F;
              margin-top: 3px;
              >.account{
                background: #00A3F4;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
}
</style>
