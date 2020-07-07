<!-- 实时报警记录 -->
<template>
  <div class="bs-real-time-alarm">
    <el-scrollbar style="height: 100%">
      <ul class="alarm-list">
        <li class="header">
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
        </li>
        <li v-for="(item, index) in itemList[activeIndex]" :key="index" :class="`icon-${item.portType}`">
          <p class="psName">{{item.portName}}<span class="fn-right fn-clear text-info">{{item.alarmTstamp}}</span></p>
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
      itemList: [],
    };
  },
  created() {
    this.getItemList();
  },
  methods: {

    // 请求事件
    // 查询趋势数据
    getItemList() {
      const arr = new Array(20).fill({
        id: 'E6FBDF70-554E-4E68-8814-535E0D3EDF8A',
        portId: '909c8ede-d830-4516-818c-549a933f0230',
        portName: '渡口桥站',
        alarmTstamp: '2020-01-21 12:00:00',
        alarmContent: '渡口桥站[2020-01-21 12:00:00][总氮][3.1660]超出上限值[1.000]',
        factorCode: 'w21001',
        factorName: '总氮',
        factorValue: '3.1660',
        alarmTypeName: '超上限',
        alarmTypeCode: 'Hsp',
        alarmLevel: '二级',
        upperValue: '',
        lowValue: '',
      });
      this.$set(this.itemList, 1, arr.map(n => ({
        ...n,
        alarmTstamp: `2020-01-21 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
        portType: 1,
      })));
      this.$set(this.itemList, 2, arr.map(n => ({
        ...n,
        alarmTstamp: `2020-01-21 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
        portType: 2,
      })));
      this.$set(this.itemList, 3, arr.map(n => ({
        ...n,
        alarmTstamp: `2020-01-21 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
        portType: 3,
      })));
      this.$set(this.itemList, 4, arr.map(n => ({
        ...n,
        alarmTstamp: `2020-01-21 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
        portType: 4,
      })));
      this.$set(this.itemList, 5, arr.map(n => ({
        ...n,
        alarmTstamp: `2020-01-21 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
        portType: 5,
      })));
      this.$set(this.itemList, 6, arr.map(n => ({
        ...n,
        alarmTstamp: `2020-01-21 ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
        portType: 6,
      })));
      this.$set(this.itemList, 0, this.itemList.flat(Infinity)
        .sort((m, n) => new Date(n.alarmTstamp).getTime() - new Date(m.alarmTstamp).getTime()).slice(0, 20));
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
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 1 }));
          this.$set(this.itemList, 1, data || []);
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
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 2 }));
          this.$set(this.itemList, 2, data || []);
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
          this.$set(this.itemList, 3, data || []);
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
          this.$set(this.itemList, 4, data || []);
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
          alarmTypeCode: 'AlarmOverProofDay,AlarmOverProofHour,AlarmOverProofMinute',
          page: 1,
          rows: 20,
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 5 }));
          this.$set(this.itemList, 5, data || []);
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
    getLdarData() {
      this.$http.get('ldar/alarmRecord', {
        params: {
          fromDate: getDay(-1, false),
          toDate: getDay(),
          sort: 'createDate-',
          page: 1,
          rows: 20,
        },
      }).then((response) => {
        if (response.data.success) {
          const data = response.data.data.map(n => ({ ...n, portType: 6 }));
          this.$set(this.itemList, 6, data || []);
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
.bs-real-time-alarm {
  height: 100%;
  ul.alarm-list>li {
    &.header {
      min-height: 1rem;
      padding: 0.2rem 0 0 0.6rem;
      background: {
        image: url('../../../assets/image/bsAlarm.png');
        size: cover;
        repeat: no-repeat;
      };
      .title {
        font-size: 0.25rem;
        margin-left: 0.5rem;
        color: #dfc13b;
      }
      .port-type {
        margin-top: 0.1rem;
        white-space: nowrap;
        font-size: 0.25rem;
        overflow-x: scroll;
        >li {
          width: auto;
          margin: 0 0 0  0.5rem;
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
    &:not(.header) {
      position: relative;
      display: flex;
      flex-direction: column;
      margin-top: 0.3rem;
      min-height: 1.3rem;
      background: {
        image: url('../../../assets/image/bsAlarmBlock.png');
        size: cover;
        repeat: no-repeat;
        position: 0 0.05rem;
      };
      .psName {
        font-size: 0.25rem;
        margin-top: -0.2rem;
        margin-left: 1rem;
        color: #dfc13b;
        >span {
          font-size: 0.25rem;
        }
      }
      .alarm-info {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 0.25rem;
        margin-left: 1.2rem;
      }
      @for $i from 1 through 6 {
        &.icon-#{$i}::after {
          content: url('../../../assets/image/#{$i}.svg');
          width: 0.4rem;
          height: 0.4rem;
          position: absolute;
          top: 0%;
          left: 5%;
        }
      }
    }
  }
}
</style>
