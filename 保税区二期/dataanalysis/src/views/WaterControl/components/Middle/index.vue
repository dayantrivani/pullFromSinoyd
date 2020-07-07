<template>
  <div class="Middle">
    <box-border style="height: 0.4rem;">
      <div class="top">
        <img src="../../../../assets/img/WaterControl/iconData.png" alt="图片加载失败">
        <div>
          <div class="title">当日数据排放情况</div>
          <div>数据时间：2019/12/25 12:30</div>
          <div>COD：50/<span class="text-danger">80</span></div>
          <div>TP：20/<span class="text-danger">35</span></div>
        </div>
      </div>
    </box-border>
    <div class="main">
      <div class="bg"></div>
      <div class="content">
        <div class="title">污水厂实时监测</div>
        <el-row>
          <el-col :span="12" v-for="(item, index) in itemList" :key="index">
            <tt class="label">{{item.label}}：</tt>
            <span class="value">{{item.value}}</span>
            <span class="unit">{{item.unit}}</span>
          </el-col>
        </el-row>
        <div>
          <span style="font-weight: 500;color: #fff;">实时阀门状态：</span>
          <el-switch
            v-model="value1"
            inactive-value="true"
            active-value="false"
            inactive-color="#13ce66"
            active-color="#ccc">
          </el-switch>
        </div>
        <p>数据时间：2019/12/25 13:00</p>
      </div>
    </div>
  </div>
</template>

<script>
import BoxBorder from './components/box-border';

export default {
  name: 'Middle',
  components: {
    BoxBorder,
  },
  data() {
    return {
      value1: true,
      itemList: [
        {
          label: 'pH',
          value: '7',
          unit: '无量纲',
        },
        {
          label: 'COD',
          value: '15',
          unit: 'mg/L',
        },
        {
          label: 'NH',
          value: '15',
          unit: 'mg/L',
        },
        {
          label: 'TP',
          value: '0.5',
          unit: 'mg/L',
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.Middle {
  height: 100%;
  user-select: none;
  .top {
    height: 0.4rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 0.12rem;
    color: #fff;
    .title {
      color: #40bff4;
    }
    >img {
      padding: 0 0.1rem;
    }
    >div {
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      >div {
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  .main {
    margin-top: 0.05rem;
    position: relative;
    height: calc(100% - 0.45rem);
    .bg {
      width: 2.5rem;
      height: 100%;
      background-image: url('../../../../assets/img/WaterControl/bg-logo.png');
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .content {
      position: absolute;
      left: 2rem;
      top: 0.78rem;
      width: 3rem;
      height: 300px;
      font-size: 0.12rem;
      line-height: 0.28rem;
      padding: 0.2rem 0.4rem;
      background-image: url('../../../../assets/img/WaterControl/bg-data.png');
      background-repeat: no-repeat;
      background-size: 100%;
      .title {
        font-size: 0.16rem;
        color: #16adee;
      }
      .label {
        display: inline-block;
        width: 0.45rem;
        text-align: right;
      }
      .value {
        font-size: 0.18rem;
        color: #00ff06;
      }
      >p {
        text-align: right;
      }
    }
  }
}
</style>
