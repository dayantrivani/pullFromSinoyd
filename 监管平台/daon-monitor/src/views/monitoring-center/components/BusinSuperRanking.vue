<template>
  <!-- 企业督办排名 -->
  <a-col :span="12" class="BusinSuperRanking">
    <a-card  class="busin_card recent_charts" title="企业督办排名" :bordered="false">
      <a-icon v-if="data.length > 5" class="left_circle" type="left-circle" @click="$refs.carousel.prev()"/>
      <a-icon v-if="data.length > 5" class="right_circle" type="right-circle" @click="$refs.carousel.next()"/>
      <a-carousel arrows autoplay class="rank_carousel" ref="carousel">
        <div class="content" v-for="(item, i) in Math.ceil(data.length / 5)" :key="i">
          <ul class="rank">
            <li class="item" v-for="(serial, index) in data.slice(i * 5, (i + 1) * 5)" :key="index">
              <div class="item_left" :class="`color${i * 5 + index + 1}`">{{i * 5 + index + 1}}</div>
              <div class="item_right">
                <p class="item_r_top">{{serial.name}}</p>
                <div class="item_r_bot">
                  <div class="accounted" :style="{ 'width': `${serial.count / max * 100}%` }"></div>
                </div>
              </div>
              <span>{{serial.count}}</span>
            </li>
          </ul>
          </div>
      </a-carousel>
    </a-card>
  </a-col>
</template>

<script>
// import { getDistribution } from '@/api/modules/monitoring-center.js';

export default {
  name: 'BusinSuperRanking',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      max: 0,
    };
  },
  watch: {
    data: {
      handler(val) {
        const arr = val.map(el => el.count);
        this.max = Math.max(...arr);
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss">
.busin_card{
  .ant-card-body{
    position: relative;
  }
}
.rank_carousel{
  height: 100%;
  >.slick-slider{
    height: 100%;
    >.slick-dots{
      display: none!important;
    }
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
}
</style>

<style lang="scss" scoped>
$colors:(
  "1":#CF6F6D,
  "2":#E6A465,
  "3":#89B5BB,
);
@each $colorKey, $color in $colors {
  .color#{$colorKey}{
    color: $color!important;
  }
}
.content{
  height: 100%;
}
.BusinSuperRanking{
  height: 100%;
  >.busin_card{
    height: 100%;
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
    .left_circle{
      left: 0;
      display: none;
      color: #8DB8BD;
    }
    .right_circle{
      right: 0;
      display: none;
      color: #8DB8BD;
    }
    .rank{
      height: 100%;
      >li{
        height: 14%;
        margin-top: 10px;
        >div{
          display: block;
          float: left;
          height: 100%;
        }
        >.item_left{
          width: 30px;
          line-height: 1.5;
          text-align: center;
          font-size: 20px;
          color: #BFBFBF;
        }
        >.item_right{
          width: calc(100% - 80px);
          >.item_r_top{
            height: 50%;
            color: #6E6E6E;
            line-height: 1;
          }
          >.item_r_bot{
            height: 40%;
            background: #EDF1F6;
            border-radius: 10px;
            >.accounted{
              height: 100%;
              border-radius: 10px;
              background: linear-gradient(to right, #94ADC5, #A8CFDF);
            }
          }
        }
        >span{
          width: 50px;
          height: 100%;
          text-align: center;
          line-height: 40px;
          display: inline-block;
        }
      }
    }
  }
}
</style>
