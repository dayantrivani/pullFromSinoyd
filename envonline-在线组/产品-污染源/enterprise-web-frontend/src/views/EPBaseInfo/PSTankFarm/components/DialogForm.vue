<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    :title="`${isEdit ? '编辑' : '新增'}储罐区详情`"
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
            <el-form-item label="储罐区名称：" prop="tankFarmName">
              <el-input v-model="itemModel.tankFarmName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="tankFarmArea">
              <template slot="label">占地面积（m<sup>2</sup>）：</template>
              <el-input v-model="itemModel.tankFarmArea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="经度：" prop="longitude">
              <el-input v-model="itemModel.longitude" clearable>
                <el-button slot="append" icon="fas fa-map-marker-alt"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="纬度：" prop="latitude">
              <el-input v-model="itemModel.latitude" clearable>
                <el-button slot="append" icon="fas fa-map-marker-alt"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="有无围堰：" prop="isCofferdam">
              <el-tooltip :content="itemModel.isCofferdam ? '有' : '无'" placement="top">
                <el-switch
                  v-model="itemModel.isCofferdam"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有无收集池：" prop="isCcllectionPool">
              <el-tooltip :content="itemModel.isCcllectionPool ? '有' : '无'" placement="top">
                <el-switch
                  v-model="itemModel.isCcllectionPool"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="全景图片：">
              <upload-File
                :isRequest="isRequest"
                :id="itemModel.id || ''"
              />
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
  data() {
    return {
      url: 'bas/psTankFarm',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      saveLoading: false,           // 保存按钮加载状态
      psName: '',                   // 企业名称
      formRules: {                  // 表单验证
        psId: [
          { required: true, message: '请选择企业名称', trigger: ['blur', 'change'] },
        ],
        tankFarmName: [
          { required: true, message: '请输入储罐区名称', trigger: ['blur', 'change'] },
        ],
        tankFarmArea: [
          // { required: true, message: '请输入占地面积', trigger: ['blur', 'change'] },
          { pattern: /(^[-0-9][0-9]*(.[0-9]+)?)$/, message: '请输入数字' },
        ],
        // isCofferdam: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
        // isCcllectionPool: [
        //   { required: true, message: '', trigger: ['blur', 'change'] },
        // ],
      },
      itemModel: {                  // 表单对象
        id: '',                     // 附件id -- 全网唯一标识符
        psId: '',                   // 企业
        tankFarmName: '',           // 储罐区名称
        tankFarmArea: '',           // 占地面积
        isCofferdam: false,         // 有无围堰
        isCcllectionPool: false,    // 有无收集池
        remark: null,
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
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {         // 获取空对象
      return {
        id: '',                     // 附件id -- 全网唯一标识符
        psId: '',                   // 企业
        tankFarmName: '',           // 储罐区名称
        tankFarmArea: '',           // 占地面积
        isCofferdam: false,         // 有无围堰
        isCcllectionPool: false,    // 有无收集池
        remark: null,               // 备注
      };
    },
  },
};
</script>
