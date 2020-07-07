<template>
  <!-- 自定义设置对话框宽度 -->
  <dialog-modal
    type="title"
    ref="dialog"
    width="35%"
    maxScrollbar
    :title="`${isEdit ? '编辑' : '新增'}基本信息`"
  >
    <div class="title-info mar-b-xs">基本信息</div>
    <el-form
      ref="form"
      :rules="formRules"
      :model="itemModel"
      label-width="90px"
      class="item-space pad-a-xs"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="卡类型：" hint-down prop="cardType">
            <el-select v-model="itemModel.cardType">
              <el-option
                v-for="(item,index) in $enum.get('IC_CARD_TYPE')"
                :key="index"
                :value="item.value"
                :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡号：" prop="cardCode">
            <el-input v-model="itemModel.cardCode" :disabled="isEdit">
              <el-button slot="append" icon="fas fa-address-card" @click="onReadCard"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="单位名称：" prop="affiliationUnit">
            <el-input v-model="itemModel.affiliationUnit" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门名称：">
            <el-input v-model="itemModel.department" clearable></el-input>
          </el-form-item>
          <el-form-item label="持卡人：" prop="optionName">
            <el-input v-model="itemModel.optionName" clearable></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="telephone">
            <el-input v-model="itemModel.telephone" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="title-info mar-b-xs">关联站点</div>
    <div class="pad-b-sm">
      <div class="mar-l-sm mar-y-xs">
        <el-form inline :model="queryForm">
          <el-form-item label="企业名称：">
            <el-input
              clearable
              placeholder="请输入企业名称"
              v-model="queryForm.psName"
              @keyup.enter.native="getPortList"
            ></el-input>
            <!-- @blur="getItemList" -->
          </el-form-item>
          <el-form-item label="所属区域：">
            <area-select
              placeholder="请选择"
              v-model="queryForm.regionCodeId"
              @setLabel="getPortList"/>
          </el-form-item>
        </el-form>
      </div>
      <el-transfer
        v-if="isShow"
        ref="transfer"
        v-loading="transferLoading"
        v-model="portIds"
        style="height: 380px"
        filterable
        :titles="['待选', '已选']"
        :data="select.portList"
        :props="{
          key: 'id',
          label: 'portName'
        }">
      </el-transfer>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        icon="fas fa-save"
        :loading="saveLoading"
        @click="onSaveCheck(saveCallback)">保 存
      </el-button>
      <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
    </span>
  </dialog-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';
import AreaSelect from '@/components/widgets/area-select';

export default {
  mixins: [saveItem],                     // 使用混合
  components: { AreaSelect },
  data() {
    return {
      isShow: false,
      url: 'tpeci/iCManageCard',
      transferLoading: false,
      queryForm: {
        cardId: '',
        psName: '',
        regionCodeId: '',
      },
      itemModel: {
        cardCode: '',
        optionName: '',
        telephone: '',
        department: '',
        affiliationUnit: '',
        cardType: 1,
        optionId: '', // 预留，用户id
        cardStatus: 1,
      },
      select: {
        portList: [],
        // itemList: [], // 关联排口列表
      },
      portIds: [], // 关联排口id数组
      formRules: { // 表单验证规则
        cardCode: [
          { required: true, message: '请输入卡号', trigger: ['change', 'blur'] },
        ],
        cardType: [
          { required: true, message: '请选择卡类型', trigger: ['change', 'blur'] },
        ],
        affiliationUnit: [
          { required: true, message: '请输入单位名称', trigger: ['change', 'blur'] },
        ],
        optionName: [
          { required: true, message: '请输入持卡人', trigger: ['change', 'blur'] },
        ],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: ['change', 'blur'] },
          { max: 15, message: '请输入合适联系电话', trigger: ['change', 'blur'] },
        ],
      },
      socket: {},
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

    openDialog(row) {
      this.isShow = true;
      this.$refs.dialog.openDialog();
      this.itemModel = this.setEmptyItem(row);
      this.queryForm = {
        // cardId: row ? row.id : '',
        psName: '',
        regionCodeId: '',
      };
      this.portIds = [];
      if (row && row.id) this.getItemList();
      this.getPortList();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    closeDialog() {
      this.isShow = false;
      this.$refs.dialog.closeDialog();
    },
    saveCallback(data) {                // 保存请求回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
      this.queryForm.cardId = this.itemModel.id; // 保存表单回调，将id赋值给cardId用来关联排口
      const body = this.select.portList.filter(n => this.portIds.includes(n.id)).map(n => ({
        portId: n.id,
        cardId: data.id,
        regionCodeId: n.id,
        regionName: n.regionName,
        psId: n.psId,
        psName: n.psName,
        portName: n.portName,
      }));
      this.setPortList(body);
      if (this.socket.readyState === WebSocket.OPEN) {
        // 初始化卡片
        this.dtoSend.Order = 'initCard';
        const params = {
          'ICId': data.id, // 卡片Id
          'CardType': `0${data.cardType}`, // 卡片类型 00用户卡 01稽查卡 02维护卡
        };
        this.dtoSend.Param = JSON.stringify(params);
        this.socket.send(JSON.stringify(this.dtoSend));
      }
    },
    /* 接口方法 */
    // 获取关联排口列表
    getItemList() {
      this.$http.get('tpeci/iCManageCard2Port', {
        params: { page: 1, rows: 1000000, cardId: this.queryForm.cardId },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          // this.select.itemList = response.data.data;
          this.portIds = response.data.data.map(n => n.portId);
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },
    getPortList() {              // 获取排口点位列表
      this.$http.get('bas/portInfo/queryAuthority', {
        params: {
          childPortType: 5,
          page: 1,
          rows: 100000,
          portType: 1,
          psName: this.queryForm.psName,
          regionCodeId: this.queryForm.regionCodeId,
          sort: 'psName+,portName',
        },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.select.portList = response.data.data;
          if (this.queryForm.cardId) this.getItemList();
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.transferLoading = false;
      });
    },
    setPortList(body) {              // 关联排口列表
      this.saveLoading = true;
      this.$http.post(`tpeci/iCManageCard2Port/${this.queryForm.cardId}`, body).then((response) => {
        if (response.status !== 200 || !response.data.success) {
          this.$message.warning({
            message: response.data.msg || response.data.message,
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
    /* 特殊方法 */
    setEmptyItem(val = {}) {             // 将列表数据赋值给表单数据
      let item = {};
      if (val.id) item = { id: val.id }; // 唯一标识符
      return {
        ...item,
        department: val.department || '',
        affiliationUnit: val.affiliationUnit || '',
        cardType: val.cardType || 1,
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
