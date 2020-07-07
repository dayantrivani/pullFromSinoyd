<template>
  <el-row class="fill-h box">
    <el-col :span="13" class="box-left">
      <div class="header">
        <div>保税区</div><div>{{itemModel.dataTime}}</div>
      </div>
      <div class="main">
        <div class="main-num" :style="{ color: itemModel.aqiColor }">{{itemModel.realtimeAQI || '--'}}</div>
        <div class="main-text">
          <div class="main-text__level" :style="{ backgroundColor: itemModel.aqiColor }">
            {{ itemModel.classLevel || '--------' }}
          </div>
          <div class="main-text__name"><span>AQI</span></div>
        </div>
      </div>
      <div class="footer">
        <el-row class="fill-h">
          <el-col :span="24" :h="6">
            <div class="footer-text">
                <div class="fl">首要污染物：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <template v-if="!!primaryPollutant.length">
                  <div class="fl" v-for="(item, index) in primaryPollutant" :key="index">
                    <span>{{item.name}}</span>
                    <span v-if="!(index === (primaryPollutant.length - 1))">,&nbsp;&nbsp;</span>
                  </div>
                </template>
                <template v-else> --- </template>
            </div>
          </el-col>
          <el-col :span="24" :h="6">
            <div class="footer-text">
              <div class="fl">浓度值：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                <template v-if="!!primaryPollutant.length">
                  <div class="fl" v-for="(item, index) in primaryPollutant" :key="index">
                    <span>{{ item.value }}</span>&nbsp;<span>{{ item.unit }}</span>
                    <span v-if="!(index === (primaryPollutant.length - 1))">,&nbsp;&nbsp;</span>
                  </div>
                </template>
                <template v-else> --- </template>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-col>
    <el-col :span="11" class="box-right">
      <div class="image"><img :src="imgUrl"></div>
      <div class="toolpit" :style="{ borderColor: itemModel.aqiColor }">
        <div class="toolpit-content">
          {{ itemModel.healthEffect || '--' }}
        </div>
        <div class="toolpit-title" :style="{ background: itemModel.aqiColor }">对健康的影响：</div>
      </div>
      <div class="toolpit" :style="{ borderColor: itemModel.aqiColor }">
        <div class="toolpit-content">{{ itemModel.takeStep || '--' }}</div>
        <div class="toolpit-title" :style="{ background: itemModel.aqiColor }">建议采取的措施：</div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  porps: {
    airQualityData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imgUrl: '',
      itemModel: {
      },
    };
  },
  computed: {
    primaryPollutant() {
      return this.itemModel.primaryPollutant || [];
    },
  },
  methods: {
    createQuery() {
      this.getAQIData();
    },
    getAQIData() {
      this.$http.get('airquality/regionHourAQI/realtimeAQI')
        .then((response) => {
          if (response.status === 200) {
            this.itemModel = response.data.data;
            this.isImgUrl(this.itemModel.realtimeAQI || 0);
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        });
    },
    isImgUrl(val) {
      const num = +val;
      let url = '';
      if (num <= 50) {
        url = 'img/airbaby/1.png';
      } else if (num > 50 && num <= 100) {
        url = 'img/airbaby/2.png';
      } else if (num > 100 && num <= 150) {
        url = 'img/airbaby/3.png';
      } else if (num > 150 && num <= 200) {
        url = 'img/airbaby/4.png';
      } else if (num > 200 && num <= 300) {
        url = 'img/airbaby/5.png';
      } else if (num > 300) {
        url = 'img/airbaby/6.png';
      }
      this.imgUrl = url;
    },
  },
};
</script>

<style lang="scss" scoped>
.fl{
  float: left;
  height: 25px;
  line-height: 25px;
  white-space: nowrap !important;
  >div{
    display: inline-block;
  }
}
.fill-wh{
  width: 100%;
  height: 100%;
}
.box{
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  .box-left{
    // @extend .fill-wh;
    display: flex;
    flex-direction: column;
    position: relative;
    .header{
      flex: 2;
      display: flex;
      width: 100%;
      font-size: 28px;
      align-items: center;
      padding: 2px 15px 2px 60px;
      color: #37a2da;
      >div:nth-child(1){
        flex: 1;
      }
      >div:nth-child(2){
        font-size: 15px;
        height: 30px;
        line-height: 3;
        color: #e6b907;
      }
    }
    .main{
      flex: 4;
      display: flex;
      align-items: center;
      .main-num{
        flex: 1;
        padding: 0 0 0 50px;
        font-size: 88px;
      }
      .main-text{
        font-weight: bold;
        padding: 8px 40px 0 0;
        text-align: center;
        .main-text__level{
          display: inline-block;
          border-radius: 4px;
          padding: 4px 8px;
          color: #fff;
          font-size: 18px;
        }
        .main-text__name{
          text-align: center;
          margin-top: 5px;
          font-size: 16px;
        }
      }
    }
    .footer{
      flex: 4;
      width: 100%;
      font-size: 18px;
      padding: 5px 0 0 45px;
      .footer-text{
        height: 100%;
        min-height: 30px;
        align-items: center;
      }
      span{
        font-size: 18px;
        white-space: nowrap;
      }
    }
  }

  // .toolpit{
  //   padding: 5px 10px 0;
  //   .toolpit-title{
  //     font-weight: bold;
  //     font-size: 15px;
  //     padding: 0 2px;
  //     color: #409eff;
  //   }
  //   .toolpit-content{
  //     font-size: 13px;
  //     padding: 5px 16px 5px 12px;
  //   }
  // }
  .box-right{
    text-align: right;
    .image{
      text-align: center;
      display: inline-block;
      // border: 1px solid red;
      margin: 15px 30px 0px 0px;
      width: 226px;
      height: 90px;
      border-radius: 5px;
      overflow: hidden;
      >img{
        line-height: 0;
        // @extend .fill-wh;
      }
    }
    .toolpit{
      text-align: left;
      display: inline-block;
      border: 1px solid yellow;
      width: 226px;
      margin: 10px 30px 0 0;
      font-size: 12px;
      .toolpit-content{
        height: 60px;
        padding: 8px 4px;
      }
      .toolpit-title{
        padding: 0 5px;
        height: 20px;
        line-height: 20px;
        background: rgb(170, 170, 5);
        color: #fff;
      }
  }
  }
}
</style>
