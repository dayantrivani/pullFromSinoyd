<template>
  <dialog-modal ref="dialog"
                title="新增计划"
                maxScrollbar
                size="mini"
                @close="closeDialog">
    <el-form ref="form"
             :rules="rules"
             :model="itemModel"
             v-loading="formLoading"
             label-position="right"
             label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="企业名称："
                        prop="psId">
            <ps-single @selected="selectPsData"
                       :label="itemModel.psName">
            </ps-single>
          </el-form-item>
          <el-form-item label="所属年度："
                        prop="belongYear">
            <el-date-picker v-model="itemModel.belongYear"
                            value-format="yyyy"
                            type="year"></el-date-picker>
          </el-form-item>
          <el-form-item label="检测类型："
                        prop="type">
            <el-select v-model="itemModel.type"
                       @change="typeChange">
              <el-option v-for="(item, index) in $enum.typeOptions"
                         :key="index"
                         :label="item"
                         :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检测周期："
                        prop="cycle">
            <!-- 类型为全年 -->
            <el-select v-model="itemModel.cycle">
              <el-option v-for="(item, index)  in cycleOptions"
                         :key="index"
                         :label="item"
                         :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="动静设备："
                        prop="deviceTypeList">
            <!-- 类型为全年 -->
            <el-checkbox-group v-model="itemModel.deviceTypeList">
              <el-checkbox label="1">动设备</el-checkbox>
              <el-checkbox label="2">静设备</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 icon="fa fa-save"
                 :loading="saveLoading"
                 @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fa fa-times"
                 @click="closeDialog()">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { saveItem } from '@/libs/mixins';
import psSingle from './select-table-psSingle';

export default {
  name: 'DialogForm',
  mixins: [
    saveItem,
  ],
  components: {
    psSingle,
  },
  data() {
    return {
      itemModel: this.getEmptyItem(),
      cycleOptions: [],
      psBaseList: [],
      // 表单验证
      rules: {
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        belongYear: [
          { required: true, message: '请选择所属年份', trigger: ['blur', 'change'] },
        ],
        type: [
          { required: true, message: '请选择检测类型', trigger: ['blur', 'change'] },
        ],
        cycle: [
          { required: true, message: '请选择检测周期', trigger: ['blur', 'change'] },
        ],
      },
      isAuto: false,
      url: 'ldar/plan',
    };
  },
  methods: {
    typeChange() {
      if (this.itemModel.type === 'H') {
        this.cycleOptions = this.$enum.cycleOptionHalf;
      }
      if (this.itemModel.type === 'Q') {
        this.cycleOptions = this.$enum.cycleOptionQuarter;
      }
      if (this.itemModel.type === 'Y') {
        this.cycleOptions = this.$enum.cycleOptionAll;
      }
      this.itemModel.cycle = '';
    },
    // 获取初始对象
    getEmptyItem() {
      return {
        type: '',
        cycle: '',
        belongYear: '',
        psId: '',
        deviceTypeList: [],
      };
    },
    // 保存回调
    saveCallback() {
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
    // 开
    openDialog() {
      this.$refs.dialog.openDialog();
    },
    // 关
    closeDialog() {
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },
    selectPsData(row) {
      this.itemModel.psId = row.id;
      this.itemModel.psName = row.psName;
    },
  },
};
</script>
