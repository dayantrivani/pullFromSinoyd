<!-- 实时报警记录 -->
<template>
  <div class="real-time-alarm">
    <div class="header">
      <div class="title">园区报警实时记录</div>
      <ul class="port-type">
        <li
          v-for="(item, index) in ['全部', '废水', '废气', '环境空气', '地表水', '雨水', 'LDAR']"
          :key="index"
          :title="item"
          :class="{ active: item === activeName }"
          @click="activeName = item;activeIndex = index"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <el-scrollbar style="height: 100%">
      <ul class="alarm-list">
        <li v-for="(item, index) in itemList[activeIndex]" :key="index" :class="`icon-${item.portType}`">
          <p class="psName">{{item.portName}}<span class="fn-right fn-clear text-info">{{item.alarmTstamp || item.createDate}}</span></p>
          <p class="alarm-info">{{item.alarmContent}}</p>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { analyzeResp, getDay } from '@/libs/util';

export default {
  name: 'RealTimeAlarm',
  data() {
    return {
      activeName: '全部',
      activeIndex: 0,
      itemList: [], // 处理后数据集合， 0索引为全部种类，页面循环数据源
      dataList: [], // 接口返回数据集合
    };
  },
  watch: {
    dataList: {
      handler(val) {
        this.itemList = [...val];
        this.$set(this.itemList, 0, val.flat(Infinity)
          .sort((m, n) => new Date(n.alarmTstamp).getTime() - new Date(m.alarmTstamp).getTime()).slice(0, 20));
      },
      deep: true,
    },
  },
  created() {
    this.getItemList();
  },
  methods: {

    // 请求事件
    // 查询趋势数据
    getItemList() {
      this.getWaterData();
      this.getGasData();
      this.getAirqualityData();
      this.getSurfacewaterData();
      this.getRainData();
      this.getLdarData();
    },
    // 获取废水数据
    getWaterData() {
      this.$http.get('amcs/gis/alarmrecord', {
        params: {
          portType: 1,
          fromDate: getDay(-1, false),
          toDate: getDay(),
          alarmTypeCode: 'AlarmOverProofDay,AlarmOverProofHour,AlarmOverProofMinute',
          page: 1,
          rows: 20,
          sort: 'alarmTstamp-',
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 1 }));
          this.$set(this.dataList, 1, data || []);
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
    // 获取废气数据
    getGasData() {
      this.$http.get('amcs/gis/alarmrecord', {
        params: {
          portType: 2,
          fromDate: getDay(-1, false),
          toDate: getDay(),
          alarmTypeCode: 'AlarmOverProofDay,AlarmOverProofHour,AlarmOverProofMinute',
          page: 1,
          rows: 20,
          sort: 'alarmTstamp-',
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 2 }));
          this.$set(this.dataList, 2, data || []);
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
    // 获取环境空气数据
    getAirqualityData() {
      this.$http.get('airquality/gis/alarmrecord', {
        params: {
          fromDate: getDay(-1, false),
          toDate: getDay(),
          alarmTypeCode: 'Hsp,LSp',
          page: 1,
          rows: 20,
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 3 }));
          this.$set(this.dataList, 3, data || []);
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
    // 获取地表水数据
    getSurfacewaterData() {
      this.$http.get('surfacewater/gis/alarmrecord', {
        params: {
          fromDate: getDay(-1, false),
          toDate: getDay(),
          alarmTypeCode: 'Hsp,LSp,WaterQualityGradesDownAlarm',
          page: 1,
          rows: 20,
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 4 }));
          this.$set(this.dataList, 4, data || []);
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
    // 获取雨水数据
    getRainData() {
      this.$http.get('amcs/gis/alarmrecord', {
        params: {
          portType: 5,
          fromDate: getDay(-1, false),
          toDate: getDay(),
          alarmTypeCode: 'AlarmRainOverProof',
          page: 1,
          rows: 20,
          sort: 'alarmTstamp-',
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 5 }));
          this.$set(this.dataList, 5, data || []);
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
    // 获取Ldar数据
    getLdarData() {
      this.$http.get('ldar/alarmRecord', {
        params: {
          fromTime: getDay(-1, true, false),
          toTime: getDay(0, true, true),
          sort: 'createDate-',
          page: 1,
          rows: 20,
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 6 }));
          this.$set(this.dataList, 6, data || []);
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
  },
};
</script>

<style lang="scss" scoped>
.real-time-alarm {
  height: 100%;
  .header {
    min-height: 1rem;
    padding: 0.2rem 0 0 0.6rem;
    background: {
      image: url('../../../assets/image/alarm.png');
      size: contain;
      repeat: no-repeat;
    };
    .title {
      font-size: 0.16rem;
      margin-left: 0.2rem;
      color: #dfc13b;
    }
    .port-type {
      margin-top: 0.1rem;
      white-space: nowrap;
      overflow-x: scroll;
      >li {
        width: auto;
        margin: 0 0.1rem;
        display: inline-block;
        cursor: pointer;
        &.active {
          color: #dfc13b;
        }
        &::after {
          content: '';
          display: block;
          width: 0.1rem;
          height: 0.05rem;
        }
      }
    }
  }
  ul.alarm-list>li {
    &:not(.header) {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-top: 0.1rem;
      min-height: 0.85rem;
      background: {
        image: url('../../../assets/image/alarmBlock.png');
        size: contain;
        repeat: no-repeat;
        position: 0 0.2rem;
      };
      .psName {
        font-size: 0.14rem;
        margin-left: 0.6rem;
        color: #dfc13b;
        >span {
          font-size: 0.12rem;
        }
      }
      .alarm-info {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 0.14rem;
        margin-left: 0.8rem;
      }
      @for $i from 1 through 6 {
        &.icon-#{$i}::after {
          content: url('../../../assets/image/#{$i}.svg');
          width: 0.24rem;
          height: 0.24rem;
          position: absolute;
          top: 45%;
          left: 4%;
        }
      }
    }
  }
}
</style>
