<template>
  <!-- 数采仪 -->
  <el-card class="title-card" type="title">
    <template slot="header">数采仪</template>
    <div class="mar-l-sm mar-y-xs" v-if="userType === 'gov'">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelClick">删 除</el-button>
    </div>
    <el-table
      v-if="userType === 'gov'"
      border
      height="calc(100% - 70px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
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
    <el-table
      v-if="userType !== 'gov'"
      border
      height="calc(100% - 32px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      @selection-change="changeSelected">
      <!-- <el-table-column align="center" type="selection" width="36"></el-table-column> -->
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <!-- <el-table-column align="center" label="操作" width="117">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onEditClick(scope.row)">编辑</el-button>
          <el-button type="primary" icon="fas fa-paperclip" @click="onClickUpload(scope.row)">附件</el-button>
        </template>
      </el-table-column> -->
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

    <dialog-modal ref="formdialog" title="数采仪信息" @close="resetDGIDialog">
      <div class="box-dialog">
        <div class="mar-b-sm">
          <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveDGI">保 存</el-button>
          <el-button icon="fas fa-times" @click="$refs.formdialog.closeDialog()">关 闭</el-button>
        </div>
        <hr>
        <el-form ref="dgiForm" :model="dgiModel" label-width="160px" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="企业：" prop="PSName">
                <el-input v-model.trim="psInfo.psName" :disabled="true"></el-input>
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
              <el-form-item label="数采仪类型：" prop="dgiTypeCodeId">
                <el-select v-model="dgiModel.dgiTypeCodeId" filterable style="width:100%">
                  <el-option v-for="(item,index) in dict.DGIType" :key="index"
                    :label="item.dictName" :value="item.rowGuid"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="IP地址：" prop="ipAddress">
                <el-input v-model.trim="dgiModel.ipAddress"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系人：" prop="contact">
                <el-input v-model.trim="dgiModel.contact"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话：" prop="contactPhone">
                <el-input v-model.trim="dgiModel.contactPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上报端口号：" prop="port">
                <el-input-number
                  :step-strictly="true"
                  controls-position="right"
                  v-model="dgiModel.port"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="访问密码：" prop="accessPassword">
                <el-input v-model.trim="dgiModel.accessPassword"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SIM卡号：" prop="simNum">
                <el-input v-model.trim="dgiModel.simNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="状态：" prop="status">
                <el-select v-model="dgiModel.status" style="width:100%">
                  <el-option label="启用" :value="0"></el-option>
                  <el-option label="停用" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运维单位：" prop="operateMaintenanceUnit">
                <el-input v-model.trim="dgiModel.operateMaintenanceUnit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="运维单位联系人：" prop="operateMaintenanceContact">
                <el-input v-model.trim="dgiModel.operateMaintenanceContact"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运维单位联系电话：" prop="operateMaintenanceContactPhone">
                <el-input v-model.trim="dgiModel.operateMaintenanceContactPhone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="领用人单位：" prop="getterUnit">
                <el-input v-model.trim="dgiModel.getterUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="领用人：" prop="getter">
                <el-input v-model.trim="dgiModel.getter"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="领用日期：" prop="getDate">
                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable="false" placeholder="选择日期"
                v-model="getDate" type="date" style="width:100%"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="启用日期：" prop="firstRunDate">
                <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" :editable="false" placeholder="选择日期"
                v-model="firstRunDate" type="date" style="width:100%"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否上报分钟数据：" prop="minIsUpload">
                <el-select v-model="dgiModel.minIsUpload" style="width:100%">
                  <el-option label="启用" :value="true"></el-option>
                  <el-option label="停用" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否上报实时数据：" prop="rtdIsUpload">
                <el-select v-model="dgiModel.rtdIsUpload" style="width:100%">
                  <el-option label="启用" :value="true"></el-option>
                  <el-option label="停用" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="实时数据上报间隔：" prop="rtdInterval">
                <el-input v-model.trim="dgiModel.rtdInterval">
                  <span slot="append">(秒)</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分钟数据上报间隔：" prop="minInterval">
                <el-input v-model.trim="dgiModel.minInterval">
                  <span slot="append">(分)</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="超时时间：" prop="overTime">
                <el-input v-model.trim="dgiModel.overTime">
                  <span slot="append">(秒)</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="连接通讯服务器：" prop="machineId">
                <el-select v-model="dgiModel.machineId" filterable style="width:100%">
                  <el-option v-for="(item,index) in dict.ConnectCommunicationServer" :key="index"
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
    <dialog-modal ref="uploaddialog" title="数采仪附件"><upload :id="itemId" /></dialog-modal>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import Upload from '@/components/upload';
import * as _cloneDeep from 'lodash/cloneDeep'; // 深拷贝

export default {
  components: {
    // PagingQuery,
    Upload,
  },
  name: 'PSInfoDetailDGI',
  data() {
    const mnRule = (rule, value, callback) => {
      if (value.match(/^([0-9A-Za-z]{14})$/) || value.match(/^([0-9A-Za-z]{24})$/)) {
        callback();
      } else {
        callback(new Error('请输入14位或24位正确MN号由字母或数字组成'));
      }
    };
    return {
      loading: false,
      saveLoading: false,
      selectedIds: [],
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
        count: 0,
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
      dict: {
        DGIType: [], // 数采仪类型下拉框
        ConnectCommunicationServer: [], // 连接通讯服务器
      },
      // 数采仪数据列表
      itemList: [],
      itemId: '',
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    getDate: {
      get() {
        return this.dgiModel.getDate === '1900-01-01 00:00:00'
          ? ''
          : this.dgiModel.getDate;
      },
      set(val) {
        this.dgiModel.getDate = val || '1900-01-01 00:00:00';
      },
    },
    firstRunDate: {
      get() {
        return this.dgiModel.firstRunDate === '1900-01-01 00:00:00'
          ? ''
          : this.dgiModel.firstRunDate;
      },
      set(val) {
        this.dgiModel.firstRunDate = val || '1900-01-01 00:00:00';
      },
    },
    psInfo() { // 企业信息页面点击获取企业id
      return this.$store.state.psInfo || JSON.parse(window.sessionStorage.getItem('psInfo'));
    },
  },
  watch: {},
  created() {
    this.emptyItem = _cloneDeep(this.dgiModel);
    this.getItemList();
  },
  mounted() {},
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    isEmptyObj(obj) { // 判断对象是否为空
      return Object.keys(obj).length === 0;
    },
    getDictList() { // 获取字典表数据
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
    },
    // 获取数据项列表
    getItemList() {
      this.loading = true;
      this.$http.get('bas/dgiInfo', {
        params: {
          ...this.pager,
          psId: this.psInfo.id,
          sort: 'dgiMN-',
        },
      }).then((response) => {
        this.itemList = response.data.data;
        this.pager.count = response.data.count;
      }).finally(() => {
        this.loading = false;
      });
    },
    // 删除
    onDelClick() {
      this.$confirm('是否删除选中的数据？', '请确定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/dgiInfo', { data: this.selectedIds })
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
      this.getDictList();
      this.$refs.formdialog.openDialog();
    },
    // 编辑
    onEditClick(row) {
      this.dgiModel = _cloneDeep(row);
      // this.dgiVisible = true;
      this.getDictList();
      this.$refs.formdialog.openDialog();
    },
    // 保存表单
    onSaveDGI() {
      this.$refs.dgiForm.validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.dgiModel.psId = this.psInfo.id;
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
