<template>
  <dialog-modal ref="dialog" size="small" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}冶金信息`" @close="closeDialog">
    <el-form ref="form" label-position="right" label-width="160px" :rules="rules" :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="熔炼场所建筑物结构：" prop="structureCodeId">
            <el-select v-model="itemModel.structureCodeId" autofocus clearable>
              <el-option v-for="item in structure" :key="item.rowGuid" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="类别名称：" prop="categoryCodeId">
            <el-select v-model="itemModel.categoryCodeId" autofocus clearable>
              <el-option v-for="item in category" :key="item.rowGuid" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="金属液体转运方式：" prop="transportModeCodeId">
            <el-select v-model="itemModel.transportModeCodeId" autofocus clearable>
              <el-option v-for="item in transportMode" :key="item.rowGuid" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="主要产品：" prop="mainProducts">
            <el-input :maxlength="500" v-model="itemModel.mainProducts"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="载体是否为移动式：">
            <el-select v-model="itemModel.isMobile" autofocus clearable>
              <el-option v-for="item in $enum.WHETHER" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="加热方式：">
            <el-select v-model="itemModel.heatingModeCodeId" autofocus clearable>
              <el-option v-for="item in heatingMode" :key="item.rowGuid" :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="年产量（t）：" prop="annualYield">
            <el-input :maxlength="20" v-model="itemModel.annualYield"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="100px" label="现场人数：" prop="onSitePeopleNum">
            <el-input  :maxlength="20" v-model="itemModel.onSitePeopleNum"></el-input>
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
    const validateNum = (rule, value, callback) => {
      if (!/(^[-0-9][0-9]*(.[0-9]+)?)$/.test(value)) {
        callback(new Error('请输入正确数字值'));
      } else {
        callback();
      }
    };
    return {
      url: 'wholeprocess/leprocess/metallurgicalInfo',
      itemModel: this.getEmptyItem(),
      rules: {
        categoryCodeId: [
          { required: true, message: '请选择类别名称', trigger: ['blur', 'change'] },
        ],
        structureCodeId: [
          { required: true, message: '请选择熔炼场所建筑物结构', trigger: ['blur', 'change'] },
        ],
        transportModeCodeId: [
          { required: true, message: '请选择金属液体转运方式', trigger: ['blur', 'change'] },
        ],
        isMobile: [
          { required: true, message: '请选择体是否为移动式', trigger: ['blur', 'change'] },
        ],
        annualYield: [
          { validator: validateNum, trigger: ['blur', 'change'] },
        ],
        onSitePeopleNum: [
          { validator: validateNum, trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  props: {
    category: {
      type: Array,
    },
    structure: {
      type: Array,
    },
    transportMode: {
      type: Array,
    },
    heatingMode: {
      type: Array,
    },
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
        categoryCodeId: '', // 类别名称
        structureCodeId: '', // 熔炼场所建筑物结构
        transportModeCodeId: '', // 金属液体转运方式
        mainProducts: '', // 主要产品
        isMobile: '', // 载体是否为移动式
        heatingModeCodeId: '', // 加热方式
        annualYield: '', // 年产量（t）
        onSitePeopleNum: '', // 现场人数
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
