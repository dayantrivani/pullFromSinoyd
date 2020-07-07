<template>
<!-- 仪器因子管理 -->
  <div class="InstrumentModel">
    <el-card fill>
      <!-- 头部 -->
      <div slot="header">
        <el-form slot="header" class="clearfix" inline>
          <el-form-item>关键字：</el-form-item>
          <el-form-item>
            <el-input v-model="keyWord" style="width: 220px;" placeholder="仪器名称、仪器编号" clearable></el-input>
          </el-form-item>
          <el-form-item>仪器类型：</el-form-item>
          <el-form-item>
            <el-select v-model="instrumentType.data">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(item, index) in instrumentType.option" :key="index"
                :label="item.dictName" :value="item.rowGuid">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>状态：</el-form-item>
          <el-form-item>
            <el-select v-model="status.data" placeholder="请选择" style="width: 120px;">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="(value, key) in status.option" :key="key"
                :label="value" :value="key">
              </el-option>
            </el-select>
          </el-form-item> -->
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
          :disabled="!selectedIds.length"
          @click="onDeleteItem">删 除
        </el-button>
      </div>
      <!-- 表格 -->
      <el-table
        v-loading="tableLoading"
        border
        height="calc(100% - 76px)"
        :data="tableData"
        highlight-current-row
        :row-class-name="_rowClassName"
        @selection-change="onSaveSelected">
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
        <el-table-column align="center" label="操作" width="67">
          <template slot-scope="scope">
            <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="instrumentName" label="仪器名称" min-width="120" show-overflow-tooltip></el-table-column>
        <!-- prop="" 内容 min-width="120" 长度-->
        <!--
          修改 - 原
          instrumentTypeName - instrumentType
          psName - psId
          statusName - status
          由于获取的数据只有编码,显示的却必须是名称;
          原字符串又会在其余地方使用,故添加新的字符串记录编码对应的名称
          -->
        <el-table-column prop="instrumentTypeName" label="仪器类型" show-overflow-tooltip></el-table-column>
        <el-table-column prop="instrumentCode" label="仪器编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="instrumentModel" label="仪器型号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="instrumentNum" label="仪器数量" show-overflow-tooltip></el-table-column>
        <!-- 数据未确定 -->
        <el-table-column prop="manufacturer" label="制造厂商" show-overflow-tooltip></el-table-column>
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
    </el-card>
    <!-- dialog框 -->
    <!-- <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false"
      @closed="onDialogClose('tableFormModel')" title="仪器型号管理" width="45%">
      <el-form ref="tableFormModel" label-position="right" label-width="100px"
        :model="itemModel" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器名称：" prop="instrumentName">
              <el-input v-model.trim="itemModel.instrumentName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器编号：" prop="instrumentCode">
              <el-input v-model.trim="itemModel.instrumentCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器类型：" prop="instrumentType">
              <el-select v-model.trim="itemModel.instrumentType" placeholder="请选择仪器类型"
                clearable  style="width: 100%">
                <el-option v-for="(item,index) in formData.instrumentType" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器型号：" prop="instrumentModel">
               <el-input v-model.trim="itemModel.instrumentModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="制造厂商：" prop="manufacturerId">
              <el-select v-model.trim="itemModel.manufacturerId" placeholder="请选择制造厂商" style="width: 100%"
                filterable :filter-method="getManufacturer" :loading="selectLoading">
                <el-option v-for="(item,index) in formData.manufacturer" :key="index"
                  :label="item.psName" :value="item.rowGuid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器数量：" prop="instrumentNum">
              <el-input-number v-model="itemModel.instrumentNum" controls-position="right"
                :min="0" style="width: 100%;">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="onSaveItem('tableFormModel')" :loading="saveLoading">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> 保 存
        </el-button>
        <el-button size="small" @click="dialogVisible = false">
          <i class="fa fa-times" aria-hidden="true"></i> 关 闭
        </el-button>
      </div>
    </el-dialog> -->
    <dialog-modal ref="dialog" size="mini" title="仪器型号管理" @closed="onDialogClose('tableFormModel')">
      <el-form class="mar-t-xs" ref="tableFormModel" label-width="100px" :model="itemModel" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器名称：" prop="instrumentName">
              <el-input v-model.trim="itemModel.instrumentName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器编号：" prop="instrumentCode">
              <el-input v-model.trim="itemModel.instrumentCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器类型：" prop="instrumentType">
              <el-select v-model.trim="itemModel.instrumentType" placeholder="请选择仪器类型"
                clearable  style="width: 100%">
                <el-option v-for="(item,index) in formData.instrumentType" :key="index"
                  :label="item.dictName" :value="item.rowGuid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器型号：" prop="instrumentModel">
               <el-input v-model.trim="itemModel.instrumentModel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="制造厂商：" prop="manufacturerId">
              <el-select v-model.trim="itemModel.manufacturerId" placeholder="请选择制造厂商" style="width: 100%"
                filterable :filter-method="getManufacturer" :loading="selectLoading">
                <el-option v-for="(item,index) in formData.manufacturer" :key="index"
                  :label="item.psName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="仪器数量：" prop="instrumentNum">
              <el-input-number
                v-model="itemModel.instrumentNum"
                controls-position="right"
                :min="0"
                :max="2147483647"
                style="width: 100%;">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="saveLoading"
          icon="fas fa-save"
          @click="onSaveItem('tableFormModel')">保 存
        </el-button>
        <el-button icon="fas fa-times" @click="$refs.dialog.closeDialog()">关 闭</el-button>
      </span>
    </dialog-modal>
  </div>
