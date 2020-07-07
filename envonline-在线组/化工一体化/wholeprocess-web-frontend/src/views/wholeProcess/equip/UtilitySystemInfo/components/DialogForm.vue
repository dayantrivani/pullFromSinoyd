<template>
  <dialog-modal type="title" size="mini" ref="dialog" maxScrollbar :title="`${isEdit ? '编辑' : '新增'}共用工程信息`" @close="closeDialog">
    <el-form class="mar-t-xs pad-x-sm item-space el-box" ref="form" :rules="formRules" label-position="right" label-width="90px"
      :model="itemModel">
      <el-form-item label="类别：" prop="categoryCodeId" hint-down>
        <el-select v-model="itemModel.categoryCodeId">
          <el-option v-for="(item, index) in dict.UtilitySystemCategory" :key="index" :label="item.dictName" :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="占地面积：" prop="landOccupationArea">
        <!-- 正整数 -->
        <el-input-number
          v-model="itemModel.landOccupationArea"
          controls-position="right"
          :min="0"
          :max="2147483647"
          :precision="0"
          style="width: 100%;"
        >
        </el-input-number>
        <!-- <el-input v-model="itemModel.landOccupationArea" clearable></el-input> -->
      </el-form-item>
      <el-form-item label="建筑结构：" prop="buildingStructureCodeId">
        <el-select v-model="itemModel.buildingStructureCodeId">
          <el-option v-for="(item, index) in dict.BuildingStructure" :key="index" :label="item.dictName" :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="主要危险性：">
        <el-input type="textarea" v-model="itemModel.mainRisk" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"></el-input>
      </el-form-item>
      <el-form-item label="安全附件：">
        <upload-file
          :typeLimilt="['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']"
          :id="itemModel.id"
          :is-update="isUpdate"
          :is-request="isRequest"
          @update-recover="updateRecover" />
          <!-- @update-success="updateSuccess"  -->
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
      url: 'wholeprocess/utilitySystemInfo', // 必须, 接口地址
      itemModel: {}, // 表单对象
      dict: {
        UtilitySystemCategory: [],
        BuildingStructure: [],
      },
      formRules: {
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: ['blur', 'change'] }],
        equipmentNumber: [{ required: true, message: '请输入设备编号', trigger: ['blur', 'change'] }],
        equipmentTypeCodeId: [{ required: true, message: '请选择设备类型', trigger: ['blur', 'change'] }],
      },
      // 附件上传参数
      isUpdate: false,
      isRequest: false,
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    getEmptyItem() {
      return {};
    },
    // 打开对话框
    openDialog(row) {
      this.getDictList();
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) {
        this.isRequest = true;
      } else {
        this.itemModel.psId = this.$store.state.auth.user.orgGuid;
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.isUpdate = false;
      this.isRequest = false;
      this.$refs.dialog.closeDialog();
    },
    saveCallback() { // 保存结束后上传附件
      this.isUpdate = true;
    },
    updateRecover() { // 上传附件结束后关闭弹窗
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
