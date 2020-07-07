<template>
  <!-- 仪器动态管控 -->
  <el-card fill>
    <!-- 头部 -->
    <div slot="header">
      <el-form slot="header" inline>
        <el-form-item label="关键字：">
          <el-input v-model="keyWord" clearable style="width: 220px;" placeholder="仪器名称、仪器编号、站点名称"></el-input>
        </el-form-item>
        <el-form-item label="仪器类型：">
          <el-select v-model="instrumentType.data">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in instrumentType.option" :key="index"
              :label="item.dictName" :value="item.rowGuid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="status.data">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(value, key) in status.option" :key="key"
              :label="value" :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onSearchQuery">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-plus" @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selection.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <!-- 表格 -->
    <!-- <el-table stripe :data="tableData" @selection-change="handleSelectionChange"
      v-loading="tableLoading" border class="mar-t-sm" style="width: 100%"> -->
    <el-table
      v-loading="tableLoading"
      height="calc(100% - 76px)"
      border
      :data="tableData"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
      <el-table-column align="center" label="操作" width="67">
        <template slot-scope="scope">
          <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <!-- prop="" 内容 min-width="120" 长度-->
      <!--
        修改 - 原
        instrumentTypeName - instrumentType
        psName - psId
        statusName - status
        由于获取的数据只有编码,显示的却必须是名称;
        原字符串又会在其余地方使用,故添加新的字符串记录编码对应的名称
        -->
      <el-table-column prop="instrumentTypeName" label="仪器类型" min-width="120" align="center"
        show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{(instrumentType.option.filter(n => n.rowGuid === row.instrumentType)[0] || []).dictName}}
        </template>
      </el-table-column>
      <el-table-column prop="instrumentName" label="仪器名称" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentCode" label="仪器编号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="instrumentModel" label="仪器型号" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="psName" label="污染源名称" min-width="150" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="portName" label="站点名称" min-width="120" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="effectiveDate" label="有效期" min-width="150" align="center"
        show-overflow-tooltip></el-table-column>
      <el-table-column prop="statusName" label="状态" min-width="80" align="center"
        show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 15, 35, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination> -->
    <paging-query :pager="pager" @query="onSearchQuery"/>
    <!-- 新增对话框 -->
    <!-- <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false"
      @closed="onDialogClose('tableForm')" title="仪器信息" width="70%">
      <el-form ref="tableForm" label-position="right" label-width="120px"
        :model="itemModel" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪器名称：" prop="instrumentName">
              <el-input v-model.trim="itemModel.instrumentName" disabled>
                <el-button slot="append" @click="onClickBasin()">
                  <i :class="'fa fa-th-list'"></i>
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器类型：" prop="instrumentType">
              <el-select v-model.trim="itemModel.instrumentType" placeholder="请选择"
                clearable  style="width: 100%" disabled>
                <el-option v-for="(item,index) in formData.instrumentType" :key="index"
                  :label="item.dictName" :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪器编号：" prop="instrumentCode">
              <el-input v-model.trim="itemModel.instrumentCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器型号：" prop="instrumentModel">
              <el-input v-model.trim="itemModel.instrumentModel" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="本站编号：">
              <el-input v-model.trim="itemModel.innerCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="污染源名称：" prop="psId">
              <el-input v-model.trim="activeInfo.psName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="站点名称：" prop="portId">
              <el-select v-model.trim="itemModel.portId" placeholder="请选择站点名称"
                clearable  style="width: 100%">
                <el-option v-for="(item,index) in formData.portName" :key="index"
                  :label="item.portName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂日期：" prop="leaveTime">
              <el-date-picker v-model.trim="itemModel.leaveTime" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登记日期：" prop="registerDate">
              <el-date-picker v-model.trim="itemModel.registerDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在位置：">
              <el-input v-model.trim="itemModel.location"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态：" prop="status">
              <el-select v-model.trim="itemModel.status" placeholder="请选择状态"
                clearable  style="width: 100%">
                <el-option v-for="(value,key,index) in formData.status" :key="key"
                  :label="value" :value="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装时间：" prop="setupDate">
              <el-date-picker v-model.trim="itemModel.setupDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="有效期：" prop="effectiveDate">
              <el-date-picker v-model.trim="itemModel.effectiveDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器校准日期：" prop="calibrationDate">
              <el-date-picker v-model.trim="itemModel.calibrationDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="onSaveItem('tableForm')">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> 保 存
        </el-button>
        <el-button size="small" @click="dialogVisible = false">
          <i class="fa fa-times" aria-hidden="true"></i> 关 闭
        </el-button>
      </div>
    </el-dialog> -->
    <dialog-modal ref="formdialog" title="新增仪器信息" @closed="onDialogClose('tableForm')">
      <el-form class="mar-t-xs" ref="tableForm" label-width="120px" :model="itemModel" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪器名称：" prop="instrumentName">
              <el-input v-model.trim="itemModel.instrumentName" disabled>
                <el-button slot="append" @click="onClickBasin()">
                  <i :class="'fa fa-th-list'"></i>
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器类型：" prop="instrumentType">
              <el-select v-model.trim="itemModel.instrumentType" style="width: 100%" disabled>
                <el-option v-for="(item,index) in formData.instrumentType" :key="index"
                  :label="item.dictName" :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="仪器编号：" prop="instrumentCode">
              <el-input v-model.trim="itemModel.instrumentCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器型号：" prop="instrumentModel">
              <el-input v-model.trim="itemModel.instrumentModel" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="本站编号：">
              <el-input v-model.trim="itemModel.innerCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="污染源名称：" prop="psId">
              <el-input v-model.trim="activeInfo.psName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="站点名称：" prop="portId">
              <el-select v-model.trim="itemModel.portId" style="width: 100%">
                <el-option v-for="(item,index) in formData.portName" :key="index"
                  :label="item.portName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出厂日期：" prop="leaveTime">
              <el-date-picker v-model.trim="itemModel.leaveTime" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="登记日期：" prop="registerDate">
              <el-date-picker v-model.trim="itemModel.registerDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所在位置：">
              <el-input v-model.trim="itemModel.location"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态：" prop="status">
              <el-select v-model.trim="itemModel.status" style="width: 100%">
                <el-option v-for="(value,key,index) in formData.status" :key="key"
                  :label="value" :value="index">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装时间：" prop="setupDate">
              <el-date-picker v-model.trim="itemModel.setupDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="有效期：" prop="effectiveDate">
              <el-date-picker v-model.trim="itemModel.effectiveDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仪器校准日期：" prop="calibrationDate">
              <el-date-picker v-model.trim="itemModel.calibrationDate" type="date"
                value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" :editable="false">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          icon="fas fa-save"
          :loading="saveLoading"
          @click="onSaveItem('tableForm')">保 存
        </el-button>
        <el-button icon="fas fa-times" @click="$refs.formdialog.closeDialog()">关 闭</el-button>
      </span>
    </dialog-modal>
    <!-- 仪器名称按钮 -->
    <instru-name-form-dialog ref="instrNameFormDialog" @getintruNameData="getintruNameData"/>
    <!-- 编辑dialog框 -->
    <infor-dialog ref="inforDialog" :basicFormData="basicFormData" @onSearchQuery="onSearchQuery"/>
  </el-card>
