<template>
  <dialog-modal ref="dialog" size="small" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}作业班次信息`" @close="closeDialog">
    <el-form ref="form" label-position="right" label-width="120px" :rules="rules" :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="班次名称：" prop="shiftName">
            <el-input  :maxlength="20" v-model="itemModel.shiftName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="班次人数：" prop="peopleNum">
            <el-input :maxlength="20" v-model="itemModel.peopleNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="接班时间：" prop="shiftBeginTime">
            <el-date-picker v-model="shiftBeginTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交班时间：" prop="shiftEndTime">
            <el-date-picker v-model="shiftEndTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="负责人姓名：" prop="contactName">
            <el-input :maxlength="30" v-model="itemModel.contactName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式：" prop="contactPhone">
            <el-input :maxlength="30" v-model="itemModel.contactPhone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="备注：" prop="remark">
            <el-input :maxlength="500" type="textarea" v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';

export default {
  data() {
    return {
      url: 'wholeprocess/workShifts',
      itemModel: this.getEmptyItem(),
      rules: {
        shiftName: [
          { required: true, message: '请输入班次名称', trigger: ['blur', 'change'] },
        ],
        peopleNum: [
          { required: true, message: '请输入班次人数', trigger: ['blur', 'change'] },
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
    shiftBeginTime: {
      get() {
        return this.itemModel.shiftBeginTime === '1753-01-01 00:00:00'
          ? ''
          : this.itemModel.shiftBeginTime;
      },
      set(val) {
        this.itemModel.shiftBeginTime = val || '1753-01-01 00:00:00';
      },
    },
    shiftEndTime: {
      get() {
        return this.itemModel.shiftEndTime === '1753-01-01 00:00:00'
          ? ''
          : this.itemModel.shiftEndTime;
      },
      set(val) {
        this.itemModel.shiftEndTime = val || '1753-01-01 00:00:00';
      },
    },
  },
  created() {
    this.getDictList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        shiftName: '', // 班次名称
        peopleNum: '', // 班次人数
        shiftBeginTime: '', // 接班时间
        shiftEndTime: '', // 交班时间
        contactName: '', // 负责人姓名
        contactPhone: '', // 联系方式
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck(callback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
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
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
