<template>
  <dialog-modal ref="dialog"
                title="当前项目信息"
                maxScrollbar
                size="middle"
                @close="closeDialog">
    <el-form ref="form"
             :model="itemModel"
             v-loading="loading"
             label-position="right"
             label-width="150px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业名称：">
            <el-input v-model="itemModel.psName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="首次检测日期：">
            <el-date-picker v-model="itemModel.firstTestDate"
                            type="datetime">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="完成时间：">
            <el-date-picker v-model="itemModel.completionDate"
                            type="datetime">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属年度：">
            <el-input v-model="itemModel.belongYear"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="检测类型：">
            <el-input v-model="$enum.typeOptions[itemModel.type]"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测周期：">
            <el-input v-model="$enum.cycleOptions[itemModel.cycle]">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="总密封点数量：">
            <el-input v-model="itemModel.totalSealPoint"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="检测点数量：">
            <el-input v-model="itemModel.testPoint"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="泄漏点数量：">
            <el-input v-model="itemModel.leakagePoint"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="本次检测结果：">
            <el-input v-model="$enum.projectStatus[itemModel.status]">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="本周期预计排放总量：">
            <el-input v-model="itemModel.currentCycleCou"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="本周期减排总量：">
            <el-input v-model="itemModel.currentCycleReduceCou"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="接入日期：">
            <el-date-picker v-model="itemModel.createDate"
                            type="datetime">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否传过首检数据：">
            <el-input v-model="$enum.firstTestData[itemModel.firstTestData]"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/libs/util';

export default {
  name: 'DialogForm',
  data() {
    return {
      loading: false,
      itemModel: {},
    };
  },
  methods: {
    openDialog(projectId) {
      this.getItemList(projectId);
      this.$refs.dialog.openDialog();
    },
    // 关
    closeDialog() {
      this.itemModel = {};
      this.$refs.dialog.closeDialog();
    },
    getItemList(projectId) {
      this.loading = true;
      this.$http.get('ldar/project', {
        params: { id: projectId },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          const [first] = response.data.data;
          this.itemModel = first;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>
