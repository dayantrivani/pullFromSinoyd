<template>
  <dialog-modal ref="dialog"
                size="middle"
                maxScrollbar
                title="事故案例"
                @close="closeDialog">
    <el-form ref="form"
             disabled
             label-position="right"
             label-width="100px"
             :model="itemModel">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="事故案例："
                        prop="title" hint-down>
            <el-input v-model="itemModel.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="事故类别："
                        prop="caseCategoryCodeId" hint-down>
            <el-select v-model="itemModel.caseCategoryCodeId"
                       clearable>
              <el-option v-for="item in dict.caseCategoryCode"
                       :key="item.rowGuid"
                       :label="item.dictName"
                       :value="item.rowGuid"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="正文内容："
                        prop="bodyText">
            <markdown v-model="itemModel.bodyText"></markdown>
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
      <el-button icon="fas fa-times"
                 @click="closeDialog">关 闭</el-button>
    </div>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import markdown from '@/components/markdown';

export default {
  data() {
    return {
      url: 'wholeprocess/accidentCase',
      itemModel: this.getEmptyItem(),
      isAuto: false,
      isUpdate: false,  // 是否调用上传附件的接口
      isRequest: false, // 是否调用获取附件列表的接口
      objectId: '',
      dict: {
        caseCategoryCode: [], // 案例类别
      },
    };
  },
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
        title: '',
        caseCategoryCodeId: '',
        bodyText: '',         // 正文
        remark: '',           // 备注
        psId: this.userType === 'ent' ? this.orgGuid : '', // 企业id
      };
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
      this.getDictList();
      this.$refs.dialog.openDialog();
    },
    // 关闭对话框
    closeDialog() {
      this.isRequest = false;
      this.itemModel = this.getEmptyItem();
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 获取数据字典
    getDictList() {
      Object.keys(this.dict).forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => {
          this.dict[key] = val;
        });
      }));
    },
  },
};
</script>
