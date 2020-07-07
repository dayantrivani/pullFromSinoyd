<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    maxScrollbar
    append-to-body
    :title="`${isEdit ? '编辑' : '新增'}发展历程`"
    @close="closeDialog">
    <div class="el-box">
      <el-form
        class="mar-t-xs pad-x-sm item-space"
        ref="form"
        label-position="right"
        label-width="100px"
        v-loading="loading"
        :model="itemModel"
        :rules="formRules">

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="时间节点：" prop="nodeDate" hint-down>
              <el-date-picker
                style="width:135px"
                v-model="itemModel.nodeDate"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd 00:00:00"
                :clearable="false"
                :editable="false"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="显示内容：" prop="eventContent">
              <el-input type="textarea" v-model="itemModel.eventContent" :autosize="{ minRows: 2 }"/>
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
import { mapState } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
// import { analyzeResp } from '@/global/libs/util';

export default {
  // 使用混合
  mixins: [saveItem],
  data() {
    return {
      url: 'bas/parkDevelopHistory',        // 必须, 接口地址
      loading: false,               // 表单加载状态
      saveLoading: false,           // 保存按钮加载状态
      isUpload: false,              // 上传附件
      formRules: {                  // 表单验证
        nodeDate: [
          { required: true, message: '请选择时间节点', trigger: ['blur', 'change'] },
        ],
        eventContent: [
          { required: true, message: '请输入显示内容', trigger: ['blur', 'change'] },
        ],
      },
      itemModel: {                  // 表单对象
        psId: '',
        nodeDate: '',           // 时间节点
        eventContent: '',       // 显示内容
      },
    };
  },
  computed: {
    ...mapState({             // 获取存储在sessionStorage 的 user
      user: state => state.auth.user,
    }),
    isEdit() {            // 是编辑还是新增
      return (typeof this.itemModel.id) !== 'undefined';
    },
  },
  methods: {
    openDialog(row) {     // 打开对话框
      this.itemModel = this.getEmptyItem();
      if (row) {
        this.itemModel = _.cloneDeep(row);
      } else {
        this.itemModel.psId = this.user.orgGuid;
      }
      this.$refs.dialog.openDialog();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    closeDialog() {       // 关闭对话框
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },

    /** 请求接口 */

    /** 特殊方法 */
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    getEmptyItem() {         // 获取空对象
      return {
        psId: '',
        nodeDate: '',           // 时间节点
        eventContent: '',       // 显示内容
      };
    },
  },
};
</script>
