<template>
  <dialog-modal
    type="title"
    ref="dialog"
    maxScrollbar
    :title="`${isDisabled ? '查看' : itemModel.id ? '编辑' : '新增'}企业原材料使用情况`"
    @close="closeDialog"
  >
  <!-- 企业原材料使用情况 -->
    <el-form
      ref="form"
      :rules="formRules"
      label-width="85px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <!-- 基本信息 -->
      <div class="title-info mar-l-sm mar-t-xs">基本信息</div>
      <el-row>
        <el-col :span="12">
          <el-form-item label="企业名称：">
            <el-input
              v-model="itemModel.psName"
              clearable
              placeholder="企业名称"
              readonly
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属年份：">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.belongYear"
              type="year"
              format="yyyy"
              value-format="yyyy"
              :clearable="false"
              :editable="false"
              readonly
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="归属月份：">
            <el-input
              v-model="itemModel.belongMonth"
              clearable
              placeholder="归属月份"
              readonly
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申报时间：">
            <el-date-picker
              style="width: 100%;"
              v-model="itemModel.createDate"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :editable="false"
              readonly
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 原材料信息 -->
    <div class="title-info mar-l-sm mar-t-xs">原材料信息</div>
    <!-- 操作按钮 -->
    <div class="pad-t-xs pad-l-sm pad-b-xs" style="border-top: 1px solid #EBEEF5" v-if="!isDisabled">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd()">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        @click="onClickRemove()"
        :disabled="!selected.length"
      >删 除</el-button>
    </div>
    <!-- 列表 -->
    <el-table
      border
      highlight-current-row
      height="200px"
      :data="itemModel.dtoRawMaterialDetailList"
      @selection-change="onChangeSelected">
      <el-table-column align="center" type="selection" width="37" v-if="!isDisabled"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67" v-if="!isDisabled">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-pencil-alt"
            @click="onClickEdit(scope, false)"
          >编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column property="rawMaterialName" label="原材料名称" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column property="rawMaterialValue" label="原材料数量" min-width="90" show-overflow-tooltip></el-table-column>
      <el-table-column property="rawMaterialUnit" label="原材料单位" min-width="110" show-overflow-tooltip></el-table-column>
    </el-table>
    <dialog-modal
      type="title"
      ref="useDialog"
      size="mini"
      appendToBody
      :title="`${editIndex ? '编辑' : '新增'}企业原材料`"
      @close="closeUseDialog">
      <!-- 企业停产报备 -->
      <el-form
        ref="useForm"
        :rules="formRules"
        label-width="100px"
        :model="dtoRawMaterialDetailItem"
        class="mar-t-xs pad-x-sm item-space el-box"
      >
        <el-form-item label="原材料名称：" prop="rawMaterialName" :rules="[{ required: true, message: '请输入原材料名称', trigger: ['change', 'blur'] }]">
          <el-input
            v-model="dtoRawMaterialDetailItem.rawMaterialName"
            clearable
            placeholder="原材料名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="原材料数量：">
          <!-- 正整数 -->
          <el-input-number
            v-model="dtoRawMaterialDetailItem.rawMaterialValue"
            controls-position="right"
            :min="0"
            :max="2147483647"
            :precision="0"
            style="width: 100%;"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="原材料单位：">
          <el-input
            v-model="dtoRawMaterialDetailItem.rawMaterialUnit"
            clearable
            placeholder="原材料单位"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary"
          icon="fas fa-save"
          @click="onSaveUse"
        >
          保 存
        </el-button>
        <el-button icon="fas fa-times"  @click="closeUseDialog">关 闭</el-button>
      </div>
    </dialog-modal>
    <!-- <div v-for="(item, index) in itemModel.dtoRawMaterialDetailList" :key="index">
      <el-row>
        <el-col :span="14">
          <el-form-item :label="'原材料' + (index + 1) + '：'">
            <el-input v-model="item.rawMaterialName" :readonly="isDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label-width="75px" :label="'单位' + (index + 1) + '：'">
            <el-input v-model="item.rawMaterialUnit" :readonly="isDisabled"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item :label="'数量' + (index + 1) + '：'">
            <el-input v-model="item.rawMaterialValue" :readonly="isDisabled"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-button type="danger" @click.prevent="onClickRemove(item)" class="fn-right" round v-if="!isDisabled">删除</el-button>
        </el-col>
      </el-row>
    </div> -->
    <div slot="footer" v-if="!isDisabled">
      <el-button type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck()"
      >
        保 存
      </el-button>
      <el-button icon="fas fa-times"  @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/global/libs/mixins';
