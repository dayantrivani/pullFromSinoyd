<template>
<!-- 上传文件 -->
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isSee ? '查看' : isEdit ? '编辑' : '新增'}${title}附件`"
    @close="closeDialog">
    <el-form ref="form"
      :rules="formRules"
      label-width="90px"
      :model="itemModel"
      class="mar-t-xs pad-x-sm item-space el-box"
    >
      <!-- <el-form-item label="文件编码：" prop="fileCode" hint-down>
        <el-input
          v-model="itemModel.fileCode"
          clearable
          :readonly="isSee"
          placeholder="文件编码"
        ></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="编制人id：" prop="makerId">
        <select-info-table
          v-model="itemModel.makerId"
          :isPsId="false"
          type="pe"
          title="编制人id"
          :readonly="isSee"  />
      </el-form-item> -->
      <el-form-item label="编制人姓名：" prop="makerId">
        <select-info-table
          v-model="itemModel.makerId"
          :isPsId="false"
          type="pe"
          title="编制人姓名"
          :label="itemModel.makerName"
          :readonly="isSee"
          @selectRow='peSelectRow' />
      </el-form-item>
      <!-- <el-form-item label="适用部门：" prop="purpose">
        <el-input
          v-model="itemModel.purpose"
          clearable
          :readonly="isSee"
          placeholder="适用部门"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="发布日期：" prop="releaseDate">
        <el-date-picker
          style="width: 100%;"
          popper-class="datehour-picker"
          v-model="itemModel.releaseDate"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:00:00"
          :clearable="false"
          :editable="false"
          :readonly="isSee"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="有效日期：" prop="validDate">
        <el-date-picker
          style="width: 100%;"
          popper-class="datehour-picker"
          v-model="itemModel.validDate"
          type="datetime"
          format="yyyy-MM-dd HH"
          value-format="yyyy-MM-dd HH:59:59"
          :clearable="false"
          :editable="false"
          :readonly="isSee"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="版本号：" prop="version">
        <el-input
          v-model="itemModel.version"
          clearable
          :readonly="isSee"
          placeholder="版本号"
        ></el-input>
      </el-form-item>
      <el-form-item label="排序号：">
        <!-- 正数 -->
        <el-input-number
          v-model="itemModel.orderNum"
          placeholder="排序号"
          :min="0"
          :max="2147483647"
          style="width: 100%;"
          controls-position="right"
          :disabled="isSee"
        >
        </el-input-number>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          type="textarea"
          v-model="itemModel.remark"
          :autosize="{ minRows: 2 }"
          clearable
          :readonly="isSee"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="itemModel.status" :disabled="isSee">
          <el-option label="有效" :value="1"></el-option>
          <el-option label="停用" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件上传：">
        <upload-file
          :id="itemModel.id"
          :is-update="isUpdate"
          :isRequest="isRequest"
          :limit="1"
          :col="1"
          :btn="isSee ? 'down' : 'add down remove'"
          @update-success="updateSuccess" />
      </el-form-item>
    </el-form>
    <div slot="footer" v-if="!isSee">
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
import * as _cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'UploadDialog',
  mixins: [saveItem],
  props: {
    title: {
      default: '',
    },
  },
  data() {
    return {
      url: 'wholeprocess/fileManagement',
      itemModel: {},
      emptyModel: {},
      isEdit: false,
      isSee: false,
      formRules: {
        validDate: [{ required: true, message: '请选择有效日期', trigger: ['blur', 'change'] }],
      },
      // 附件上传相关参数
      isUpdate: false,
      isRequest: false,
      objectId: '',
    };
  },
  // 设置绑定参数
  computed: mapGetters('auth', ['orgGuid']),
  methods: {
    getEmptyItem() {
      return {
        makerId: '', // 预留，暂赋值为空
        makerName: '', // 预留，暂赋值为空
        purpose: '', // 预留，暂赋值为空
        dtoFileApplyDepts: [], // 预留，暂赋值为空
        releaseDate: this.$tools.formatDate(new Date(), 'Y-m-d H:00:00'),
        validDate: this.$tools.formatDate(new Date(), 'Y-m-d H:59:59'),
        status: 1,
      };
    },
    openDialog(item, isSee) {
      this.isSee = Boolean(isSee); // 如果isSee存在就是查看窗口
      if (item.id) {
        this.isEdit = true;
        this.isRequest = true;
      }
      this.itemModel = Object.assign(this.getEmptyItem(), item.id ? item : {});
      this.itemModel.folderId = item.folderId;
      if (isSee) this.setFileRecord();
      this.$refs.dialog.openDialog();
    },
    closeDialog() {
      // 重置获取附件，上传附件变量
      this.isUpdate = false;
      this.isRequest = false;
      this.isEdit = false;
      this.itemModel = _cloneDeep(this.getEmptyItem());
      this.$refs.dialog.closeDialog();
    },
    // 保存弹窗 以及附件
    // 获取附件全网唯一标识符
    getAttachGuId() {
      return new Promise((resolve) => {
        this.loading = true;
        this.$http.get('sys/guid/new').then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$set(this.itemModel, 'id', response.data.data);
            resolve(response);
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }).finally(() => {
          this.loading = false;
        });
      });
    },
    // 保存记录
    onSaveCheck(callback) {
      // 表单是否需要验证
      if (this.isEmptyObj(this.formRules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        // 调用接口获取id
        if (!this.itemModel.id) {
          this.getAttachGuId().then(() => {
            this.isUpdate = true;
          });
        } else {
          this.isUpdate = true;
        }
      });
    },
    // 附件上传成功后回调
    updateSuccess(status, _response) {
      if (status && _response) { // 新增附件接口，且有返回值
        const data = _response.data.data[0];
        this.itemModel.fileName = data.docName;
        this.itemModel.baseDocId = data.id;
        this.itemModel.orgId = this.orgGuid;
        this.itemModel.fileCode = ''; // 预留，暂赋值为空
        this.onSaveItem();
      } else { // 新增附件没有返回值，编辑没有新增附件
        this.onSaveItem();
      }
    },
    // 发送保存记录请求
    onSaveItem() {
      this.saveLoading = true;
      this.$http[this.isEdit ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            this.$emit('query');
            this.closeDialog();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.saveLoading = false;
        });
    },
    setFileRecord() { // 点击查看，新增一次查看记录
      this.$nextTick(() => {
        const { user } = this.$store.state.auth;
        const data = {
          fileId: this.itemModel.id,
          departmentId: user.deptGuid,
          userId: user.userGuid,
          userName: user.userName,
          createTime: this.$tools.formatDate(new Date(), 'Y-m-d H:i:s'),
          browseTimes: '',
        };
        this.$http.post('wholeprocess/fileBrowseRecord', data);
      });
    },
    peSelectRow(item) { // 选择编制人
      this.itemModel.makerName = item.name;
    },
  },
};
</script>

<style>
</style>
