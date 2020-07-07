<template>
<div class="stationImfor">
  <img class="line" src="@/assets/img/model_line.png"/>
  <img class="point" src="@/assets/img/point.png"/>
  <div class="model_content">
    <div style="z-index: 1000;color: #fff;">
      <div class="content_top">
        <div class="top_t">
          <div class="top_t_left">
            {{factorData.name}}
          </div>
          <div class="top_t_right">
            报警
          </div>
        </div>
        <p class="top_b">
          {{factorData.address}}
        </p>
      </div>
      <div class="stationImfor_carous">
        <a-icon v-if="factorData.pointData.length > 6" class="left_circle" type="left-circle" @click="$refs.carousel.prev()"/>
        <a-icon v-if="factorData.pointData.length > 6" class="right_circle" type="right-circle" @click="$refs.carousel.next()"/>
        <a-carousel arrows autoplay class="oprer_carousel" ref="carousel">
          <ul class="item" v-for="(item, i) in Math.ceil(factorData.pointData.length / 6)" :key="i">
            <li v-for="(serial, index) in factorData.pointData.slice(i * 6, (i + 1) * 6)" :key="index">
              <p class="top">
                <span class="name">{{serial.name}}</span>
                <span class="unit">{{serial.unit}}</span>
              </p>
              <p class="middle">
                <span class="value">{{serial.avg}}</span>
              </p>
              <!-- <p class="bottom" style="margin-top: 4px;">
                <span class="type">{{serial.type}}</span>
                <span class="mdeValue">{{serial.mdeValue}}</span>
              </p> -->
            </li>
          </ul>
        </a-carousel>
      </div>
      <div class="content_bottom">
        <content-up
          :item-height="40"
          :data="factorData.supervisionData || []"
          :itemHeight="65"
          :play="factorData.supervisionData.length ? true : false">
          <template slot-scope="{ item }">
              <div class="content_bottom_t">
                <img class="plioce_ico" src="@/assets/img/plioce_ico.png"/>
                <span class="police">{{item.alarmedAt}}</span>
                <span class="type">
                  <img src="@/assets/img/time_ico.png"/>
                  <span >{{item.type}}</span>
                </span>
              </div>
              <p class="message">{{item.message}}</p>
              <span class="super">
                <img class="plioce_ico" src="@/assets/img/people_ico.png"/>
                <span>监理</span>
              </span>
          </template>
        </content-up>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { getFactor } from '@/api/modules/thematic-map.js';

export default {
  name: 'stationImfor',
  data() {
    return {
      factorData: {
        address: '',
        isAlarm: false,
        name: '',
        pointData: [],
        supervisionData: [],
      },
      stationData: [
        {
          name: '大邦纺织废水',
          address: '张家港市杨舍镇国泰北路15号',
          police: {
            time: '2020-03-25 02:10:35',
            type: '余3小时',
            message: '大邦纺织废水【COD在线分析仪】发生浓度超标报警发生浓度超标报警',
          },
        },
      ],
      factor: [
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
        {
          name: 'COD',
          unit: 'mg/m3',
          type: '标准',
          value: '36.25',
          mdeValue: '15.33',
        },
      ],
    };
  },
  methods: {
    getFactorData(id) {
      getFactor(id).then((res) => {
        if (res.data.success && res.data.code === 200) {
          // console.log(res);
          this.factorData = res.data.data;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.amap-info-contentContainer{
  width: 0;
  height: 0;
  overflow: hidden;
}
.stationImfor_carous{
  width: 90%;
  margin: 0 auto;
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
  }
}
</style>
<style lang="scss" scoped>
@media (width: 1920px) {
  .stationImfor{
    left: 1083px;
  }
}
@media (width: 1600px) {
  .stationImfor{
    left: 925px;
  }
}
.stationImfor{
  z-index: 1000;
  width: 400px;
  height: 483px;
  position: absolute;
  bottom: -260px;
  background-image: url('../../../../../assets/img/model_bg.png');
  background-repeat: no-repeat;
  >.line{
    width: 200px;
    position: absolute;
    left: -138px;
    top: 55px;
  }
  >.point{
    width: 26px;
    position: absolute;
    left: 47px;
    top: 48px;
  }
  >.model_content{
    width: 60%;
    height: 60%;
    width: 75%;
    height: 76%;
    position: absolute;
    top: 72px;
    right: 29px;
    perspective: 1500px;
    >div{
      height: 100%;
      width: 100%;
      // transform: perspective(600px) rotate(45deg);
      transform: rotateY(-30deg);
    }
    .content_top{
      height: 55px;
      >.top_t{
        height: 30px;
        >.top_t_left{
          width: calc(100% - 80px);
          height: 100%;
          font-weight: 600;
          color: #2193BD;
          display: inline-block;
          float: left;
          line-height: 25px;
          font-size: 16px;
        }
        >.top_t_right{
          width: 80px;
          height: 100%;
          background-image: url('../../../../../assets/img/police_bg.png');
          background-size: 100% 100%;
          background-repeat: no-repeat;
          display: inline-block;
          float: left;
          text-align: center;
          line-height: 30px;
          font-size: 12px;
          color: #C57231;
        }
      }
      >.top_b{
        height: 20px;
        color: #595B61;
        // margin-top: 5px
      }
    }
    .stationImfor_carous{
      height: 240px;
      .oprer_carousel{
        height: 100%;
        ul{
          width: 100%;
          height: 240px;
          >li:nth-child(odd){
            margin-left: 0!important;
          }
          >li:nth-child(1) {
            margin-top: 0;
          }
          >li:nth-child(2) {
            margin-top: 0;
          }
          >li{
            padding: 5px;
            display: inline-block;
            float: left;
            font-size: 12px;
            width: calc(50% - 5px);
            margin-left: 10px;
            margin-top: 10px;
            height: 70px;
            border: 1px solid #203F51;
            border-radius: 5px;
            box-shadow: 0 0 0 3px #072535, 0 0 0 3x #011D2A, 0 0 0 3px #081F2A;
            >p{
              height: 20px;
            }
            .name{
              color: #fff;
              float: left;
            }
            .unit{
              color: #4D5764;
              float: right;
            }
            .value{
              font-size: 16px;
              color: #28A4D1;
            }
            .type{
              color: #4D5764;
              float: left;
            }
            .mdeValue{
              color: #fff;
              float: right;
            }
          }
        }
      }
    }
    .content_bottom{
      height: 65px;
      color: #fff;
      font-size: 12px;
      img{
        width: 15px;
      }
      .content_bottom_t{
        height: 20px;
        >.police{
          margin-left: 10px;
        }
        >.type{
          width: 80px;
          float: right;
          color: #AD4269;
          >span{
            margin-left: 10px;
          }
        }
      }
      .message{
        color: #3D454A;
      }
      .super{
        position: absolute;
        right: 20px;
        bottom: 15px;
        perspective: 1500px;
        >span{
          margin-left: 10px;
          transform: rotateY(-30deg);
        }
      }
    }
  }
}
</style>
