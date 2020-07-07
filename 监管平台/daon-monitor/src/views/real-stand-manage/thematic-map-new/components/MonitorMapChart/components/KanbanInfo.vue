<template>
  <div style="z-index: 1000;color: #fff;">
    <div style="width:100%;height:100%;" class="kanban-info-ctr">
      <el-row>
        <el-col :span="16" class="kanban-info-tl">{{factorData.name}}</el-col>
        <el-col :span="8" class="kanban-info-tr">报警</el-col>
      </el-row>
      <span class="point-info-address">{{factorData.address}}</span>
      <div style="display: flex;flex-flow: row wrap; align-content: flex-start;width: 100%;">
        <div v-for="(item, i) in factorData.pointData" :key="i" class="point-refer-ctr">
            <div class="refer-header">
              <span class='refer-header-top1'>{{item.name}}</span>
              <span class='refer-header-top2'>{{item.unit}}</span>
            </div>
            <div class="refer-value">{{item.value}}</div>
            <div class="refer-footer">
              <span>{{item.type}}</span>
              <span>{{item.mdeValue}}</span>
            </div>
        </div>
      </div>
      <div class="supervisor-info-ctr">
        <div>
            <i class="el-icon-warning-outline" style="color: #C57231"></i>
          {{factorData.supervisionData[0].time}}
          <span style="color: #AD4269;float: right;"><i class="el-icon-time"></i> {{factorData.supervisionData[0].type}}</span>
        </div>
        <div>
          <p>{{factorData.supervisionData[0].message}}</p>
        </div>
      </div>
      <div>
        <span style="float: right;margin-right: .5rem;"> <i class="el-icon-s-custom" style="color: #2193BD"></i> 监理</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getFactor } from '@/api/modules/thematic-map.js';

export default {
  name: 'KanbanInfo',
  data() {
    return {
      factorData: {
        address: '张家港市杨舍镇国泰北路15号',
        isAlarm: false,
        name: '大邦纺织废水',
        pointData: [
          {
            name: 'COD',
            unit: 'mg/m3',
            type: '标准',
            value: '36.25',
            mdeValue: '15.33',
          },
          {
            name: '氨气',
            unit: 'mg/m3',
            type: '标准',
            value: '36.25',
            mdeValue: '15.33',
          },
          {
            name: '总磷',
            unit: 'mg/m3',
            type: '标准',
            value: '36.25',
            mdeValue: '15.33',
          },
          {
            name: '总氮',
            unit: 'mg/m3',
            type: '标准',
            value: '36.25',
            mdeValue: '15.33',
          },
          {
            name: 'pH',
            unit: 'mg/m3',
            type: '标准',
            value: '36.25',
            mdeValue: '15.33',
          },
        ],
        supervisionData: [
          {
            time: '2020-03-25 02:10:35',
            type: '余3小时',
            message:
              '大邦纺织废水【COD在线分析仪】发生浓度超标报警发生浓度超标报警',
          },
        ],
      },
      stationData: [
        {
          name: '大邦纺织废水',
          address: '张家港市杨舍镇国泰北路15号',
          police: {
            time: '2020-03-25 02:10:35',
            type: '余3小时',
            message:
              '大邦纺织废水【COD在线分析仪】发生浓度超标报警发生浓度超标报警',
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
      ],
    };
  },
  methods: {
    getFactorData(id) {
      getFactor(id).then((res) => {
        if (res.data.success && res.data.code === 200) {
          console.log(res);
        //   this.factorData = res.data.data;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="scss">
$blue: rgba(106, 186, 238, 1);
$gray: rgba(152, 159, 181, 1);
.kanban-info-ctr {
    color: white;
  .kanban-info-tl {
    font-size: 0.8rem;
    color: $blue;
    line-height: 1.5rem;
    font-weight: bold;
  }
  .kanban-info-tr {
    background-image: url("~@/assets/img/police_bg.png");
    background-size: 100% 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    color: #C57231;
    font-weight: bold;
  }
  .point-info-address {
      color: $gray;
      margin-top: .1rem;
      margin-bottom: .2rem;
  }
  .point-refer-ctr {
     flex: 0 0 46%;
     border: 1px solid $blue;
     border-radius: .5rem;
     margin: .2rem;
     padding: .2rem;
     height: 2.8rem;
     >div{
         margin: .15rem;
     }
     >.refer-header {
         >.refer-header-top1 {
             font-weight: bold;
         }
         >.refer-header-top2 {
             color: $gray;
             font-size: 12px;
             float: right;
         }
     }
     >.refer-value {
         font-size: .8rem;
         color:rgba(106, 186, 238, 1);
         font-weight: bold;
     }
     >.refer-footer {
         font-size: .55rem;
         >span:first-child {
             color: $gray;
         }
         >span:last-child {
             float: right;
         }
     }
  }
  .supervisor-info-ctr {
      margin-top: .5rem;
      height: 2rem;
      padding: .2rem;
  }
}
</style>
