<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                :title="`${isEdit ? '编辑' : '新增'}安全动态`"
                @close="closeDialog">
    <el-form ref="form"
             label-position="right"
             label-width="130px"
             :rules="rules"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="安全动态主题："
                        prop="newsSubject">
            <el-input v-model="itemModel.newsSubject"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="动态分类："
                        prop="newsType">
            <el-select v-model="itemModel.newsType"
                       autofocus
                       clearable>
              <el-option v-for="item in $enum.NEWSTYPE"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="正文内容："
                        prop="newsContent">
            <markdown v-model="itemModel.newsContent"></markdown>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="发布人："
                        prop="newsPublisher">
            <el-input v-model="itemModel.newsPublisher"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注："
                        prop="remark">
            <el-input v-model="itemModel.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="附件：">
            <upload-file :id="objectId"
                         :is-update="isUpdate"
                         :isRequest="isRequest"
                         :size-limilt="0"
                         :btn="readOnly? 'down remove' : 'add down remove'" />
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
import markdown from '@/components/markdown';

export default {
  data() {
    return {
      url: 'wholeprocess/safetyNews',
      itemModel: this.getEmptyItem(),
      isUpdate: false,  // 是否调用上传附件的接口
      isRequest: false, // 是否调用获取附件列表的接口
      objectId: '',
      rules: {
        newsSubject: [
          { required: true, message: '请输入安全动态主题', trigger: ['blur', 'change'] },
        ],
        newsType: [
          { required: true, message: '请输入安全动态主题', trigger: ['blur', 'change'] },
        ],
        newsPublisher: [
          { required: true, message: '请输入安全动态主题', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  mixins: [saveItem],
  components: { markdown },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作
    isEdit() {
      return this.itemModel.id;
    },
  },
  props: {
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        newsSubject: '', // 安全动态主题
        newsType: '', // 动态分类（1公司新闻、2公告通知、3其他新闻）
        newsContent: '', // 正文
        newsPublisher: '', // 发布人
        browseCount: '', // 浏览次数
        remark: '', // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
    },
    /** 特殊方法 */
    onSaveCheck(saveCallback) {         // 保存记录
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(saveCallback);
      });
    },
    // 打开对话框
    openDialog(row) {
      if (row) {
        this.itemModel = Object.assign(this.getEmptyItem(), row);
        this.objectId = this.itemModel.id;
        this.isRequest = true;
      } else {
        this.itemModel = this.getEmptyItem();
      }
      this.isUpdate = false;
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isRequest = false;
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 保存数据后回调
    callback() {
      this.objectId = this.itemModel.id;
      this.isUpdate = true;
      this.$emit('query');
      this.$refs.dialog.closeDialog();
    },
  },
};
</script>
