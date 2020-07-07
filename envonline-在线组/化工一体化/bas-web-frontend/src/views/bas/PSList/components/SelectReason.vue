<template>
  <el-dialog
    appendToBody
    ref="dialog"
    width="420px"
    custom-class="is-select"
    :visible.sync="dialogVisible"
    @close="closeDialog">
    <template slot="title">
      <i class="el-icon-warning text-warning"></i>
      <span>提示</span>
    </template>
    <el-form label-position="right" class="pad-x-md">
      <el-form-item label="请选择删除企业的原因：">
        <el-select
          v-model="idsModel"
          @visible-change="show => show && !DeleteEnterpriseReason.length && getDictList()">
          <el-option
            v-for="(item, index) in DeleteEnterpriseReason"
            :key="index"
            :label="item.dictName"
            :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="small" :disabled="!idsModel" @click="onConfirm()">确定</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';

export default {
  data() {
    return {
      dialogVisible: false,
      selectedIds: [],
      DeleteEnterpriseReason: [],
      idsModel: '',
    };
  },
  methods: {
    // 获取字典表数据
    getDictList() {
      this.$store.dispatch('dict/GET_SELECT_TYPE', 'DeleteEnterpriseReason').then((val) => {
        this.DeleteEnterpriseReason = val;
      });
    },
    // 打开对话框
    openDialog(ids = []) {
      this.dialogVisible = true;
      this.selectedIds = ids;
    },
    // 关闭对话框
    closeDialog() {
      this.dialogVisible = false;
      this.selectedIds = [];
      this.idsModel = '';
    },
    // 回调选中用户
    onConfirm() {
      this.onDeleteItem(() => {
        this.closeDialog();
        this.$emit('query');
      });
    },
    onDeleteItem(callback) {
      this.$http.delete('bas/psBaseInfo/deleteReason', {
        data: {
          ids: this.selectedIds,
          deleteReasonCodeId: this.idsModel,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          if (callback) {
            callback(this.selectedIds);
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
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

<style lang="scss">
  .el-dialog.is-select {
    margin-top: 33vh !important;
    .el-dialog__header {
      vertical-align: middle !important;
      > i.el-icon-warning {
        font-size: 22px !important;
        position: relative;
        top: 2px;
      }
      > span {
        margin-left: 15px;
        font-size: 18px;
        font-weight: normal;
        color: #303133;
      }
    }
    .el-dialog__footer {
      padding: 10px 15px;
      border-top: none;
    }
  }
</style>
