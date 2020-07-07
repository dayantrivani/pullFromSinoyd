<template>
  <!-- 处理异常记录 -->
  <dialog-modal
    title="批量处理异常记录"
    maxScrollbar
    size="mini"
    ref="dialog"
    @close="closeDialog"
  >
    <el-form
      ref="form"
      :rules="formRules"
      label-width="100px"
      :model="itemModel"
      class="item-space el-box">
        <el-form-item label="处理状态：" prop="status">
          <el-select v-model="itemModel.status">
            <el-option
              v-for="(item,index) in $enum.get('DEAL_STATUS')"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="处理意见：" prop="dealContent">
          <el-input
            type="textarea"
            v-model="itemModel.dealContent"
            :autosize="{ minRows: 2, maxRows: 2}"
          ></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="$refs.dialog.closeDialog()">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'DealAllRecord',
  mixins: [saveItem],
  data() {
    return {
      url: 'voyage/resultInfo',
      itemModel: {
        status: 0,           // 处理状态
        dealContent: '',     // 处理意见
      },
      formRules: {
        status: [
          { required: true, message: '请选择处理状态', trigger: ['blur', 'change'] },
        ],
        // dealContent: [
        //   { required: true, message: '请输入处理意见', trigger: ['blur', 'change'] },
        // ],
      },
    };
  },
  methods: {
    openDialog(row) {
      if (row) {
        this.itemModel = _.cloneDeep(row);
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /* 请求接口 */
    onSaveItem(callback) {
      this.saveLoading = true;
      this.$http.put(this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            // this.itemModel = response.data.data;
            if (callback) {
              callback(response.data.data);
            } else {
              this.$emit('query');
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
        }).finally(() => {
          this.saveLoading = false;
        });
    },

    /* 特殊方法 */
    onSaveCheck(callback) {
      this.itemModel.dealDate = this.$tools.formatDate(new Date(), 'Y-m-d H:i:s');
      // 表单是否需要验证
      if (this.isEmptyObj(this.formRules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    closeDialog() {
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        status: 0,           // 处理状态
        dealContent: '',     // 处理意见
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
