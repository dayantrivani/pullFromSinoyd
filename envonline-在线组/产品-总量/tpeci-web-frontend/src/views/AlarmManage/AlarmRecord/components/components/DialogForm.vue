<template>
  <dialog-modal type="title" ref="dialog" size="mini" append-to-body
    maxScrollbar :title="title" @close="closeDialog">
    <el-form ref="form" :rules="formRules" label-width="90px"
      :model="itemModel" class="mar-t-xs pad-x-sm item-space el-box">
      <el-form-item label="处置人员：" prop="dealUserName" hint-down>
        <el-input v-model="itemModel.dealUserName" disabled></el-input>
      </el-form-item>
      <el-form-item label="选择状态：" prop="dealType">
        <el-select v-model="itemModel.dealType" :disabled="dealDis || noEdit">
          <el-option v-for="(item, index) in $enum.get('ALARM_DEALTYPE')"
            :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处置时间：" prop="dealDate">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.dealDate"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期时间"
          :clearable="false"
          :disabled="noEdit">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="处置说明：" prop="dealContext">
        <el-input
          type="textarea"
          v-model="itemModel.dealContext"
          :autosize="{ minRows: 2 }"
          :disabled="noEdit">
        </el-input>
      </el-form-item>

      <el-form-item label="附件上传：">
          <upload-file-all ref="upload" :disabled="noEdit" :id="itemModel.alarmId" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        v-if="code !== 'alarmId'"
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)"
      >保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭{{`${code === 'alarmId' ? '详情' : ''}`}}</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    dealDis: {
      type: Boolean,
      default: false,
    },
    noEdit: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [saveItem],                     // 使用混合
  data() {
    return {
      saveLoading: false,
      url: 'alarm/AlarmRecordDealDetail',  // 必须, 接口地址
      itemModel: {                         // 表单对象
        alarmId: '',             // 报警记录id
        dealType: 1,             // 选择状态
        dealDate: '',            // 处理时间
        dealContext: '',         // 处置说明
        dealUserName: '',        // 处置人员
      },
      formRules: {
        dealType: [
          { required: true, message: '请选择状态', trigger: ['blur', 'change'] },
        ],
        dealDate: [
          { required: true, message: '请选择处理时间', trigger: ['blur', 'change'] },
        ],
        dealContext: [
          { required: true, message: '请输入处置说明', trigger: ['blur', 'change'] },
        ],
      },
      code: 'id',                          // 用于辨别对话框是点击哪个按钮弹出
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    // userName 用户名 userType 用户类型 gov 政府端
  },
  methods: {
    openDialog(row, code) {     // 打开对话框
      this.itemModel.dealUserName = this.user.userName;
      this.itemModel.alarmId = row[code];
      this.code = code;
      if (code === 'alarmId') {
        this.itemModel = {
          alarmId: row.alarmId,
          dealType: row.dealType,
          dealDate: row.dealDate,
          dealContext: row.dealContext,
          dealUserName: row.dealUserName,
        };
      } else {
        this.itemModel.dealDate = this.$tools.formatDate(new Date(), 'Y-m-d H:i:s');
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.upload.getFileList();
        this.$refs.form.clearValidate();
      });
    },
    closeDialog() {             // 关闭对话框
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },
    saveCallback() {            // 保存后的回调
      this.closeDialog();
      this.$emit('getItemList');
    },

    /** 特殊方法 */
    getEmptyItem() {            // 清空数据
      return {
        alarmId: '',             // 报警id
        dealType: 1,             // 选择状态
        dealDate: '',            // 处理时间
        dealContext: '',         // 处置说明
        dealUserName: '',        // 处置人员
      };
    },
  },
};
</script>
