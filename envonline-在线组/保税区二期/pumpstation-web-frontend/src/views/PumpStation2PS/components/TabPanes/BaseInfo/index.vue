<template>
  <!-- 基本信息 -->
  <div style="width: 100%; height: 100%;">
    <div class="mar-y-xs mar-l-sm fill-auto">
      <el-button icon="fas fa-times" @click="onClickClose">关 闭</el-button>
    </div>
    <div class="title-info mar-t-xs mar-l-sm">基本信息</div>
    <hr class="mar-x-sm">
    <el-form label-width="100px" class="item-space mar-x-sm mar-t-xs" :model="itemModel">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="任务ID：">
            {{itemModel.taskId}}
            <!-- <el-input :value="itemModel.taskId" :disabled="true"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="走航日期：">
            {{itemModel.voyageDate}}
            <!-- <el-input :value="itemModel.voyageDate" :disabled="true"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="走航区域：">
            {{itemModel.voyageArea}}
            <!-- <el-input :value="itemModel.voyageArea" :disabled="true"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="走航路线：">
            {{itemModel.voyageRoute}}
            <!-- <el-input :value="itemModel.voyageRoute" :disabled="true"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="走航类型：">
            {{$enum.getLabel('TASK_TYPE', itemModel.voyageType)}}
            <!-- <el-input :value="itemModel.voyageType" :disabled="true"></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="走航结果：">
            <!-- 1 正常 2 异常 3 结果未出 -->
            <span :style="{ color: itemModel.voyageResult === 2 ? 'red' : '' }">
              {{$enum.getLabel('TASK_RESULT', itemModel.voyageResult)}}
            </span>
            <!-- <el-input :value="itemModel.voyageResult" :disabled="true"></el-input> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <hr class="mar-x-sm block">
    <div class="title-info mar-t-xs mar-l-sm">走航报告</div>
    <div class="mar-y-xs" style="height:calc(100% - 224px);">
      <upload-table ref="upload"/>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
// import { analyzeResp } from '@/global/libs/util';
import UploadTable from './components/UploadTable';

export default {
  name: 'BaseInfo',
  components: {
    UploadTable,
  },
  props: {
    mainrow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      itemModel: {
        taskId: '',          // 任务ID
        voyageArea: '',      // 走航区域
        voyageRoute: '',     // 走航路线
        voyageDate: '',      // 走航日期
        voyageType: '',      // 走航类型
        voyageResult: '',    // 走航结果
      },
    };
  },
  methods: {
    openDialog() {
      this.itemModel = _.cloneDeep(this.mainrow);
      this.$nextTick(() => {
        this.$refs.upload.openDialog(this.mainrow.id);
      });
    },
    onClickClose() {
      this.$emit('query');
    },
    closeDialog() {
      this.$refs.upload.closeDialog();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
