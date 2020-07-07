<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    title="信息确认"
    @close="closeDialog">
    <el-form
      ref="form"
      :rules="rules"
      label-width="100px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="阀值模式：" prop="thresholdMode" hint-down>
        <el-select style="width:100%;" v-model="itemModel.thresholdMode" clearable>
          <el-option
            v-for="(item, index) in $enum.get('THRESHOLD_MODE')"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间：" prop="beginDate">
        <el-date-picker
          v-model="itemModel.beginDate"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          format="yyyy-MM-dd"
          :clearable="false"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="结束时间：" prop="endDate">
        <el-date-picker
          v-model="itemModel.endDate"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          format="yyyy-MM-dd"
          :clearable="false"
          style="width: 100%;"
        ></el-date-picker>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">确 定
      </el-button>
      <el-button
        icon="fas fa-times"
        @click="$refs.dialog.closeDialog()">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
// import _ from 'lodash';
import { analyzeResp } from '@/global/libs/util';
import { saveItem } from '@/global/libs/mixins';

export default {
  mixins: [saveItem],                       // 使用混合
  data() {
    return {                   // 保存按钮
      url: 'tpeci/valveScheme2Port',             // 必须, 接口地址
      row: null,
      n: null,
      itemModel: {                          // 表单对象
        thresholdMode: '',                  // 阈值模式
        beginDate: '',                      // 开始时间
        endDate: '',                        // 结束时间
      },
      rules: {                              // 表单验证
        thresholdMode: [
          { required: true, message: '请选择阈值模式', trigger: ['blur', 'change'] },
        ],
        beginDate: [
          { required: true, message: '请输入开始日期', trigger: ['blur', 'change'] },
        ],
        endDate: [
          { required: true, message: '请输入结束日期', trigger: ['blur', 'change'] },
        ],
        // remark: [
        //   { required: true, message: '请输入备注', trigger: ['blur', 'change'] },
        // ],
      },
    };
  },
  computed: {
  },
  methods: {
    openDialog(row, n) {               // 打开对话框
      this.$refs.dialog.openDialog();
      this.row = row;
      this.n = n;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      const s = new Date(this.itemModel.beginDate.replace(/-/g, '/'));
      const e = new Date(this.itemModel.endDate.replace(/-/g, '/'));
      if (s > e) {
        this.$message({
          type: 'warning',
          message: '开始时间不能大于结束时间',
          showClose: true,
          duration: 3000,
        });
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    onSaveItem() {
      this.$http.get(`${this.url}/issued`, {
        params: {
          portId: this.row.portId,
          issuedType: this.n,
          ...this.itemModel,
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.$refs.dialog.closeDialog();
          this.$emit('query');
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
    saveCallback() {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    closeDialog() {                 // 关闭弹框
      this.itemModel = this.getEmptyItem();
    },
    getEmptyItem() {                // 重置表单数据
      return {
        thresholdMode: '',                  // 阈值模式
        beginDate: '',                      // 开始时间
        endDate: '',                        // 结束时间
      };
    },
  },
};
</script>
