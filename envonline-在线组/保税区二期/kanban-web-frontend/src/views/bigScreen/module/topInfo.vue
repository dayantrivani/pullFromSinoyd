<template>
  <el-row>
    <el-col :span="7">
      <el-row>
        <el-col :span="8">
          <div>
            <embed :src="iconLeft"
                   style="width:3.5rem;height:1.5rem;margin-left:1rem;"
                   alt="" />
          </div>
        </el-col>
        <el-col :span="8"><span style="font-size:0.4rem;padding-left:1.5rem;">环境质量</span></el-col>
        <el-col :span="8">
          <div>
            <embed :src="iconRight"
                   style="width:3.5rem;height:1.5rem;margin-right:2rem;"
                   alt="" />
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="8">
      <div style="float:left;margin-top:0.4rem;margin-right:0.1rem;"
           :key="index"
           v-for="(item,index) in aqiData.primaryPollutant">
        <div style="font-size:0.4rem;float:right">{{item.value}}</div>
        <div style="font-size:0.25rem;">{{item.name}}</div>
      </div>
      <div style="float:left;margin-top:0.4rem;width: 0.05rem;height: 0.8rem; background: white;"></div>
      <div style="float:left;">
        <i class="el-icon-position"
           style="font-size:0.3rem;">保税区</i>
        <div style="font-size:0.2rem;">{{aqiData.classLevel}}</div>
      </div>
    </el-col>
    <el-col :span="9">
      <div style="margin-top:0.4rem;float:left;">
        <div style="font-size:0.4rem;">
          {{date.getHours()>9?date.getHours():"0"+date.getHours()}}:{{date.getMinutes()>9?date.getMinutes():"0"+date.getMinutes()}}:{{date.getSeconds()>9?date.getSeconds():"0"+date.getSeconds()}}
        </div>
        <div style="font-size:0.25rem;padding-left:0.05rem;">
          {{date.getFullYear()}}.{{date.getMonth()>8?date.getMonth()+1:"0"+(date.getMonth()+1)}}.{{date.getDate()>9?date.getDate():"0"+date.getDate()}}
        </div>
      </div>
      <div style="float:left;margin-top:0.4rem;margin-left:0.1rem;width: 0.05rem;height: 0.8rem; background: white;"></div>
      <div style="float:left;">
          <embed :src="weatherUrl"
             style="width:1.5rem;height:1.5rem;"
             alt="" />
      </div>
      <div style="font-size:0.4rem;float:left;margin-top:0.5rem;">19℃</div>
    </el-col>
  </el-row>
</template>

<script>
import titleLeft from '@/assets/image/titleLeft.svg';
import titleRight from '@/assets/image/titlrRight.svg';
import clear from '@/assets/image/晴.svg';
import PartlyCloudy from '@/assets/image/晴转多云.svg';
import cloud from '@/assets/image/云.svg';
import overcast from '@/assets/image/夜晚.svg';


export default {
  name: 'topInfo',
  data() {
    return {
      aqiData: {},
      weatherUrl: clear,
      date: new Date(),
      iconLeft: titleLeft,
      iconRight: titleRight,
    };
  },
  created() {
    this.getRedisAQI();
  },
  mounted() {
    const _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.date = new Date(); // 修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    // 获取AQI
    getRedisAQI() {
      //   this.$http.get('redis/AirQualityRealTimeAir_s').then((response) => {
      //     if (response.status === 200 && response.data.success) {
      //       this.aqiData = response.data.data;
      //       this.aqiDataProcess(this.aqiData);
      //     } else {
      //       this.$message.warning({
      //         message: response.data.msg,
      //         duration: 3000,
      //         showClose: true,
      //       });
      //     }
      //   }, ({ response }) => {
      //     analyzeResp(response);
      //   });
      this.aqiData = {
        'realtimeAQI': '190', // 实时AQI值
        'dataTime': '2020年01月20日 15时', // 数据时间
        'primaryPollutant': [// 首要污染物,可能多个PM10,PM2.5
          {
            'unit': 'μg/m³', // 污染物单位
            'name': 'PM2.5', // 污染物名称
            'value': '25', // 污染物值
          }],
        'classLevel': '严重污染', // 优  良  轻度污染  中度污染 重度污染  严重污染
        'aqiColor': '#01E401', // 优  #01E401 良  #E2D100 轻度污染 #FF7E00 中度污染 #FE0000 重度污染 #98004B 严重污染 #7E0123
        'healthEffect': '进一步加剧易感人群症状，可能对健康人群心脏、呼吸系统有影响',
        'takeStep': '建议采取的措施',
      };
    },
    // 水图标
    getIconWeather(item) {
      if (item.water === '100') {
        return clear;
      } if (item.water === '101') {
        return cloud;
      } if (item.water === '102') {
        return cloud;
      } if (item.water === '103') {
        return PartlyCloudy;
      } if (item.water === '104') {
        return overcast;
      }
      return '';
    },
  },
};
</script>
