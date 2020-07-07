<template>
  <dialog-modal ref="dialog"
                size="mini"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}接触信息`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="100px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="接触人员：" prop="personId">
            <person-single @selected="selectUserData"
                           :label="itemModel.personName">
            </person-single>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fas fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(callback)">保 存</el-button>
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import personSingle from '@/components/select-table-personSingle';

export default {
  data() {
    return {
      isAuto: false,
      url: 'wholeprocess/occupationalDiseaseHealthCheck',
      itemModel: this.getEmptyItem(),
      // 表单验证
      rules: {
        personId: [
          { required: true, message: '请选择接触人员', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  components: { personSingle },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : this.$store.state.auth.user.orgGuid,
        personId: '',
        diseaseName: '',
      };
    },
    // 保存记录
    onSaveCheck(saveCallback) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(saveCallback);
      });
    },
    // 保存数据后回调
    callback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 接触人
    selectUserData(row) {
      this.itemModel.personId = row.id;
      this.itemModel.personName = row.name;
    },
    // 打开对话框
    openDialog(row) {
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
