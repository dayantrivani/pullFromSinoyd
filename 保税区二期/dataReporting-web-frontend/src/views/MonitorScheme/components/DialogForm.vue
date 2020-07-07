<template>
  <dialog-modal
    ref="dialog"
    size="mini"
    content-class=""
    :title="`${isEdit ? '编辑' : '新增'}数据`"
    @close="closeDialog"
    @change="onChangeDialog">
    <el-form
      class="mar-x-sm item-space"
      ref="form"
      label-position="right"
      label-width="113px"
      v-loading="formLoading"
      :model="itemModel"
      :rules="rules">
      <el-form-item prop="psId" hint-down>
        <template slot="label">
          <span>企业名称 </span>
          <el-tooltip offset="8" effect="dark" transition placement="top-start">
            <div slot="content">
              <p>企业的中文名称，应使用企业的全称，应与工商部门核准的名称相同。</p>
            </div>
            <i class="el-icon-info"></i>
          </el-tooltip>
          <span> ：</span>
        </template>
        <el-select
          autofocus
          filterable
          v-model="itemModel.psId"
          :disabled="userType === 'ent'"
          @change="(val) => { itemModel.psName = psBaseList.find(v => v.psId === val).psName }">
          <el-option
            v-for="(item, index) in psBaseList"
            :key="index"
            :label="item.psName"
            :value="item.psId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监测方案类型：">
        <el-input value="自行监测" readonly></el-input>
      </el-form-item>
      <el-form-item label="执行年份：" prop="executionYear">
        <el-date-picker
          v-model="itemModel.executionYear"
          type="year"
          value-format="yyyy"
          placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="是否需要提醒：" prop="isRemind">
          <el-tooltip :content="itemModel.isRemind ? '是' : '否'" placement="top">
          <el-switch
              v-model="itemModel.isRemind"
              :active-value="true"
              :inactive-value="false">
          </el-switch>
          </el-tooltip>
      </el-form-item> -->
      <el-form-item label="是否重点源：" prop="isKeyPoint">
          <el-tooltip :content="itemModel.isKeyPoint ? '是' : '否'" placement="top">
          <el-switch
              v-model="itemModel.isKeyPoint"
              :active-value="true"
              :inactive-value="false">
          </el-switch>
          </el-tooltip>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onClickSave()">保 存</el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </template>
  </dialog-modal>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { mapGetters } from 'vuex';
// 引入混合 - 保存记录方法
import { saveItem } from '@/global/libs/mixins';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  // 传入参数项
  props: {
    title: String,
    psList: Array,
  },
  data() {
    return {
      url: 'sm/schemeBasicData',  // 必须, 接口地址
      itemModel: {},          // 表单对象
      extendModel: {},        // 表单实体绑定变量
      psBaseList: [],
      dialogHeight: '86vh',
      // 表单验证
      rules: {
        psId: [
          { required: true, message: '请选择企业', trigger: ['blur', 'change'] },
        ],
        executionYear: [
          { required: true, message: '请选择执行年份', trigger: ['blur', 'change'] },
        ],
      },
      // 字典表 http://192.168.11.65:8099/frame/#/pro/dict
    };
  },
  watch: {
    psList: {
      handler(val) {
        this.psBaseList = val;
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 是否为编辑操作(这里rowGuid可能要变成id值)
    isEdit() {
      return this.itemModel.id;
    },
  },
  methods: {
    onChangeDialog(isFull) {
      this.dialogHeight = isFull ? '100vh' : '86vh';
    },
    onChangePsId(psId) {
      const [ps] = this.psBaseList.filter(n => n.id === psId);
      this.itemModel.psName = ps.psName;
    },
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
          if (this.userType === 'ent') {
            this.itemModel.psId = this.orgGuid;
            const [ps] = this.psBaseList.filter(n => n.id === this.orgGuid);
            this.itemModel.psName = ps.psName;
          }
        }
      });
    },
    // 获取空对象
    getEmptyItem() {
      return {
        psName: '',          // 企业名称
        industryTypeCodeId: '',               // 执行年份
        sortControl: false,                   // 是否需要提醒
      };
    },
    onClickSave() {
      this.itemModel.dtoPSBaseInfoExtend = this.extendModel;
      this.onSaveCheck(this.saveCallback);
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 打开对话框
    openDialog(row) {
      this.getPsBaseList();
      // 合并参数对象
      this.itemModel = row ? Object.assign(this.getEmptyItem(), row) : this.getEmptyItem();
      if (row) this.itemModel.executionYear = row.executionYear && row.executionYear.toString();

      // 是否获取单条记录
      // this.getItemOne(row, (data) => {
      //   this.extendModel = data.dtoPSBaseInfoExtend;
      // });

      // 是否需要获取字典表
      this.getDictList();

      // 显示编辑表单
      this.$refs.dialog.openDialog();

      // 聚焦输入框
      // this.$nextTick(() => { this.$refs.form.$el[0].focus(); });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.saveLoading = true;
      const { id } = this.itemModel;
      this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            this.itemModel.executionYear = response.data.data.executionYear
              && response.data.data.executionYear.toString();
            if (callback) {
              callback(response.data.data);
            } else {
              this.$emit('query');
            }
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
    // 关闭对话框
    closeDialog() {
      this.$refs.dialog.closeDialog();
      this.$refs.form.resetFields();
    },
  },
};
</script>
