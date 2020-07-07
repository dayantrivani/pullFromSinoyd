<template>
<!-- 定时留样配置 -->
  <el-row :gutter="5">
    <el-col style="width: 450px;">
      <el-card type="title">
        <div slot="header"><span>排口信息</span></div>
        <!-- 查询表单 -->
        <el-form inline :model="portQueryForm" class="mar-t-xs mar-l-xs fn-no-wrap">
          <el-form-item>
            <el-input
              v-model="portQueryForm.key"
              style="width: 290px"
              placeholder="排口名称、MN号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="getPortList">查 询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border
          height="calc(100% - 75px)"
          v-loading="portLoading"
          :data="portList"
          highlight-current-row
          @row-click="onRowClick">
          <el-table-column fixed align="center" label="No." type="index" width="50"></el-table-column>
          <el-table-column property="psName" min-width="180" label="企业名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="portName" min-width="200" label="排口名称" show-overflow-tooltip>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col style="width: calc(100% - 450px);">
      <el-card type="title">
        <div slot="header"><span>定时留样计划</span></div>
        <!-- 查询表单 -->
        <el-form inline :model="queryForm" class="mar-t-xs mar-l-xs fn-no-wrap">
          <el-form-item>
            <el-date-picker
              style="width:330px"
              v-model="date"
              unlink-panels
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input
              clearable
              v-model="queryForm.taskCode"
              placeholder="任务编号"
              @keyup.enter.native="onQueryList">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
          </el-form-item>
        </el-form>
        <hr/>
        <div class="mar-l-sm mar-y-xs">
          <el-button
            type="primary"
            icon="fas fa-plus"
            :disabled="!portItem.id ? true : false"
            @click="$refs.dialog.openDialog()">新 增</el-button>
          <el-button
            type="danger"
            icon="fas fa-trash-alt"
            :disabled="!selectedIds.length"
            @click="onDelItem">删 除
          </el-button>
        </div>
        <el-table
          border
          height="calc(100% - 111px)"
          v-loading="loading"
          :data="itemList"
          highlight-current-row
          :row-class-name="_rowClassName"
          @selection-change="changeSelected">
          <el-table-column align="center" type="selection" width="37"></el-table-column>
          <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
          <!-- <el-table-column align="center" label="No." type="index" width="50"></el-table-column> -->
          <el-table-column property="sampleTsTamp" min-width="160" label="留样时间" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="taskCode" min-width="150" label="任务编号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="sampleTypeName" label="样品类型" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="mixingTimes" label="混合次数" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="sampleBottle" label="采样瓶数" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="equalRatio" label="等比量" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="mixingAmount" label="混合量" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="userName" min-width="100" label="发布人" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="execFlagName" label="执行状态" show-overflow-tooltip>
          </el-table-column>
          <el-table-column property="exeRtn" label="执行结果" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <paging-query :pager="pager" @query="getItemList"/>
        <dialog-modal
          ref="dialog"
          :title="`${portItem.psName}-${portItem.portName}`"
          :before-close="beforeClose">
          <el-form :rules="rules" :model="createForm" ref="form" label-width="110px" class="item-space pad-x-sm">
            <el-form-item label="样品类型：" prop="sampleType">
              <el-select v-model="createForm.sampleType" style="width: 100%" @change="onChangeSampleType">
                <el-option label="单样" :value="1"></el-option>
                <el-option label="时间等比" :value="2"></el-option>
                <el-option label="排放量等比" :value="3"></el-option>
                <el-option label="实时流量等比" :value="4"></el-option>
                <el-option label="液位等比" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采样瓶数：" prop="sampleBottle">
              <el-input v-model="createForm.sampleBottle"></el-input>
            </el-form-item>
            <el-form-item label="混合次数：" prop="mixingTimes">
              <el-input v-model="createForm.mixingTimes" :disabled="createForm.sampleType === 1"></el-input>
            </el-form-item>
            <el-form-item label="等比量：" prop="equalRatio">
              <el-input v-model="createForm.equalRatio" :disabled="createForm.sampleType === 1">
                <template slot="append" v-if="createForm.sampleType === 2 || createForm.sampleType === 3">
                  {{createForm.sampleType === 2 ? '(秒)' : createForm.sampleType === 3 ? '(吨)' : ''}}
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="混合量：" prop="mixingAmount">
              <el-input v-model="createForm.mixingAmount">
                <template slot="append">
                  (毫升)
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="时间点个数：" prop="timePoint">
              <el-select
                v-model="createForm.timePoint"
                style="width: 100%"
                clearable
                 @change="onChangeTimePoint">
                <el-option label="1" :value="1"></el-option>
                <el-option label="2" :value="2"></el-option>
                <el-option label="3" :value="3"></el-option>
                <el-option label="4" :value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-for="(item, index) in createForm.timePoint"
              :key="index"
              :label="`时间点${item}：`"
              :prop="`timePoints[${index}]`"
              :rules="[{ required: true, message: `请选择时间点${item}`, trigger: 'change' },]">
              <el-date-picker
                style="width: 100%;"
                v-model="createForm.timePoints[index]"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSaveItem" icon="fas fa-save">保 存</el-button>
            <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button>
          </div>
        </dialog-modal>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TimingSampleSetting',
  data() {
    const validateInt = (rule, value, callback) => {
      if (!(value - 0) && (value - 0) !== 0) {
        callback(new Error('请输入数字值'));
      } else if (value <= 0 || value.includes('.')) {
        callback(new Error('请输入正整数'));
      } else if ((value - 0) > 2147483647) {
        callback(new Error('输入数值过大'));
      } else {
        callback();
      }
    };
    const validateFloat = (rule, value, callback) => {
      if (!(value - 0) && (value - 0) !== 0) {
        callback(new Error('请输入数字值'));
      } else if (value <= 0) {
        callback(new Error('请输入正数'));
      } else if ((value - 0) > 2147483647) {
        callback(new Error('输入数值过大'));
      } else {
        callback();
      }
    };
    const validateEqual = (rule, value, callback) => {
      if (value === undefined || value === '' || value === null) {
        callback();
        this.$nextTick(() => {
          this.$refs.form.clearValidate(['equalRatio']);
        });
      }
      if (!(value - 0) && (value - 0) !== 0) {
        callback(new Error('请输入数字值'));
      } else if (value <= 0 || value.includes('.')) {
        callback(new Error('请输入正数'));
      } else if ((value - 0) > 9999) {
        callback(new Error('输入数值过大'));
      } else {
        callback();
      }
    };
    return {
      // 左侧点位表格
      portLoading: false,
      portQueryForm: { key: '' },
      portList: [],
      portItem: {},
      // 右侧留样计划表格
      loading: false,
      queryForm: {
        fromDate: this.$hp.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          'Y-m-d 00:00:00'),
        toDate: this.$hp.formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          'Y-m-d 23:59:59'),
        taskCode: '',
        portId: '',
        sampleModule: 1,
      },
      selectedIds: [],
      pager: {
        rows: 15,
        page: 1,
        total: 0,
      },
      itemList: [],
      // 新增弹窗
      createForm: {
        sampleType: 1,
        timePoint: 1,
        timePoints: [],
        sampleModule: 1,
        mixingTimes: '1',
      },
      rules: {
        sampleType: [
          { required: true, message: '请选择样品类型', trigger: 'change' },
        ],
        mixingTimes: [
          { required: true, message: '请选择混合次数', trigger: 'blur' },
          { validator: validateInt, trigger: 'blur' },
        ],
        sampleBottle: [
          { required: true, message: '请输入采样瓶数', trigger: 'blur' },
          { validator: validateInt, trigger: 'blur' },
        ],
        mixingAmount: [
          { required: true, message: '请输入混合量', trigger: 'blur' },
          { validator: validateFloat, trigger: 'blur' },
        ],
        timePoint: [
          { required: true, message: '请输入时间点数', trigger: 'change' },
        ],
        equalRatio: [
          { required: false, message: '请输入等比量', trigger: 'blur' },
          { validator: validateEqual, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getPortList();
  },
  watch: {
    createForm: {
      handler(val) {
        if (val.sampleType === 1) {
          this.$set(this.createForm, 'mixingTimes', '1');
          this.$set(this.createForm, 'equalRatio', '');
        }
      },
      deep: true,
    },
  },
  computed: {
    date: {
      get() {
        let date;
        if (this.queryForm.fromDate !== '' && this.queryForm.toDate !== '') {
          date = [this.queryForm.fromDate, this.queryForm.toDate];
        } else {
          date = '';
        }
        return date;
      },
      set(val) {
        if (val) {
          [this.queryForm.fromDate, this.queryForm.toDate] = val;
        } else {
          [this.queryForm.fromDate, this.queryForm.toDate] = ['', ''];
        }
      },
    },
  },
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    _rowClassName({ row }) { // 勾选样式修改
      const className = 'selected-row';
      return this.selectedIds.includes(row.id) ? className : '';
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.id);
    },
    // 左侧点位表格
    getPortList() {
      this.treeLoading = true;
      this.$http.get('bas/portInfo/queryAuthority/?page=1&rows=100000', {
        params: {
          childPortType: 4,
          portType: 1,
          sort: 'psName+,portName',
          ...this.portQueryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.portList = response.data.rows || response.data.data || response.data;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.treeLoading = false;
      });
    },
    onRowClick(row) {
      this.portItem.id = row.id;
      this.portItem.psName = row.psName;
      this.portItem.psId = row.psId;
      this.portItem.portName = row.portName;
      this.queryForm.portId = row.id;
      this.createForm.regionCodeId = row.regionCodeId;
      this.createForm.regionName = row.regionName;
      this.createForm.psId = row.psId;
      this.createForm.psName = row.psName;
      this.createForm.portName = row.portName;
      this.createForm.portId = row.id;
      this.createForm.dgiMn = row.dgiMn;
      this.getItemList();
    },
    // 右侧留样计划表格
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    beforeClose() {
      delete (this.createForm.timePoint);
      this.createForm.timePoints = [];
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.get('autoSample/remoteSampleRecord', {
        params: {
          rows,
          page,
          ...this.queryForm,
          sort: 'sampleTsTamp-',
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.total = response.data.total || response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
    onDelItem() { // 删除计划
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('autoSample/remoteSampleRecord', { data: this.selectedIds })
      )).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getItemList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    // 弹窗
    onChangeSampleType(val) { // 留样类型改变事件
      if (val === 1) {
        this.rules.equalRatio[0].required = false;
        this.$refs.form.clearValidate(['equalRatio']);
        delete (this.createForm.mixingTimes);
      } else {
        this.rules.equalRatio[0].required = true;
      }
    },
    onChangeTimePoint(val) { // 时间点数改变事件
      this.createForm.timePoints = this.createForm.timePoints.slice(0, val);
    },
    onSaveItem() { // 点击保存
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$http.post('autoSample/remoteSampleRecord', { ...this.createForm }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
            this.beforeClose();
            this.onQueryList();
          } else {
            this.$message({
              type: 'warning',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, (response) => {
          this.$hp.resp(response);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