</template>

<script>
import InforDialog from '@/views/bas/CommonDialog/InforDialog';
import InstruNameFormDialog from '@/components/widgets/InstruManagement/InstruNameFormDialog';

export default {
  // name: 'inforManagement',
  name: 'PSInfoDetaiInstrument',
  data() {
    return {
      // 查询条件状态
      keyWord: '', // 关键字
      instrumentType: { // 仪器类型
        data: '',
        option: [
        ],
      },
      status: { // 状态
        data: '',
        option: this.$hp.StatusListAdd,
      },
      addLoading: false, // 新增按钮加载
      tableLoading: false, // 表格数据加载
      saveLoading: false, // 保存按钮加载状态
      selection: [], // 记录表格选中数据的数组
      // 操作按钮状态
      // dialogVisible: false,
      // 表格状态
      tableData: [ // 表格数据
        /*
        {
          instrumentType: '', // 仪器类型
          instrumentName: '', // 仪器名称
          instrumentCode: '', // 仪器编号
          instrumentModel: '', // 仪器型号
          psName: '', // 污染源名称
          portName: '', // 点位Id
          effectiveDate: '', // 有效期
          status: '', // 状态
        },
        */
      ],
      // currentPage: 1, // 页码数
      // pageSize: 15, // 每页条数
      // total: 0, // 分页总条数
      pager: {   // 修改项
        page: 1,
        rows: 15,
        total: 0,
      },
      // 新增 dialog 表单数据
      itemModel: { // 新增表单数据
        instrumentName: '', // 仪器名称
        instrumentCode: '', // 仪器编号
        instrumentType: '', // 仪器类型（常量）
        instrumentModel: '', // 仪器型号
        innerCode: '', // 本站编号
        portId: '', // 点位id
        psId: this.$store.state.psInfo.activeInfo.id,
        leaveTime: '', // 出厂日期
        registerDate: '', // 登记日期
        setupDate: '', // 安装日期
        effectiveDate: '', // 有效日期
        calibrationDate: '', // 仪器校准日期
        location: '', // 所在位置
        status: '', // 状态（0：报废 1：正常 2：停用 3：过期)
        // isDeleted: '假删字段',
        // creator: '新增人员Id',
        // createDate: '新增日期',
        // domainId: '科室id',
        // modifier: '修改人员Id',
        // modifyDate: '修改日期',
      },
      formData: {
        instrumentType: [], // 仪器类型
        portName: [
        ], // 站点名称
        status: this.$hp.StatusListAdd, // 状态
      },
      rules: { // 表单验证
        instrumentName: [
          { required: true, message: '请输入仪器名称', trigger: 'blur' },
        ],
        instrumentType: [
          { required: true, message: '请选择仪器类型', trigger: 'change' },
        ],
        instrumentCode: [
          { required: true, message: '请选择仪器编号', trigger: 'blur' },
        ],
        instrumentModel: [
          { required: true, message: '请选择仪器型号', trigger: 'blur' },
        ],
        psId: [
          { required: true, message: '请输入污染源企业名称', trigger: 'blur' },
        ],
        portId: [
          { required: true, message: '请选择站点', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        leaveTime: [
          { required: true, message: '请选择出厂日期', trigger: 'change' },
        ],
        registerDate: [
          { required: true, message: '请选择登记日期', trigger: 'change' },
        ],
        setupDate: [
          { required: true, message: '请选择安装日期', trigger: 'change' },
        ],
        effectiveDate: [
          { required: true, message: '请选择有效日期', trigger: 'change' },
        ],
        calibrationDate: [
          { required: true, message: '请选择仪器校准日期', trigger: 'change' },
        ],
      },
      basicFormData: {}, // 编辑dialog框表单数据
    };
  },
  components: {
    InforDialog,
    InstruNameFormDialog,
  },
  computed: {
    activeInfo() {
      return this.$store.state.psInfo.activeInfo;
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selection.includes(row.id) ? className : '';
    },
    // 主页方法
    onSearchQuery() { // 查询按钮
      this.tableLoading = true;
      // const { page, rows } = { // 分页条件
      //   rows: this.pageSize,
      //   page: this.currentPage,
      // };
      const { page, rows } = this.pager;
      const queryForm = { // 查询条件
        psId: this.activeInfo.id,
        key: this.keyWord,
        instrumentType: this.instrumentType.data,
        status: this.status.data,
      };
      this.$http.get('bas/instrument/', {
        params: { page, rows, ...queryForm },
      }).then((response) => {
        if (response.data.success) {
          // 企业名称字段
          response.data.data.forEach((item) => {
            this.$set(item, 'psName', this.activeInfo.psName);
            this.$set(item, 'statusName', this.$hp.StatusListAdd[item.status]);
            // 仪器类型传过来的是编号
            this.instrumentType.option.forEach((data) => {
              if (data.id === item.instrumentType) {
                this.$set(item, 'instrumentTypeName', data.dictName);
              }
            });
          });
          this.tableData = response.data.data;
          // this.total = response.data.total;
          this.pager.total = response.data.count;
          // 修复分页存在的bug
          // if (!this.tableData.length && this.total) {
          //   this.currentPage--;
          //   this.onSearchQuery();
          // }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.tableLoading = false;
      });
    },
    onClickAdd() { // 新增按钮
      // 打开加载状态,打开
      this.addLoading = true;
      // this.dialogVisible = true;
      this.$refs.formdialog.openDialog();
      // 调用接口并关闭加载状态(无论是调取失败还是成功)
      this.getPortId();
    },
    onDeleteItem() { // 删除按钮
      if (this.selection.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/instrument/', { data: this.selection })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          this.onSearchQuery();
          this.selection = [];
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    handleSelectionChange(val) { // 数据选中状态修改时
      this.selection = [];
      val.forEach((item) => {
        this.selection.push(item.id);
      });
    },
    // handleSizeChange(val) { // pageSize改变时
    //   this.pageSize = val;
    //   this.onSearchQuery();
    // },
    // handleCurrentChange(val) { // currentPage改变时
    //   this.currentPage = val;
    //   this.onSearchQuery();
    // },
    getintruNameData(val) {
      this.$set(this.itemModel, 'instrumentName', val.instrumentName);
      this.$set(this.itemModel, 'instrumentCode', val.instrumentCode);
      this.$set(this.itemModel, 'instrumentType', val.instrumentType);
      this.$set(this.itemModel, 'instrumentModel', val.instrumentModel);
      this.$refs.tableForm.clearValidate();
    },
    // dialog框方法
    onClickEdit(val) { // 操作按钮
      this.basicFormData = val;
      this.$refs.inforDialog.openDialog();
    },
    onSaveItem(name) { // 保存按钮
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.postInstrument();
        }
        return false;
      });
    },
    onClickBasin() { // 仪器名称按钮
      this.$refs.instrNameFormDialog.openDialog();
    },
    onDialogClose(val) { // 新增dialog框关闭之前执行函数
      this.addLoading = false;
      this.itemModel = {
        instrumentName: '', // 仪器名称
        instrumentCode: '', // 仪器编号
        instrumentType: '', // 仪器类型（常量）
        instrumentModel: '', // 仪器型号
        innerCode: '', // 本站编号
        portId: '', // 点位id
        psId: this.$store.state.psInfo.activeInfo.id,
        leaveTime: '', // 出厂日期
        registerDate: '', // 登记日期
        setupDate: '', // 安装日期
        effectiveDate: '', // 有效日期
        calibrationDate: '', // 仪器校准日期
        location: '', // 所在位置
        status: '', // 状态（0：报废 1：正常 2：停用 3：过期)
      };
      this.$refs[val].resetFields();
    },
    // 请求层方法
    getPortId() { // 获取点位
      this.$http.get('bas/portInfo/', {
        params: {
          page: 1,
          rows: 100000,
          psId: this.activeInfo.id,
        },
      }).then((response) => {
        if (response.data.success) {
          this.formData.portName = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    postInstrument() { // 新增或编辑主页数据
      // const id = this.itemModel.id;
      this.saveLoading = true;
      this.$http.post('bas/instrument/', this.itemModel)
        .then((response) => {
          if (response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 1500,
              showClose: true,
            });
            this.onSearchQuery();
            // this.dialogVisible = false;
            this.$refs.formdialog.closeDialog();
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        }).finally(() => {
          this.saveLoading = false;
        });
    },
  },
  created() {
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'InstrumentCategory' }).then((val) => {
      this.instrumentType.option = val;
      this.formData.instrumentType = val;
      this.onSearchQuery();
    });
  },
};
</script>

<style lang="scss" scoped>
</style>
