<template>
  <!-- 数采仪 -->
  <el-card fill>
    <div slot="header" class="mar-b-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!dgiSelection.length"
        @click="onDelClick">删 除</el-button>
    </div>
    <!-- <el-table v-loading="loading" :data="dgiList" border stripe @selection-change="dgiSelectionChange"> -->
    <el-table
      v-loading="loading"
      height="calc(100% - 36px)"
      border
      :data="dgiList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="dgiSelectionChange">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="117">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onEditClick(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-paperclip" @click="onClickUpload(scope.row)">附件</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="dgiMN" label="数采仪MN" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ipAddress" label="IP地址" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="accessPassword" label="访问密码" width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="contact" label="联系人" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactPhone" label="联系电话" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>

    <dialog-modal ref="formdialog" :title="`${this.dgiModel.id ? '编辑' : '新增'}数采仪信息`" @close="resetDGIDialog">
      <div class="box-dialog">
        <div class="mar-b-sm">
          <!-- <el-button @click="onSaveDGI" size="small" type="primary">
            <i class="fa fa-floppy-o" aria-hidden="true"></i> 保 存
          </el-button>
          <el-button size="small" @click="dgiVisible = false">
            <i class="fa fa-times" aria-hidden="true"></i> 关 闭
          </el-button> -->
          <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveDGI">保 存</el-button>
          <el-button icon="fas fa-times" @click="$refs.formdialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="dgiForm" :model="dgiModel" label-width="165px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业：" prop="PSName">
                <el-input v-model.trim="activeInfo.psName" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数采仪MN号：" prop="dgiMN">
                <el-input v-model.trim="dgiModel.dgiMN"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数采仪编码：" prop="dgiId">
                <el-input v-model.trim="dgiModel.dgiId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="生产厂家：" prop="manufacturer">
                <el-input v-model.trim="dgiModel.manufacturer"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="使用协议：" prop="protocol">
                <el-select v-model="dgiModel.protocol" style="width:100%">
                  <el-option label="HJT 212-2005" :value="0"></el-option>
                  <el-option label="HJ 212-2017" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="协议类型：" prop="st">
                <el-select v-model="dgiModel.st" style="width:100%">
                  <el-option label="废气协议" :value="31"></el-option>
                  <el-option label="废水协议" :value="32"></el-option>
                  <el-option label="留样协议" :value="42"></el-option>
                  <el-option label="总量协议" :value="43"></el-option>
                  <el-option label="雨水协议" :value="44"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数采仪类型：" prop="dgiTypeCodeId">
                <el-select v-model="dgiModel.dgiTypeCodeId" filterable style="width:100%">
                  <el-option v-for="(item,index) in DGIType" :key="index"
                    :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="IP地址：" prop="ipAddress">
                <el-input v-model.trim="dgiModel.ipAddress"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人：" prop="contact">
                <el-input v-model.trim="dgiModel.contact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="contactPhone">
                <el-input v-model.trim="dgiModel.contactPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="上报端口号：" prop="port">
                <el-input-number
                  v-model="dgiModel.port"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="访问密码：" prop="accessPassword">
                <el-input v-model.trim="dgiModel.accessPassword"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="SIM卡号：" prop="simNum">
                <el-input v-model.trim="dgiModel.simNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-select v-model="dgiModel.status" style="width:100%">
                  <el-option label="启用" :value="0"></el-option>
                  <el-option label="停用" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运维单位：" prop="operateMaintenanceUnit">
                <el-input v-model.trim="dgiModel.operateMaintenanceUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运维单位联系人：" prop="operateMaintenanceContact">
                <el-input v-model.trim="dgiModel.operateMaintenanceContact"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运维单位联系电话：" prop="operateMaintenanceContactPhone">
                <el-input v-model.trim="dgiModel.operateMaintenanceContactPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领用人单位：" prop="getterUnit">
                <el-input v-model.trim="dgiModel.getterUnit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="领用人：" prop="getter">
                <el-input v-model.trim="dgiModel.getter"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领用日期：" prop="getDate">
                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable="false"
                v-model="dgiModel.getDate" type="date" style="width:100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="启用日期：" prop="firstRunDate">
                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable="false"
                v-model="dgiModel.firstRunDate" type="date" style="width:100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否上报分钟数据：" prop="minIsUpload">
                <el-select v-model="dgiModel.minIsUpload" style="width:100%">
                  <el-option label="启用" :value="true"></el-option>
                  <el-option label="停用" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否上报实时数据：" prop="rtdIsUpload">
                <el-select v-model="dgiModel.rtdIsUpload" style="width:100%">
                  <el-option label="启用" :value="true"></el-option>
                  <el-option label="停用" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实时数据上报间隔(秒)：" prop="rtdInterval">
                <el-input-number
                  v-model="dgiModel.rtdInterval"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="分钟数据上报间隔(分)：" prop="minInterval">
                <el-input-number
                  v-model="dgiModel.minInterval"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="超时时间(秒)：" prop="overTime">
                <el-input-number
                  v-model="dgiModel.overTime"
                  controls-position="right"
                  :min="0"
                  :max="2147483647"
                  :precision="0"
                  style="width: 100%;">
                </el-input-number>
                <!-- <el-input v-model.trim="dgiModel.overTime">
                  <span slot="append">(秒)</span>
                </el-input> -->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="连接通讯服务器：" prop="machineId">
                <el-select v-model="dgiModel.machineId" filterable style="width:100%">
                  <el-option v-for="(item,index) in ConnectCommunicationServer" :key="index"
                    :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注：" prop="remark">
            <el-input type="textarea" :autosize="{ minRows: 2 }" v-model.trim="dgiModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </dialog-modal>
    <!-- 企业附件 -->
    <!-- <el-dialog
      title="数采仪附件"
      width="70%" top="10vh"
      :visible.sync="uploadVisible"
      :close-on-click-modal="false">
      <Upload :id="itemId"/>
    </el-dialog> -->
    <dialog-modal ref="uploaddialog" title="数采仪附件"><upload :id="itemId" /></dialog-modal>
  </el-card>