import { formatDate } from '@/global/libs/tools';

export default {
  mixins: [saveItem],                     // 使用混合
  data() {
    return {
      isDisabled: false,
      url: 'enterprise/rawMaterial',  // 必须, 接口地址
      selected: [],
      itemModel: {
        dtoRawMaterialDetailList: [{
          rawMaterialName: '',
          rawMaterialUnit: '',
          rawMaterialValue: '',
        }],
        createDate: formatDate(new Date(), 'Y-m-d H:i:s'),
      },          // 表单对象
      formRules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        productName: [
          { required: true, message: '请输入产品名称', trigger: ['blur', 'change'] },
        ],
      },
      dtoRawMaterialDetailItem: {
        rawMaterialName: '',
        rawMaterialUnit: '',
        rawMaterialValue: '',
      },
      editIndex: '',
    };
  },
  computed: {
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.rowGuid;
    },
  },
  methods: {
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
    },
    getEmptyItem() {
      return {
        dtoRawMaterialDetailList: [{
          rawMaterialName: '',
          rawMaterialUnit: '',
        }],
      };
    },
    onClickAdd() {
      this.$refs.useDialog.openDialog();
      this.editIndex = '';
    },
    onClickEdit(item) {
      this.editIndex = `${item.$index}`;
      this.dtoRawMaterialDetailItem = { ...item.row };
      this.$refs.useDialog.openDialog();
    },
    onSaveUse() {
      this.$refs.useForm.validate((valid) => {
        if (!valid) return;
        if (this.editIndex) {
          this.$set(this.itemModel.dtoRawMaterialDetailList, this.editIndex, { ...this.dtoRawMaterialDetailItem });
          // this.itemModel.dtoRawMaterialDetailList[this.editIndex] = { ...this.dtoRawMaterialDetailItem };
        } else {
          this.itemModel.dtoRawMaterialDetailList.push({ ...this.dtoRawMaterialDetailItem });
        }
        this.closeUseDialog();
      });
    },
    closeUseDialog() {
      this.dtoRawMaterialDetailItem = {
        rawMaterialName: '',
        rawMaterialUnit: '',
        rawMaterialValue: '',
      };
      this.$refs.useDialog.closeDialog();
    },
    onClickRemove() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.selected.forEach((item) => {
          const index = this.itemModel.dtoRawMaterialDetailList.indexOf(item);
          if (index !== -1) {
            this.itemModel.dtoRawMaterialDetailList.splice(index, 1);
          }
        });
      });
    },
    // 打开对话框
    openDialog(row, isDisabled) {
      this.isDisabled = isDisabled;
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) this.itemModel.dtoRawMaterialDetailList = [...row.dtoRawMaterialDetailList || ''];
      if (row) {
        this.itemModel.belongYear = `${row.belongYear}`;
        if (!isDisabled) {
          this.itemModel.createDate = row.createDate || formatDate(new Date(), 'Y-m-d H:i:s');
        }
        if (!row.dtoRawMaterialDetailList) {
          this.itemModel.dtoRawMaterialDetailList = [];
        }
      }

      // 显示编辑表单
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      this.$refs.dialog.closeDialog();
    },
    onSaveCheck() {                         // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        if (!this.itemModel.id) delete this.itemModel.id;
        this.onSaveItem((res) => {
          this.itemModel.belongYear = `${res.belongYear}`;
          this.closeDialog();
          this.$emit('query');
        });
      });
    },
  },
};
</script>
