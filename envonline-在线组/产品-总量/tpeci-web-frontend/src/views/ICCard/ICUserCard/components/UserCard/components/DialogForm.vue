<template>
  <dialog-modal
    type="title"
    ref="dialog"
    size="mini"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}基本信息`"
  >
    <el-form
      ref="form"
      :rules="formRules"
      :model="itemModel"
      label-width="90px"
      class="item-space pad-a-xs"
    >
      <el-form-item label="卡类型：" hint-down>
        <el-select value="1" disabled>
          <el-option value="1" label="用户卡"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡号：" prop="cardCode">
        <el-input v-model="itemModel.cardCode" :disabled="isEdit">
          <el-button slot="append" icon="fas fa-address-card" @click="onReadCard"> 读 卡</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="持卡人：" prop="optionName">
        <el-input v-model="itemModel.optionName" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系电话：" prop="telephone">
        <el-input v-model="itemModel.telephone" clearable></el-input>
      </el-form-item>
      <el-form-item label="关联站点：" prop="portId">
        <select-port-one
          :disabled="isEdit"
          v-model="itemModel.portId"
          filterable
          :options="select.portList"
          :field="[
            { name: 'psName', key: 'psId' },
            { name: 'portName', key: 'id' }
          ]"
          @change="onChangePort">
        </select-port-one>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import SelectPortOne from './SelectPortOne';

export default {
  mixins: [saveItem],                     // 使用混合
  components: {
    SelectPortOne,
  },
  data() {
    return {
      url: 'tpeci/iCUserCard',
      itemModel: {
        regionCodeId: '',
        regionName: '',
        psId: '',
        psName: '',
        portId: '',
        portName: '',
        cardCode: '',
        optionName: '',
        telephone: '',
        optionId: '', // 预留，用户id
        cardStatus: 1,
      },
      select: {
        portList: [],
      },
      formRules: { // 表单验证规则
        portId: [
          { required: true, message: '请选择站点', trigger: ['change', 'blur'] },
        ],
        cardCode: [
          { required: true, message: '请输入卡号', trigger: ['change', 'blur'] },
        ],
        optionName: [
          { required: true, message: '请输入持卡人', trigger: ['change', 'blur'] },
        ],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: ['change', 'blur'] },
          { max: 15, message: '请输入合适联系电话', trigger: ['change', 'blur'] },
        ],
      },
      socket: '',
      dtoSend: {
        Order: '', // 命令
        Param: '', // 参数
      },
    };
  },
  created() {
    this.init();
  },
  destroyed() {
    this.socket.close();
  },
  computed: {
    ...mapGetters('auth', ['userName']),
    isEdit() {                      // 是否为编辑对话框
      return this.itemModel.id && true;
    },
  },
  methods: {
    init() {
      this.socket = new WebSocket('ws://127.0.0.1:10086/websocket');
      // 监听socket连接
      this.socket.onopen = this.open;
      // 监听socket错误信息
      this.socket.onerror = this.error;
      // 监听socket消息
      this.socket.onmessage = this.getMessage;
      // 监听socket关闭
      this.socket.onclose = this.close;
    },
    open() {
      // eslint-disable-next-line
      console.log('socket连接成功');
    },
    error() {
      // eslint-disable-next-line
      console.log('连接错误');
    },
    getMessage(msg) {
      const data = JSON.parse(msg.data);
      // eslint-disable-next-line
      console.log(data);
      // 读卡
      if (data.Order === 'selectCard') {
        if (data.Success) {
          this.itemModel.cardCode = data.Data.cardNum;
        } else {
          this.$message.error(data.Message);
        }
      }
      // 初始化卡片
      if (data.Order === 'initCard') {
        if (data.Success) {
          this.$message.success(data.Message);
        } else {
          this.$message.error(data.Message);
        }
      }
    },
    onReadCard() {                 // 读卡
      // 监听WebSocket是否处于关闭状态
      if (this.socket.readyState === WebSocket.OPEN) {
        this.dtoSend.Order = 'selectCard';
        this.socket.send(JSON.stringify(this.dtoSend));
      }
    },
    close() {
      // eslint-disable-next-line
      console.log('socket已经关闭');
    },
    onChangePort(val) {
      if (val) {
        const [portItem] = this.select.portList.filter(n => n.id === val.value);
        this.itemModel.regionCodeId = portItem.regionCodeId;
        this.itemModel.regionName = portItem.regionName;
        this.itemModel.psId = portItem.psId;
        this.itemModel.psName = portItem.psName;
        this.itemModel.portName = portItem.portName;
      } else {
        this.itemModel.regionCodeId = '';
        this.itemModel.regionName = '';
        this.itemModel.psId = '';
        this.itemModel.psName = '';
        this.itemModel.portName = '';
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
    saveCallback(data) {                // 保存请求回调
      if (this.socket.readyState === WebSocket.OPEN) {
        this.dtoSend.Order = 'initCard';
        const params = {
          'ICId': data.id, // 卡片Id
          'CardType': '00', // 卡片类型 00用户卡 01稽查卡 02维护卡
        };
        this.dtoSend.Param = JSON.stringify(params);
        this.socket.send(JSON.stringify(this.dtoSend));
      }
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    /* 接口方法 */
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          childPortType: 5,
          page: 1,
          rows: 100000,
          portType: 1,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data;
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    /* 特殊方法 */
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
        cardCode: val.cardCode || '',
        optionName: val.optionName || '',
        telephone: val.telephone || '',
        optionId: val.optionId || '',
        cardStatus: val.cardStatus || 1,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