</template>

<script>
export default {
  name: 'instrumentModel',
  data() {
    return {
      name: 'InstrumentModel',
      // 查询条件状态
      keyWord: '', // 关键字
      instrumentType: { // 仪器类型
        data: '',
        option: [
        ],
      },
      addLoading: false, // 新增按钮加载
      tableLoading: true, // 表格数据加载
      selectedIds: [], // 记录表格选中数据的数组
      // 操作按钮状态
      // dialogVisible: false,
      // 表格状态
      tableData: [ // 表格数据
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
        instrumentType: '', // 仪器类型
        instrumentModel: '', // 仪器型号
        manufacturerId: '', // 生产厂商
        manufacturer: '', // 生产厂商名称
        instrumentNum: '', // 仪器数量
      },
      formData: {
        instrumentType: [], // 仪器类型
        manufacturer: [], // 制造厂商
      },
      manufacturerAll: [], // 所有制造厂商
      selectLoading: false, // 下拉框请求加载
      saveLoading: false, // 保存按钮加载
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
      },
    };
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 勾选样式修改
    _rowClassName({ row }) {
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    // 保存选中项 id
    onSaveSelected(selection) {
      this.selectedIds = selection.map(val => val.id);
    },
    // 主页方法
    onSearchQuery() { // 查询按钮
      this.tableLoading = true;
      const { page, rows } = this.pager;
      const queryForm = { // 查询条件
        key: this.keyWord,
        instrumentType: this.instrumentType.data,
      };
      this.$http.get('bas/instrumentMainInfo/', {
        params: {
          page,
          rows,
          ...queryForm,
          sort: 'instrumentName',
        },
      }).then((response) => {
        if (response.data.success) {
          // 企业名称字段
          response.data.data.forEach((item) => {
            // 仪器类型传过来的是一串编码
            this.instrumentType.option.forEach((data) => {
              if (data.id === item.instrumentType) {
                this.$set(item, 'instrumentTypeName', data.dictName);
              }
            });
          });
          this.tableData = response.data.data;
          this.pager.total = response.data.count;
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
      this.$refs.dialog.openDialog();
      // 调用接口并关闭加载状态(无论是调取失败还是成功)
      this.getManufacturer();
    },
    onClickEdit(val) { // 编辑按钮
      // 打开加载状态,打开
      this.addLoading = true;
      // this.dialogVisible = true;
      this.$refs.dialog.openDialog();
      this.itemModel = {
        id: val.id,
        instrumentName: val.instrumentName, // 仪器名称
        instrumentCode: val.instrumentCode, // 仪器编号
        instrumentType: val.instrumentType, // 仪器类型
        instrumentModel: val.instrumentModel, // 仪器型号
        manufacturerId: val.manufacturerId, // 生产厂商
        manufacturer: val.manufacturer, // 生产厂商名称
        instrumentNum: val.instrumentNum, // 仪器数量
      };
      this.getManufacturer();
    },
    onDeleteItem() { // 删除按钮
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('bas/instrumentMainInfo/', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 1500,
            showClose: true,
          });
          this.onSearchQuery();
          this.selectedIds = [];
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      });
    },
    // 新增按钮的dialog框
    onSaveItem(name) { // 保存按钮
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          this.postInstrument();
        }
        return false;
      });
    },
    onDialogClose(val) { // Dialog框关闭之前执行函数
      this.addLoading = false;
      this.saveLoading = false;
      this.selectLoading = false;
      this.itemModel = {
        instrumentName: '', // 仪器名称
        instrumentCode: '', // 仪器编号
        instrumentType: '', // 仪器类型
        instrumentModel: '', // 仪器型号
        manufacturerId: '', // 生产厂商
        manufacturer: '', // 生产厂商名称
        instrumentNum: '', // 仪器数量
      };
      this.formData.manufacturer = [];
      this.$refs[val].resetFields();
    },
    // 请求获取数据
    postInstrument() { // 新增或编辑主页数据
      const temp = this.itemModel.id;
      let url;
      if (temp) {
        url = 'bas/instrumentMainInfo/';
      } else {
        url = 'bas/instrumentMainInfo/';
      }
      this.manufacturerAll.forEach((item) => {
        if (item.id === this.itemModel.manufacturerId) {
          this.itemModel.manufacturer = item.psName;
        }
      });
      this.$http[temp ? 'put' : 'post'](url, this.itemModel).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '操作成功',
            duration: 1500,
            showClose: true,
          });
          this.onSearchQuery();
          this.$refs.dialog.closeDialog();
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
    getManufacturer(val) { // 获取生产企业
      this.selectLoading = true;
      this.$http.get('bas/psBaseInfo', {
        params: {
          page: 1,
          rows: 100000,
          psType: 32,
          psName: val || '',
        },
      }).then((response) => {
        if (response.data.success) {
          this.formData.manufacturer = response.data.data;
          if (val === undefined || val === '') {
            this.manufacturerAll = response.data.data;
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.selectLoading = false;
      });
    },
  },
  created() {
    this.$store.dispatch('psInfo/GET_SELECT_TYPE', { codeValue: 'InstrumentCategory' }).then((val) => {
      this.instrumentType.option = val;
      this.formData.instrumentType = val;
      this.onSearchQuery();
    });
    this.getManufacturer();
  },
};
</script>

<style lang="scss" scoped>
</style>
