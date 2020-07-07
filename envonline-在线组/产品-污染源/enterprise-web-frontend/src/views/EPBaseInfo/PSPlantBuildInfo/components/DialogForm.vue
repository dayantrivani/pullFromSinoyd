<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}仓库详情`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="135px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="企业名称：" prop="psId" hint-down>
              <select-table v-model="itemModel.psId" :label="psName" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="厂区建筑物名称：" prop="plantBuildName">
              <el-input v-model="itemModel.plantBuildName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item hint-down prop="plantBuildArea">
              <template slot="label">建筑面积（m<sup>2</sup>）：</template>
              <el-input v-model="itemModel.plantBuildArea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="建筑结构：" prop="plantBuildStructure">
              <el-input v-model="itemModel.plantBuildStructure"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="火灾危险等级：" prop="fireHazardGrade">
              <el-select v-model="itemModel.fireHazardGrade">
                <el-option
                  v-for="(item, index) in dictParent.FireHazardGrade"
                  :key="index"
                  :label="item.dictName"
                  :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="层数：" prop="layerNumber">
              <el-input-number
                v-model="itemModel.layerNumber"
                controls-position="right"
                :max="2147483647"
                :min="1">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="建筑物类型：" prop="plantBuildType">
              <el-select v-model="itemModel.plantBuildType">
                <el-option
                  v-for="(item, index) in dictParent.BuildType"
                  :key="index"
                  :label="item.dictName"
                  :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="全景图片：">
              <upload-File
                :isRequest="isRequest"
                :id="itemModel.id || ''"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" prop="remark">
              <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"/>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>

    <div slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import _ from 'lodash';
import SelectTable from '@/components/select-table';
import { saveFile } from '@/global/libs/mixins';
import UploadFile from '@/components/upload-file';

export default {
  // 使用混合
  mixins: [saveFile],
  components: {
    SelectTable,
    UploadFile,
  },
  props: {
    dictParent: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'bas/psPlantBuildInfo',  // 必须, 接口地址
      uploadUrl: 'res/document',
      loading: false,               // 表单加载状态
      psName: '',                   // 企业名称
      formRules: {                  // 表单验证
        psId: [
          { required: true, message: '请选择企业', trigger: ['blur', 'change'] },
        ],
        plantBuildName: [
          { required: true, message: '请输入厂区建筑物名称', trigger: ['blur', 'change'] },
        ],
        plantBuildArea: [
          // { required: true, message: '请输入建筑面积', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        // plantBuildStructure: [
        //   { required: true, message: '请输入建筑结构', trigger: ['blur', 'change'] },
        // ],
        fireHazardGrade: [
          { required: true, message: '请选择火灾危险等级', trigger: ['blur', 'change'] },
        ],
        // layerNumber: [
        //   { required: true, message: '数字不能为空', trigger: ['blur', 'change'] },
        // ],
        // plantBuildType: [
        //   { required: true, message: '请选择建筑物类型', trigger: ['blur', 'change'] },
        // ],
      },
      itemModel: {                  // 表单对象
        id: '',                     // 附件id -- 全网唯一标识符
        psId: '',                   // 企业
        plantBuildName: '',         // 厂区建筑物名称
        plantBuildArea: '',          // 建筑面积
        plantBuildStructure: '',    // 建筑结构
        fireHazardGrade: '',        // 火灾危险等级
        layerNumber: 1,             // 层数
        plantBuildType: '',         // 建筑物类型
        remark: '',                 // 备注
      },
    };
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
        this.isRequest = true;
      } else {
        this.getAttachGuId();
      }
      this.isEdit = !!row;
      this.psName = row ? row.psName : '';
      this.$refs.dialog.openDialog();
      this.getDictList();
    },

    /** 特殊方法 */
    getEmptyItem() {         // 获取空对象
      return {
        id: '',                     // 附件id -- 全网唯一标识符
        psId: '',                   // 企业id
        plantBuildName: '',         // 厂区建筑物名称
        plantBuildArea: '',          // 建筑面积
        plantBuildStructure: '',    // 建筑结构
        fireHazardGrade: '',        // 火灾危险等级
        layerNumber: 0,             // 层数
        plantBuildType: '',         // 建筑物类型
        remark: '',                 // 备注
      };
    },
  },
};
</script>
