<template>
  <el-card type="title">
    <template slot="header">
      <div class="fn-left">实时水质状态</div>
      <div class="fn-right">{{ new Date().toLocaleDateString() }}</div>
    </template>
    <el-row class="fill-h" type="flex" justify="center" align="middle">
      <el-col class="fill-auto">
        <el-row :gutter="10" class="pad-y-sm">
          <el-col :span="12" class="text-center class-title">点位名称</el-col>
          <el-col :span="12" class="text-center class-title">水质类别</el-col>
        </el-row>
        <el-row
          v-for="item in waterData"
          :key="item.portId"
          :gutter="10"
          class="pad-y-sm"
        >
          <el-col :span="12" class="text-center">{{ item.portName }}</el-col>
          <el-col :span="12" class="text-center">
            <div class="bar-style" :style="{ 'background-color': item.color }">{{ item.classLevel }}</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'WaterClassification',
  mixins: [],
  components: {},
  data() {
    return {
      waterData: [],
    };
  },
  created() {
    this.getWaterData();
  },
  watch: {},
  methods: {
    // 获取图表数据
    getWaterData() {
      this.$http.get('surfacewater/infectantBy60/realTimeWQL')
        .then((response) => {
          if (response.data.success) {
            this.waterData = response.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
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
  .bar-style {
    display: inline-block;
    width: 20%;
    height: 18px;
    color: #000;
  }
  .class-title {
    font-size: 18px;
    font-weight: bold;
  }
</style>
