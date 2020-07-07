<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}负责人`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="120px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="名称："
                        prop="name">
            <el-input v-model="itemModel.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="所属上级："
                        prop="parentName">
            <el-input disabled
                      v-model="itemModel.parentName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="负责人："
                        prop="contactName">
            <el-input v-model="itemModel.contactName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="联系方式："
                        prop="contactPhone">
            <el-input v-model="itemModel.contactPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="安全职责："
                        prop="safetyDuty">
            <el-input v-model="itemModel.safetyDuty"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注："
                        prop="remark">
            <el-input v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';

export default {
  data() {
    const validateTel = (rule, value, callback) => {
      if (!/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/.test(value)) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    };
    // const validate = (rule, value, callback) => {
    //   if (value === '1753-01-01 00:00:00') {
    //     callback(new Error('请选择日期'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      url: 'wholeprocess/managNetwork',
      itemModel: this.getEmptyItem(),
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: ['blur', 'change'] },
        ],
        contactName: [
          { required: true, message: '请输入负责人', trigger: ['blur', 'change'] },
        ],
        contactPhone: [
          { required: true, message: '请输入负责人联系方式', trigger: ['blur', 'change'] },
          { validator: validateTel, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        name: '', // 名称]
        parentName: '', // 上级名称
        parentId: 0, // 所属上级（0为父级）
        contactName: '', // 负责人姓名
        contactPhone: '', // 负责人联系方式
        safetyDuty: '', // 安全职责
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck(saveCallback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(saveCallback);
      });
    },
    // 打开对话框
    openDialog(row, bol) {
      if (bol) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
      } else if (row) {
        this.itemModel = this.getEmptyItem();
        this.itemModel.parentId = row.id;
        this.itemModel.parentName = row.name;
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query', true);
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
