<template>
  <el-card>
    <el-form ref="form" :model="sizeForm" size="mini" v-loading="loading" id="AlarmRule">
      <div style="padding-bottom: 50px;">
        <span class="alarm-font">计划报警</span>
        <el-divider class="alarmRules"></el-divider>
        <el-form-item style="padding-top: 10px;">
          <el-switch v-model="itemList.isOpenPlanWarn" active-text="未按时完成计划预警"></el-switch>
          <span style="padding-left: 40px;">提前时间：</span>
          <el-input-number v-model="itemList.planWarnAdvanceDays" :min="0" :max="365"></el-input-number>
          <span>天</span>
        </el-form-item>
        <el-form-item style="padding-top: 10px;">
          <el-switch v-model="itemList.isOpenPlanAlarm" active-text="未按时完成计划报警"></el-switch>
        </el-form-item>
      </div>
      <div style="padding-bottom: 40px;">
        <span class="alarm-font">修复情况报警</span>
        <el-divider></el-divider>
        <el-form-item style="padding-top: 10px;">
          <el-switch v-model="itemList.isOpenRepairAlarm" active-text="未按时完成修复报警"></el-switch>
          <span style="padding-left: 40px;">提前时间：</span>
          <el-input-number v-model="itemList.repairAlarmBufferDays" :min="0" :max="365"></el-input-number>
          <span>天</span>
        </el-form-item>
      </div>
      <div style="padding-bottom: 40px;">
        <span class="alarm-font">规范性报警</span>
        <el-divider></el-divider>
        <el-form-item style="padding-top: 10px;">
          <el-switch v-model="itemList.isOpenRespAlarm" active-text="检测仪器响应性"></el-switch>
        </el-form-item>
        <el-form-item style="padding-top: 10px;">
          <el-switch v-model="itemList.isOpenQAAlarm" active-text="QA记录"></el-switch>
        </el-form-item>
        <el-form-item style="padding-top: 10px;">
          <el-switch v-model="itemList.isOpenQCAlarm" active-text="QC记录"></el-switch>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { queryList } from '@/libs/mixins';
import { analyzeResp } from '@/libs/util';

export default {
  name: 'LDARAlarmRule',
  mixins: [
    queryList,
  ],
  data() {
    return {
      saveLoading: false,
      url: 'ldar/alarmRules',
      itemList: {
        isOpenPlanWarn: false,
        planWarnAdvanceDays: 0,
        isOpenRespAlarm: false,
        isOpenQAAlarm: false,
        isOpenQCAlarm: false,
        isOpenRepairAlarm: false,
        repairAlarmBufferDays: 0,
      },
    };
  },
  methods: {
    onSaveItem() {
      this.saveLoading = true;
      const { id } = this.itemList;
      this.$http[id ? 'put' : 'post'](this.url, this.itemList)
        .then((response) => {
          if (response.status === 200 && response.data.msg.includes('成功')) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemList = response.data.data;
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
          this.saveLoading = false;
        });
    },
  },
};
</script>

<style>
#AlarmRule {
  padding: 30px 0 0 20px;
}
#AlarmRule div {
  padding: 10;
}
.alarm-font {
  font-size: 16px;
}
#AlarmRule .el-divider--horizontal {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
