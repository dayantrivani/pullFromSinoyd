<template>
  <dialog-modal ref="dialog" size="mini" content-class="" title="新增数据" @close="closeDialog">
    <el-form class="mar-t-sm pad-x-sm item-space" ref="form" label-position="right" label-width="85px"
      v-loading="formLoading" :model="itemModel" :rules="rules">
      <el-form-item label="企业名称：" prop="psId" hint-down>
        <el-select autofocus filterable v-model="itemModel.psId" :disabled="userType === 'ent'"
          @change="(val) => { itemModel.psName = psBaseList.find(v => v.psId === val).psName }">
          <el-option v-for="(item, index) in psBaseList" :key="index" :label="item.psName" :value="item.psId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="点位名称：" prop="portName">
        <el-input v-model="itemModel.portName"></el-input>
      </el-form-item>
      <el-form-item label="样品类型：" prop="sampleTypeCodeId">
        <el-select v-model="itemModel.sampleTypeCodeId">
          <el-option v-for="(item, index) in dict.DataReportingSampleType" :key="index" :label="item.dictName"
            :value="item.rowGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采样时间：" prop="sampleTime">
        <el-date-picker v-model="itemModel.sampleTime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:ss" default-value="00:00:00">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" icon="fas fa-save" :loading="formLoading" @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </template>
  </dialog-modal>
</template>

<script>
// 引入混合 - 保存记录方法
import formRules from './rules';
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';
// import { getDay } from '@/libs/tools';

export default {
  // 使用混合
  mixins: [
    saveItem,
  ],
  // 传入参数项
  props: {
    factorType: String,
  },
  data() {
    return {
      url: 'sm/sampleBasicData/add',  // 必须, 接口地址
      itemModel: {},          // 表单对象
      rules: formRules,
      dict: {
        DataReportingSampleType: [],  // 样品类型
      },
      // 企业基本信息列表
      psBaseList: [],
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    psName() {
      if (this.userType === 'ent') {
        return this.psBaseList.find(v => v.psId === this.orgGuid).psName;
      }
      return this.itemModel.psName;
    },
  },
  created() {
    this.getDictList();
    this.getPsBaseList();
  },
  methods: {
    // 获取空对象
    getEmptyItem() {
      return {
        psId: this.userType === 'ent' ? this.orgGuid : '',    // 企业ID
        psName: this.psName,  // 企业名称
        portName: '',         // 点位名称
        sampleTypeCodeId: this.factorType, // 样品类型
        sampleTime: formatDate(new Date(), 'Y-m-d H:i:s'),       // 采样时间
      };
    },
    // 保存数据后回调
    saveCallback() {
      this.$emit('query');
      this.closeDialog();
    },
    // 打开对话框
    openDialog() {
      // 合并参数对象
      this.itemModel = this.getEmptyItem();

      // 显示编辑表单
      this.$refs.dialog.openDialog();

      // 聚焦输入框
      // this.$nextTick(() => {
      //   this.$refs.form.$el[0].focus();
      // });
    },
    // 关闭对话框
    closeDialog() {
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    // 获取企业列表
    getPsBaseList() {
      this.$http.get('bas/psBaseInfo', {
        params: { page: 1, rows: 10000, psType: -1 },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.psBaseList = response.data.data;
        }
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.formLoading = true;
      // const { id } = this.itemModel;
      this.$http.post(this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
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
          this.formLoading = false;
        });
    },
  },
};
</script>
