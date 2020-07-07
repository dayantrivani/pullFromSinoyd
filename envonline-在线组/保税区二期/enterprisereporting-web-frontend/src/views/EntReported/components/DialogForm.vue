<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isDisabled ? '查看' : isEdit ? '编辑' : '新增'}${dialogType.label}`"
    @close="closeDialog"
  >
    <!-- 企业故障申报 -->
    <el-form ref="form"
      v-if="+dialogType.value === 1"
      :rules="formRules"
      label-width="120px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <el-form-item label="开始时间：" prop="beginTime">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.beginTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :readonly="isDisabled"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预计结束时间：" prop="endTime">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.endTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :readonly="isDisabled"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="故障描述：">
        <el-input
          type="textarea"
          v-model="itemModel.reason"
          :autosize="{ minRows: 2 }"
          :readonly="isDisabled"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="解决方案：">
        <el-input
          type="textarea"
          v-model="itemModel.solution"
          :autosize="{ minRows: 2 }"
          clearable
          :readonly="isDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="附件：">
        <upload-File
          :isRequest="isRequest"
          :id="itemModel.id || ''"
          :btn="isDisabled ? 'down' : 'add down remove'"
        />
      </el-form-item>
      <el-form-item label="当前状态：">
        <el-select v-model="itemModel.status" :disabled="isDisabled">
          <el-option label="处置中" :value="0"></el-option>
          <el-option label="已完成" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 企业整改申报 -->
    <el-form ref="form"
      v-else-if="+dialogType.value === 2"
      :rules="formRules"
      label-width="120px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <el-form-item label="开始时间：" prop="beginTime">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.beginTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :readonly="isDisabled"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预计结束时间：" prop="endTime">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.endTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :readonly="isDisabled"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="整改原因：">
        <el-input
          type="textarea"
          v-model="itemModel.reason"
          :autosize="{ minRows: 2 }"
          clearable
          :readonly="isDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="整改方案：">
        <el-input
          type="textarea"
          v-model="itemModel.solution"
          :autosize="{ minRows: 2 }"
          clearable
          :readonly="isDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="附件：">
        <upload-File
          :isRequest="isRequest"
          :id="itemModel.id || ''"
          :btn="isDisabled ? 'down' : 'add down remove'"
        />
      </el-form-item>
      <el-form-item label="整改责任人：">
        <el-input v-model="itemModel.responsibleName" clearable :readonly="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="responsiblePhone" autocomplete="off">
        <el-input v-model="itemModel.responsiblePhone" clearable :readonly="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="整改完成审核人：">
        <el-input v-model="itemModel.dealName" clearable :readonly="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="dealPhone" autocomplete="off">
        <el-input v-model="itemModel.dealPhone" clearable :readonly="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="当前状态：">
        <el-select v-model="itemModel.status" :disabled="isDisabled">
          <el-option label="处置中" :value="0"></el-option>
          <el-option label="已完成" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!-- 企业停产报备 -->
    <el-form ref="form"
      v-else-if="+dialogType.value === 3"
      :rules="formRules"
      label-width="120px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <el-form-item label="开始时间：" prop="beginTime">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.beginTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :readonly="isDisabled"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="预计结束时间：" prop="endTime">
        <el-date-picker
          style="width: 100%;"
          v-model="itemModel.endTime"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00"
          :readonly="isDisabled"
          :clearable="false"
          :editable="false"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="停产原因：">
        <el-input
          type="textarea"
          v-model="itemModel.reason"
          :autosize="{ minRows: 2 }"
          :readonly="isDisabled"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="附件：">
        <upload-File
          :isRequest="isRequest"
          :id="itemModel.id || ''"
          :btn="isDisabled ? 'down' : 'add down remove'"
        />
      </el-form-item>
      <el-form-item label="当前状态：">
        <el-select v-model="itemModel.status" :disabled="isDisabled">
          <el-option label="处置中" :value="0"></el-option>
          <el-option label="已完成" :value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" v-if="!isDisabled">
      <el-button type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)"
      >
        保 存
      </el-button>
      <el-button icon="fas fa-times"  @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { getDay } from '@/libs/tools';
import { saveFile } from '@/global/libs/mixins';
import UploadFile from '@/components/upload-file';
import { analyzeResp } from '@/global/libs/util';

export default {
  mixins: [saveFile],                     // 使用混合
  components: { UploadFile },
  data() {
    const telephone = (rule, value, callback) => {
      if (value) {
        if (!/^\d+$/.test(value)) {
          callback(new Error('请输入数字值'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      url: 'enterprise/reporting',  // 必须, 接口地址
      isEdit: false, // 是否编辑弹窗
      itemModel: {
        reportType: 1,
        beginTime: getDay(-1, true, false),
        endTime: getDay(0, true, false),
        status: 1,
      },          // 表单对象
      dialogType: {},
      formRules: {
        // psId: [
        //   { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        // ],
        responsiblePhone: [
          { validator: telephone, trigger: ['blur', 'change'] },
        ],
        dealPhone: [
          { validator: telephone, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    isDisabled() { return !['ent', 'Ent'].includes(this.userType); },
  },
  methods: {
    getEmptyItem() {
      return {
        reportType: 1,
        beginTime: getDay(-1, true, false),
        endTime: getDay(0, true, false),
        status: 1,
      };
    },
    // 打开对话框
    openDialog(type, row) {
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      this.dialogType = type;
      this.itemModel.reportType = type.value;
      if (row) { // 编辑弹窗
        this.isEdit = true;
        this.isRequest = true;
      } else { // 新增弹窗
        this.isEdit = false;
        this.getAttachGuId().then((res) => {
          this.$set(this.itemModel, 'id', res.data.data);
        }); // 获取新增弹窗rowGuid
        this.itemModel.psId = this.orgGuid;
        this.$http.get(`bas/psBaseInfo/${this.orgGuid}`).then((response) => {
          if (response.status === 200 && response.data.success) {
            if (response.data.data) this.itemModel.psName = response.data.data.psName;
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
          this.statusLoading = false;
        });
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    onSaveCheck(callback) {       // 保存记录前回调
      if (new Date(this.itemModel.endTime).getTime() - new Date(this.itemModel.beginTime).getTime() > 0) {
        this.$refs.form.validate((valid) => {
          if (!valid) return;
          this.onSaveItem(callback);
        });
      } else {
        this.$message.warning('开始时间不能超过预计结束时间！');
      }
    },
  },
};
</script>
