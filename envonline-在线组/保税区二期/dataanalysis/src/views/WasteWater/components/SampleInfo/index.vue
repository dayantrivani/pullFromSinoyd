<template>
<!-- 右边 排口留样信息 -->
  <div class="SampleInfo">
    <div class="icon-title">
      <i class="icon-sample"></i>
      <span class="mar-l-sm">采样信息</span>
    </div>
    <div class="info-form">
      <p class="width-50"><span class="label">已留样瓶数：</span> 20</p>
      <p class="width-50"><span class="label">剩余瓶数：</span> 4</p>
      <p class="width-50"><span class="label">留样瓶号：</span> 24</p>
      <p class="width-50"><span class="label">留样瓶数：</span> 6</p>
      <p class="width-50"><span class="label">留样量：</span> 60ml</p>
      <p class="width-50" :style="{ color: '#f79e12' }"><span class="label">采样方式：</span> 超标</p>
      <p><span class="label">留样时间：</span> 2019/12/19 12:00</p>
      <p><span class="label">留样瓶：</span> 5, 6, 7, 8, 9, 20</p>
      <p><span class="label">超标信息：</span> COD, 85mg/L</p>
    </div>
    <div class="icon-title">
      <i class="icon-control"></i>
      <span class="mar-l-sm">控制面板</span>
    </div>
    <el-form class="control-form" label-width="0.9rem" inline>
      <el-row class="nowrap">
        <el-col :span="9">
          <el-form-item label="留样瓶数：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="混合量(ml)：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-center">
          <el-form-item>
            <el-button class="round-button" round style="padding-left: 0.15rem;padding-right: 0.15rem;">立即采样</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <hr/>
      <el-row class="nowrap">
        <el-col :span="9">
          <el-form-item label="定时时间：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="留样瓶数：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="混合量(ml)：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :offset="9" class="text-center">
          <el-form-item>
            <el-button class="round-button" round>定时采样</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <hr/>
      <el-row class="nowrap">
        <el-col :span="9">
          <el-form-item label="因子选择：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label-width="1.1rem" label="留样间隔(小时)：">
            <el-input style="width: calc(100% - 1.1rem)"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="留样瓶数：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="混合量(ml)：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="超标限制：">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="~" class="text-center">
            <el-input style="width: 0.8rem"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="text-center">
          <el-form-item>
            <el-button class="round-button" round>超标留样设置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <hr/>
    </el-form>
    <div class="sample-record">
      <div class="title text-center">
        <span :class="{ active: isRemote }" @click="onClickRemote(true)">远程留样记录</span>
        <span :class="{ active: !isRemote }" @click="onClickRemote(false)">超标留样记录</span>
      </div>
      <el-table
        class="yd-table"
        header-cell-class-name="yd-table-cell"
        height="calc(100% - 0.3rem)"
        :data="itemList"
      >
        <el-table-column align="center" label="排口名称" prop="regionName" min-width="85" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="任务编号" prop="psName" min-width="69" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="时间点" prop="psName" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="样品类型" prop="psName" min-width="68" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="采样瓶数" prop="psName" min-width="68" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="瓶号" prop="psName" min-width="68" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SampleInfo',
  data() {
    return {
      isRemote: true,
      itemList: [{
        psName: 1,
      }, {
        psName: 2,
      }, {
        psName: 3,
      }, {
        psName: 4,
      }, {
        psName: 5,
      }, {
        psName: 6,
      }, {
        psName: 7,
      }],
    };
  },
  methods: {
    onClickRemote(isRemote) {
      this.isRemote = isRemote;
    },
  },
};
</script>

<style lang="scss" scoped>
.SampleInfo {
  height: 100%;
  width: 100%;
  padding-left: 0.1rem;
  padding-top: 0.1rem;
  background: url('../../../../assets/img/WasteWater/bg-sample.png') no-repeat;
  background-position: top right;
  .icon-title {
    padding-bottom: 0.1rem;
    color: #009ffe;
    font-size: 0.16rem;
    font-weight: bold;
    >i {
      display: inline-block;
      width: 0.26rem;
      height: 0.26rem;
      background-size: cover;
      vertical-align: middle;
    }
    .icon-sample {
      background: url('../../../../assets/img/WasteWater/icon-sample.png') no-repeat;
    }
    .icon-control {
      background: url('../../../../assets/img/WasteWater/icon-control.png') no-repeat;
    }
  }
  .info-form {
    width: 55%;
    .width-50 {
      width: 50%;
    }
    >p {
      display: inline-block;
      line-height: 0.25rem;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
    }
    .label {
      display: inline-block;
      width: 0.8rem;
      margin-left: 0.05rem;
      color: #accee8;
      text-align: right;
    }
  }
  .control-form {
    >hr {
      background-color: #3b90da81;
    }
    .el-form-item {
      margin: 0.05rem 0;
    }
  }
  .sample-record {
    margin-top: 0.1rem;
    height: calc(100% - 5rem);
    .title {
      padding-bottom: 0.05rem;
      font-size: 0.16rem;
      font-weight: bold;
      >span {
        padding-left: 0.2rem;
        padding-right: 0.2rem;
        position: relative;
        cursor: pointer;
        &.active {
          color: #009ffe;
          &::after {
            content: '';
            position: absolute;
            bottom: -5px;
            height: 2px;
            width: 0.8rem;
            left: 50%;
            transform: translateX(-50%);
            background-color: #009ffe;
          }
        }
      }
    }
    .yd-table {
      width: 100%;
      // height: calc(100% - 0.3rem);
      background-color: transparent;
      border: none;
      &::before {
        content: none;
      }
    }
  }
  .nowrap {
    white-space: nowrap;
  }
  .text-center {
    text-align: center;
  }
  .round-button {
    background-color: #12a1f7;
    color: #fff;
    border-color: transparent;
    width: 0.9rem;
    box-sizing: border-box;
    &:active {
      background-color: #12afff;
      border-color: #12afff;
    }
  }
}
</style>

<style lang="scss">
.SampleInfo{
  label.el-form-item__label {
    color: #accee8;
    font-weight: 600;
    padding-right: 0;
  }
  .text-center {
    label.el-form-item__label {
      text-align: center;
    }
  }
  .yd-table {
    th, tr, .yd-table-cell {
      background-color: transparent;
      color: #fff;
      font-weight: 600;
    }
    tr:hover {
      >td {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