</template>

<script>
import Upload from '@/views/bas/CommonDialog/Upload';
import { mapState } from 'vuex';
// import PagingQuery from '@/components/widgets/PagingQuery';
import * as _cloneDeep from 'lodash/cloneDeep'; // 深拷贝

export default {
  components: {
    // PagingQuery,
    Upload,
  },
  name: 'PSInfoDetailDGI',
  data() {
    const mnRule = (rule, value, callback) => {
      if (value.match(/^([0-9A-Za-z]{14})$/)) {
        callback();
      } else if (value.match(/^([0-9A-Za-z]{24})$/)) {
        callback();
      } else {
        callback(new Error('请输入正确14或24位MN号由字母或数字组成'));
      }
    };
    return {
      loading: false,
      saveLoading: false,
      // 表单dialog
      // dgiVisible: false,
      // 表单model
      dgiModel: {
        psId: '',
        dgiTypeCodeId: '07812f0e56cf42ca8b112a39d8536923',
        dgiMN: '',
        manufacturer: '',
        contact: '',
        contactPhone: '',
        ipAddress: '',
        accessPassword: '',
        simNum: '',
        operateMaintenanceUnit: '',
        operateMaintenanceContact: '',
        operateMaintenanceContactPhone: '',
        getter: '',
        getterUnit: '',
        getDate: '',
        firstRunDate: '',
        port: '',
        dgiId: '',
        protocol: 0,
        st: 31,
        overTime: '',
        rtdInterval: '',
        minInterval: '',
        rtdIsUpload: true,
        minIsUpload: true,
        status: 0,
        remark: '',
        machineId: '38b0712954f448e69596fdd4d8dc4eda',
      },
      emptyItem: {},
      pager: {
        total: 0,
        page: 1,
        rows: 15,
      },
      rules: {
        dgiMN: [
          { required: true, message: '数采仪MN号不能为空', trigger: 'blur' },
          { validator: mnRule, trigger: 'blur' },
        ],
        dgiId: [
          { required: true, message: '数采仪编码不能为空', trigger: 'blur' },
        ],
        machineId: [
          { required: true, message: '请选择连接通讯服务器', trigger: 'blur' },
        ],
      },
      // 数采仪数据列表
      dgiList: [],
      // 数采仪类型下拉框
      DGIType: [],
      // 连接通讯服务器
      ConnectCommunicationServer: [],
      // 多选数组
      dgiSelection: [],
      itemId: '',
      // 图片dialog
      // uploadVisible: false,
    };
  },
  computed: {
    ...mapState({
      activeInfo: state => state.psInfo.activeInfo,
    }),
  },
  watch: {},
  created() {
    this.emptyItem = _cloneDeep(this.dgiModel);
    this.getItemList();
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'DGIType' }).then((val) => {
      this.DGIType = val;
    });
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'ConnectCommunicationServer' }).then((val) => {
      this.ConnectCommunicationServer = val;
    });
  },
  mounted() {},
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.dgiSelection.includes(row) ? className : '';
    },
    // gird多选
    dgiSelectionChange(val) {
      this.dgiSelection = val;
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/dgiInfo', {
        params: { ...this.pager, psId: this.activeInfo.id, sort: 'dgiMN' },
      }).then((response) => {
        this.dgiList = response.data.data;
        this.pager.total = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 删除
    onDelClick() {
      if (this.dgiSelection.length === 0) {
        this.$message('请选择要删除的数据');
        return;
      }
      const ids = this.dgiSelection.map(item => item.id);
      this.$confirm('是否删除选中的数据？', '请确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/dgiInfo', { data: ids })
      )).then((response) => {
        if (response.data.success) {
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功',
            duration: '1500',
          });
          this.getItemList();
        } else {
          this.$message({
            message: response.data.msg,
            type: 'warning',
            duration: '1500',
          });
        }
      });
    },
    // 单击新增按钮
    onClickAdd() {
      this.dgiModel = _cloneDeep(this.emptyItem);
      // this.dgiVisible = true;
      this.$refs.formdialog.openDialog();
    },
    // 编辑
    onEditClick(row) {
      this.dgiModel = _cloneDeep(row);
      if (this.dgiModel.st === 0) this.dgiModel.st = '';
      // this.dgiVisible = true;
      this.$refs.formdialog.openDialog();
    },
    // 保存表单
    onSaveDGI() {
      this.$refs.dgiForm.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.dgiModel.psId = this.activeInfo.id;
        const url = 'bas/dgiInfo';
        this.$http[this.dgiModel.id ? 'put' : 'post'](url, _cloneDeep(this.dgiModel)).then((response) => {
          if (response.data.success) {
            this.$message({
              showClose: true,
              type: 'success',
              message: '操作成功',
              duration: '1500',
            });
            this.getItemList();
            // this.dgiVisible = false;
            this.$refs.formdialog.closeDialog();
          } else {
            this.$message({
              message: response.data.msg,
              type: 'warning',
              duration: '1500',
            });
          }
        }).finally(() => {
          this.saveLoading = false;
        });
      });
    },
    // 重置表单
    resetDGIDialog() {
      this.dgiModel = _cloneDeep(this.emptyItem);
      this.$refs.dgiForm.resetFields();
    },
    // 附件上传
    // 单击上传按钮
    onClickUpload(row) {
      this.itemId = row.id;
      // this.uploadVisible = true;
      this.$refs.uploaddialog.openDialog();
    },
  },
};
</script>

<style scoped>
  .box-dialog {
    width: calc(100% - 5px);
    height: 100%;
    padding-right: 5px;
    overflow-y: auto;
  }
  hr {
    margin: 5px 0;
  }
</style>
