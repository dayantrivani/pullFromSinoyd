<template>
  <!-- 服务工单详情 -->
  <el-card style="overflow: scroll;">
    <div class="mar-t-xs pad-b-lg">
      <!-- 诉求人基本信息 -->
      <div class="title-info mar-l-sm mar-t-xs">诉求人基本信息</div>
      <!-- 表单展示内容 -->
      <el-form ref="form" :model="itemModel" label-width="117px">
        <el-row class="pad-x-sm">
          <el-col :span="24">
            <el-row class="mar-y-xs">
              <el-col :span="6">
                <el-form-item label="服务对象：">
                  <span>{{itemModel.psName}}</span>
                  <!-- <span style="float: right;" class="pad-r-xs">先生</span> -->
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="来电号码：">
                  <span>{{itemModel.portName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="性别：">
                  <span>{{itemModel.portShortName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="联系电话：">
                  <span>{{itemModel.childPortTypeName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="mar-b-xs">
              <el-col :span="6">
                <el-form-item label="年龄范围：">
                  <span>{{itemModel.portCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="住址：">
                  <span>{{`${itemModel.isOutput === 0 ? '出口': '进口'}`}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="mar-t-xs pad-b-lg">
      <!-- 工单详情 -->
        <div class="title-info mar-l-sm mar-t-xs">工单详情</div>
        <!-- 表单展示内容 -->
        <el-row class="pad-x-sm">
          <el-col :span="24">
            <el-form ref="form" :model="itemModel" label-width="131px">
              <el-row class="mar-y-xs">
                <el-col :span="6">
                  <el-form-item label="本地诉求类型：">
                    <span>{{itemModel.socialCreditCode}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="受理时间：">
                    <span>{{itemModel.psName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="情绪诉求：">
                    <span>{{itemModel.psShortName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="事发时间：">
                    <span>{{itemModel.psCode}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="6">
                  <el-form-item label="来源渠道：">
                    <span>{{itemModel.industryTypeName}}</span>
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
                    <span>{{itemModel.industryTypeName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="24">
                  <el-form-item label="目的：">
                    <span>{{itemModel.industryTypeName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="24">
                  <el-form-item label="诉求内容：">
                    <el-input
                      type="textarea"
                      :rows="3"
                      v-model="itemModel.textarea"
                      readonly
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="24">
                  <el-form-item label="归口类型：">
                    <span>{{itemModel.industryTypeName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="6">
                  <el-form-item label="事件发生地：">
                    <span>{{itemModel.industryTypeName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="具体地址：">
                    <span>{{itemModel.regionName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="是否保密：">
                    <span>{{itemModel.psLongitude}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="紧急程度：">
                    <span>{{itemModel.psLatitude}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="6">
                  <el-form-item label="是否回访：">
                    <span>{{itemModel.industryTypeName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="市民满意度：">
                    <span>{{itemModel.regionName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="态度满意度：">
                    <span>{{itemModel.psLongitude}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="中心满意度：">
                    <span>{{itemModel.psLatitude}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="mar-b-xs">
                <el-col :span="24">
                  <el-form-item label="市民评价意见：">
                    <span>{{itemModel.industryTypeName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
    </div>
    <div class="mar-t-xs pad-b-lg">
      <!-- 处办时限要求 -->
      <div class="title-info mar-l-sm mar-t-xs">处办时限要求</div>
      <!-- 表单展示内容 -->
      <el-form ref="form" :model="itemModel" label-width="117px">
        <el-row class="pad-x-sm">
          <el-col :span="24">
            <el-row class="mar-y-xs">
              <el-col :span="6">
                <el-form-item label="签收截止时间：">
                  <span>{{itemModel.psName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="签收时间：">
                  <span>{{itemModel.portName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="要求反馈时间：">
                  <span>{{itemModel.portShortName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="剩余反馈时间：">
                  <span>{{itemModel.childPortTypeName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="mar-t-xs pad-b-lg">
      <!-- 下级部门处理 -->
      <div class="title-info mar-l-sm mar-t-xs">下级部门处理</div>
      <!-- 列表展示内容 -->
      <div class="mar-t-xs pad-x-xs">
        <el-table
          border
          highlight-current-row
          v-loading="loading"
          :data="itemList"
        >
          <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
          <el-table-column label="处理部门" prop="regionName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="签收时间" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="应签收时间" prop="portName" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理人" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="应处理时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理意见" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="状态" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mar-t-xs pad-b-lg">
      <!-- 补充反馈信息 -->
      <div class="title-info mar-l-sm mar-t-xs">补充反馈信息</div>
      <!-- 列表展示内容 -->
      <div class="mar-t-xs pad-x-xs">
        <el-table
          border
          highlight-current-row
          v-loading="loading"
          :data="itemList"
        >
          <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
          <el-table-column label="部门名称" prop="regionName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="补充反馈时间" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="补充反馈内容" prop="portName" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="附件" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mar-t-xs pad-b-lg">
      <!-- 申请延时记录 -->
      <div class="title-info mar-l-sm mar-t-xs">申请延时记录</div>
      <!-- 列表展示内容 -->
      <div class="mar-t-xs pad-x-xs">
        <el-table
          border
          highlight-current-row
          v-loading="loading"
          :data="itemList"
        >
          <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
          <el-table-column label="申请人" prop="regionName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="申请时间" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="审核人" prop="portName" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="审核时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="申请延时时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="实际延时时限" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="应处理时限" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="审核状态" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="mar-t-xs pad-b-lg">
      <!-- 办理跟踪 -->
      <div class="title-info mar-l-sm mar-t-xs">办理跟踪</div>
      <!-- 列表展示内容 -->
      <div class="mar-t-xs pad-x-xs">
        <el-table
          border
          highlight-current-row
          v-loading="loading"
          :data="itemList"
        >
          <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
          <el-table-column label="步骤" prop="regionName" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理部门" prop="psName" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理人员" prop="portName" min-width="180" show-overflow-tooltip></el-table-column>
          <el-table-column label="工号" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="收到时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理时间" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理时长" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="处理意见" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column label="附件" prop="tstamp" min-width="160" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ServiceOrderDetails',
  data() {
    return {
      itemModel: {},
    };
  },
};
</script>

<style>

</style>
