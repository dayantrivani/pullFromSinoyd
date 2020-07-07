<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-form inline :model="queryForm">
          <el-form-item label="企业名称：">
            <el-input v-model="queryForm.psName" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item label="监测机构名称：">
            <el-input v-model="queryForm.psTestingName" style="width:140px"></el-input>
          </el-form-item>
          <el-form-item label="选择年：">
            <el-date-picker
              v-model="queryForm.belongYear"
              style="width:100px"
              value-format="yyyy"
              type="year"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="开始时间：">
            <el-date-picker
              style="width:140px"
              v-model="queryForm.firstTestDate"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="检测类型：">
            <el-select v-model="queryForm.type">
              <el-option
                v-for="(item, index)  in $enum.typeOptions"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="onQueryList()">查 询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="height:90%;overflow-y:auto">
        <div class="project-body" v-for="item in itemList" :key="item" style="margin: 10px;">
          <div
            class="project-div"
            @click="onClickDetail(item)"
            shadow="hover"
            style="cursor:pointer;"
          >
            <div class="project-title">
              <el-row :gutter="20">
                <el-col :span="9" class="fas fa-user-tie">{{ " "+item.psName}}</el-col>
                <el-col :span="9">
                  <div style="color:white;">
                    <span>监测机构：</span>
                    {{item.psTestingName}}
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="color:white;">
                    <span>首次检测日期：</span>
                    {{item.firstTestDate | date}}
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-form :model="item" label-width="160px">
              <el-row style="height:30px" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="所属年度：">{{item.belongYear}}</el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="检测类型：">{{$enum.typeOptions[item.type]}}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="检测周期：">{{$enum.cycleOptions[item.cycle]}}</el-form-item>
                </el-col>
              </el-row>
              <el-row style="height:30px" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="总密封点数量：">{{item.totalSealPoint}}</el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="监测点数量：">{{item.testPoint}}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="泄露点数量：">{{item.leakagePoint}}</el-form-item>
                </el-col>
              </el-row>
              <el-row style="height:30px" :gutter="20">
                <el-col :span="9">
                  <el-form-item label="本次检测结果：">{{$enum.projectStatus[item.status]}}</el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="本周期预计排放总量：">{{item.currentCycleCou}}</el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="本周期减排总量：">{{item.currentCycleReduceCou}}</el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </div>
      </div>
      <div style="position:fixed;bottom:0;height:50px;right:0;">
        <paging-query :pager="pager" @query="getItemList" />
      </div>
    </el-card>
    <project-device ref="dialog" />
  </div>
</template>

<script>
import { queryList } from '@/libs/mixins';
import ProjectDevice from './components/ProjectDevice';

export default {
  name: 'ProjectManage',
  mixins: [
    queryList,
  ],
  components: {
    ProjectDevice,
  },
  data() {
    return {
      url: '/ldar/project',
      itemList: [],
      queryForm: {
        psName: '',
        psTestingName: '',
        belongYear: '',
        firstTestDate: '',
        type: '',
      },
    };
  },
  methods: {
    onClickDetail(item) {
      this.$refs.dialog.openDialog(item.id);
    },
  },
};
</script>

<style>
.project-div {
  width: 1100px;
  height: 140px;
  float: left;
  margin: 10px;
  border: solid 2px #2d8cf0;
  background-color: #f6f6f6;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.project-title {
  background-color: #2d8cf0;
  font-size: 15px;
  color: white;
}
.project-div .el-col {
  padding: 5px;
}
.project-div:hover {
  width: 1100px;
  height: 140px;
  float: left;
  margin: 10px;
  border: solid 2px #2d8cf0;
  background-color: #dce7f5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}
.project-div .el-row {
  padding: 0 0 0 5px;
}
</style>
