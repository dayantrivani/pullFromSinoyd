<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    title="开关阀详情"
  >
    <el-form
      ref="form"
      :rules="formRules"
      :model="itemModel"
      label-width="90px"
      class="item-space pad-a-xs"
    >
      <el-form-item label="站点名称：" prop="portId" hint-down>
        <el-select v-model="itemModel.portId" @change="onChangePort" clearable>
          <el-option
            v-for="item in portList"
            :key="item.id"
            :value="item.id"
            :label="item.portName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申报人：">
        <el-input v-model="userName" readonly></el-input>
      </el-form-item>
      <el-form-item label="关阀记录：" prop="closeRecord">
        <el-input
          readonly
          v-model="itemModel.closeRecord"
          type="textarea"
          :rows="4"></el-input>
      </el-form-item>
      <el-form-item label="申报时间：">
        <el-date-picker
          style="width: 100%"
          v-model="itemModel.applyTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申报原因：">
        <el-input v-model="itemModel.applyReason" type="textarea" :rows="4"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="success"
        :disabled="[1, 2, '1', '2'].includes(itemModel.status)"
        icon="fas fa-cloud-upload-alt"
        :loading="saveLoading"
        @click="onSaveCheck(1, saveCallback)">提 交
      </el-button>
      <el-button
        type="primary"
        :disabled="[1, 2, '1', '2'].includes(itemModel.status)"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(0, saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import { formatDate } from '@/global/libs/tools';

export default {
  mixins: [saveItem],                     // 使用混合
  data() {
    return {
      url: 'tpeci/valveOpenApply',
      itemModel: {
        portId: '',
        applyTime: formatDate(new Date(), 'Y-m-d H:i:s'),
        applyReason: '',
        closeRecord: '',
        status: 0,
      },
      portList: [],
      valveRecord: [], // 关阀记录
      formRules: { // 表单验证规则
        portId: [
          { required: true, message: '请选择申报排口', trigger: ['change', 'blur'] },
        ],
        closeRecord: [
          { required: true, message: '该排口未查询到关阀记录', trigger: ['change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userName']),
  },
  methods: {
    onChangePort(val) {
      if (val) {
        const [portItem] = this.portList.filter(n => n.id === val);
        this.itemModel.regionCodeId = portItem.regionCodeId;
        this.itemModel.regionName = portItem.regionName;
        this.itemModel.psId = portItem.psId;
        this.itemModel.psName = portItem.psName;
        this.itemModel.portName = portItem.portName;
        this.getValveList([val]);
      } else {
        this.itemModel.closeRecord = '';
      }
    },
    openDialog(row) {
      this.$refs.dialog.openDialog();
      this.itemModel = this.setEmptyItem(row);
      this.getPortList();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    // 保存记录
    onSaveCheck(status, callback) {
      // 表单是否需要验证
      if (this.isEmptyObj(this.formRules)) {
        this.onSaveItem(status, callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(status, callback);
      });
    },
    /* 接口方法 */
    getPortList() {
      this.$http.get('tpeci/valveOpenApply/getClosedPort').then((response) => {
        if (response.data.success) {
          this.portList = response.data.data || [];
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getValveList(portIds) {
      this.$http.post('tpeci/tPECIWaterValveStatus', {
        isAll: false,
        portIds,
        type: ['01', '02', '03', '04', '05', '06', '07'],
        sort: 'Tstamp-',
      }, {
        params: {
          page: 1,
          rows: 1,
        },
      }).then((response) => {
        if (response.data.success) {
          const [valveRecord] = response.data.data || [];
          if (valveRecord) { // 如果存在关阀记录
            const {
              psName,
              portName,
              tstamp,
              ctypeValue,
            } = valveRecord;
            this.valveRecord = valveRecord;
            this.itemModel.closeRecord = `${psName} ${portName} 阀门从${tstamp}${ctypeValue}`;
          } else {
            this.itemModel.closeRecord = '';
          }
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    // 发送保存记录请求
    onSaveItem(status, callback) {
      callback();
      this.saveLoading = true;
      const { id } = this.itemModel;
      this.itemModel.status = status;
      this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
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
            this.itemModel.status = 0;
          }
        }, ({ response }) => {
          this.itemModel.status = 0;
          analyzeResp(response);
        }).finally(() => {
          this.saveLoading = false;
        });
    },
    /* 特殊方法 */
    saveCallback() {             // 保存按钮回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    setEmptyItem(val = {}) {             // 将列表数据赋值给表单数据
      let item = {};
      if (val.id) item = { id: val.id }; // 唯一标识符
      return {
        ...item,
        regionCodeId: val.regionCodeId || '',
        regionName: val.regionName || '',
        psId: val.psId || '',
        psName: val.psName || '',
        portId: val.portId || '',
        portName: val.portName || '',
        closeRecord: val.closeRecord || '',
        applyReason: val.applyReason || '',
        applyTime: val.applyTime || formatDate(new Date(), 'Y-m-d H:i:s'),
        status: val.status || 0,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
