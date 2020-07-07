<template>
  <dialog-modal type="title" size="mini" ref="dialog" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}安全设施`" @close="closeDialog">
    <el-form class="mar-t-xs pad-x-sm item-space el-box" ref="form" :rules="formRules" label-position="right" label-width="115px"
      :model="itemModel">
      <el-form-item label="大类：" prop="categoryCodeId" hint-down>
        <el-select v-model="itemModel.categoryCodeId">
          <el-option v-for="(item, index) in dict.safetyFacilities.filter(n => +n.parentId === 0)" :key="index" :label="item.dictName"
            :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="小类：" prop="subcategoryCodeId">
        <el-select v-model="itemModel.subcategoryCodeId">
          <el-option v-for="(item, index) in subcategoryList" :key="index" :label="item.dictName" :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="安全设施名称：" prop="facilitiesNameCodeId">
        <el-select v-model="itemModel.facilitiesNameCodeId">
          <el-option v-for="(item, index) in facilitiesNameList" :key="index" :label="item.dictName" :value="item.rowGuid">
          </el-option>
        </el-select>
        <!-- <el-input v-model="itemModel.landOccupationArea" clearable></el-input> -->
      </el-form-item>
      <el-form-item label="涉及工艺设施：" prop="involveProcess">
        <el-input v-model="itemModel.involveProcess" clearable></el-input>
      </el-form-item>
      <el-form-item label="检测时间：">
        <el-date-picker style="width: 100%;" v-model="itemModel.inspectionDate" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00" :clearable="false" :editable="false"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间：">
        <el-date-picker style="width: 100%;" v-model="itemModel.expiryDate" type="date" format="yyyy-MM-dd"
          value-format="yyyy-MM-dd 00:00:00" :clearable="false" :editable="false"></el-date-picker>
      </el-form-item>
      <el-form-item label="数量：" prop="quantity">
        <!-- 正整数 -->
        <el-input-number v-model="itemModel.quantity" controls-position="right" :min="0" :max="2147483647" :precision="0"
          style="width: 100%;">
        </el-input-number>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="itemModel.status">
          <el-option label="损坏" :value="0"></el-option>
          <el-option label="正常" :value="1"></el-option>
          <el-option label="停用" :value="2"></el-option>
          <el-option label="报废" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭
      </el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';

export default {
  mixins: [saveItem], // 使用混合
  data() {
    return {
      url: 'wholeprocess/safetyFacilities', // 必须, 接口地址
      itemModel: {}, // 表单对象
      dict: {
        safetyFacilities: [],
      },
      subcategoryList: [], // 根据大类选择显示小类列表
      facilitiesNameList: [], // 根据小类选择显示安全设施名称列表
      formRules: {
        categoryCodeId: [{ required: true, message: '请选择大类', trigger: ['blur', 'change'] }],
        subcategoryCodeId: [{ required: true, message: '请选择小类', trigger: ['blur', 'change'] }],
        facilitiesNameCodeId: [{ required: true, message: '请选择安全设施', trigger: ['blur', 'change'] }],
      },
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  watch: {
    // eslint-disable-next-line
    'itemModel.categoryCodeId': function (val) { // 根据大类选择显示小类列表
      this.$set(this.itemModel, 'subcategoryCodeId', '');
      this.subcategoryList = this.dict.safetyFacilities.filter(n => n.parentId === val);
    },
    // eslint-disable-next-line
    'itemModel.subcategoryCodeId': function (val) { // 根据小类选择显示安全设施名称列表
      this.$set(this.itemModel, 'facilitiesNameCodeId', '');
      this.facilitiesNameList = this.dict.safetyFacilities.filter(n => n.parentId === val);
    },
    // eslint-disable-next-line
    'itemModel.facilitiesNameCodeId': function (val) { // 根据安全设施名称绑定facilitiesName
      this.itemModel.facilitiesName = (this.dict.safetyFacilities.filter(n => n.rowGuid === val)[0] || {}).dictName;
    },
  },
  methods: {
    getEmptyItem() {
      return {
        inspectionDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
        expiryDate: this.$tools.formatDate(new Date(), 'Y-m-d 00:00:00'),
      };
    },
    // 打开对话框
    openDialog(row) {
      this.getDictList();
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        // this.isRequest = true;
      } else {
        this.itemModel.psId = this.$store.state.auth.user.orgGuid;
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    saveCallback() { // 保存结束后关闭弹窗
      this.closeDialog();
      this.$emit('query');
    },
    // 获取字典表数据
    getDictList() {
      Object.keys(this.dict).forEach((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      });
    },
  },
};
</script>
