<template>
<!-- 表单展示内容 -->
<el-form ref="form" :model="itemModel" label-width="117px">
  <div class="mar-t-xs pad-b-lg">
    <!-- 诉求人基本信息 -->
    <div class="title-info mar-l-sm mar-t-xs">诉求人基本信息</div>
    <!-- 表单展示内容 -->
    <el-row class="pad-x-sm">
      <el-col :span="24">
        <el-row class="mar-y-xs">
          <el-col :span="6">
            <el-form-item label="服务对象：">
              <span>{{itemModel.petitionerName}}</span>
              <!-- <span style="float: right;" class="pad-r-xs">先生</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来电号码：">
              <span>{{itemModel.petitionerCallerPhone}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别：">
              <span>{{itemModel.petitionerSex}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="联系电话：">
              <span>{{itemModel.petitionerContactPhone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="6">
            <el-form-item label="年龄范围：">
              <span>{{itemModel.petitionerAge}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="住址：">
              <span>{{itemModel.petitionerAddress}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <div class="mar-t-xs pad-b-lg">
    <!-- 工单详情 -->
    <div class="title-info mar-l-sm mar-t-xs">工单详情</div>
    <!-- 表单展示内容 -->
    <el-row class="pad-x-sm">
      <el-col :span="24">
        <el-row class="mar-y-xs">
          <el-col :span="6">
            <el-form-item label="本地诉求类型：">
              <span>{{itemModel.type}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="受理时间：">
              <span>{{itemModel.acceptTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="情绪诉求：">
              <span>{{itemModel.moodAppeal}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="事发时间：">
              <span>{{itemModel.occurrenceTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="6">
            <el-form-item label="来源渠道：">
              <span>{{itemModel.source}}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="所属区域：">
              <span>{{itemModel.regionName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="经度：">
              <span>{{itemModel.psLongitude}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="纬度：">
              <span>{{itemModel.psLatitude}}</span>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="24">
            <el-form-item label="标题：">
              <span>{{itemModel.title}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="24">
            <el-form-item label="目的：">
              <span>{{itemModel.purpose}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="24">
            <el-form-item label="诉求内容：">
              <el-input
                type="textarea"
                :rows="3"
                v-model="itemModel.appealContent"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="24">
            <el-form-item label="归口类型：">
              <span>{{itemModel.belongType}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="6">
            <el-form-item label="事件发生地：">
              <span>{{itemModel.occurrencePlace}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="具体地址：">
              <span>{{itemModel.exactAddress}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否保密：">
              <span>{{itemModel.isSecrecy}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="紧急程度：">
              <span>{{itemModel.urgentLevel}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="6">
            <el-form-item label="是否回访：">
              <span>{{itemModel.isReturnVisit}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="市民满意度：">
              <span>{{itemModel.citizenSatisfaction}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="态度满意度：">
              <span>{{itemModel.mannerSatisfaction}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="中心满意度：">
              <span>{{itemModel.centerSatisfaction}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="mar-b-xs">
          <el-col :span="24">
            <el-form-item label="市民评价意见：">
              <span>{{itemModel.citizenEvaluation}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
  <div class="mar-t-xs pad-b-lg">
    <!-- 处办时限要求 -->
    <div class="title-info mar-l-sm mar-t-xs">处办时限要求</div>
    <!-- 表单展示内容 -->
    <el-row class="pad-x-sm">
      <el-col :span="24">
        <el-row class="mar-y-xs">
          <el-col :span="6">
            <el-form-item label="签收截止时间：">
              <span>{{itemModel.acceptEndTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="签收时间：">
              <span>{{itemModel.acceptTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="要求反馈时间：">
              <span>{{itemModel.processEndTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="剩余反馈时间：">
              <span>{{itemModel.remainingFeedbackTime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</el-form>
</template>

<script>
export default {
  name: 'itemInfo',
  props: {
    item: {
      default: {},
    },
  },
  data() {
    return {};
  },
  computed: {
    itemModel: {
      get() { return this.itemInfo || this.item; },
      set(val) {
        this.itemInfo = val;
      },
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
</style>
