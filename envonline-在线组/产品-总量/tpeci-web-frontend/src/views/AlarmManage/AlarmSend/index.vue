<template>
  <!-- 发送方案配置 -->
  <el-card class="title-card" type="title">
    <!-- <div slot="header"><span>发送方案配置</span></div> -->
    <!-- 查询表单 -->
    <el-form inline :model="queryForm" class="mar-t-xs mar-l-xs fn-no-wrap">
      <el-form-item label="配置名称：">
        <el-input
          clearable
          v-model="queryForm.configName"
          placeholder="请输入配置名称"
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
        @click="onClickAdd">新 增</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelItem">删 除
      </el-button>
    </div>
    <el-table
      border
      height="calc(100% - 73px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column align="center" prop="waterStorageStatus" min-width="69px" label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="fas fa-file-invoice"
            @click="onClickEdit(scope.row.id)">
            编辑
          </el-button>
        </template>
      </el-table-column>
      <el-table-column property="configName" label="配置名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="alarmTypeName" label="报警类型" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="每日发送时间" show-overflow-tooltip>
        <el-table-column property="beginTime" label="开始时间" show-overflow-tooltip>
        </el-table-column>
        <el-table-column property="endTime" label="结束时间" show-overflow-tooltip>
        </el-table-column>
      </el-table-column>
      <el-table-column property="sendTimeSpan" label="发送时间间隔(分)" min-width="100" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sendFrequency" label="最大发送次数" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" title="发送方案配置" :before-close="beforeClose" size="mini">
      <el-form :rules="rules" :model="configForm" ref="form" label-width="120px" class="item-space pad-x-sm">
        <el-form-item label="配置名称：" prop="configName">
          <el-input v-model="configForm.configName"></el-input>
        </el-form-item>
        <el-form-item label="报警类型：" prop="alarmTypes">
          <el-select multiple v-model="alarmTypes" style="width: 100%">
            <el-option
              v-for="(item, index) in alarmTypeList" :key="index"
              :label="item.alarmTypeName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="每日发送时间：" prop="date">
          <el-time-picker
            style="width: 100%"
            is-range
            arrow-control
            v-model="date"
            value-format='HH:mm'
            :picker-options="{ format: 'HH:mm' }"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="时间间隔：" prop="sendTimeSpan">
          <el-input v-model="configForm.sendTimeSpan">
            <template slot="append">(min)</template>
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="每日发送次数：" prop="sendFrequency">
          <el-input-number style="width: 100%" v-model.number="configForm.sendFrequency"></el-input-number>
        </el-form-item> -->
        <el-form-item label="发送方式：" prop="sendTypes">
          <el-checkbox-group v-model="configForm.sendTypes">
            <el-checkbox :label="1">短信</el-checkbox>
            <el-checkbox :label="2">APP</el-checkbox>
            <el-checkbox :label="4">微信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业发送：">
              <el-switch v-model="configForm.psIsSend"></el-switch>
            </el-form-item>
            </el-col>
          <el-col :span="12">
            <el-form-item label="运维单位：">
              <el-switch v-model="configForm.opMainIsSend"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSaveItem" icon="fas fa-save">保 存</el-button>
        <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button>
      </div>
    </dialog-modal>
  </el-card>
</template>

<script>
export default {
  name: 'AlarmSend',
  data() {
    const psId = this.$store.getters['auth/orgGuid'] || '';
    const validateNum = (rule, value, callback) => {
      if (!/^\d+$/.test(value) && value) {
        callback(new Error('请输入正整数'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      queryForm: {
        psId,
        configName: '',
      },
      selectedIds: [],
      pager: {
        rows: 15,
        page: 1,
        count: 0,
      },
      itemList: [],
      // 新增弹窗
      configForm: {
        alarmTypes: [],
        sendTypes: [],
        beginTime: '',
        endTime: '',
        psIsSend: false,
        opMainIsSend: false,
        sendFrequency: 1,
      },
      date: ['', ''],
      alarmTypeList: [],
      rules: {
        alarmTypes: [
          { required: true, message: '请选择报警类型', trigger: 'change' },
        ],
        configName: [
          { required: true, message: '请输入配置名称', trigger: 'blur' },
        ],
        sendTimeSpan: [
          { validator: validateNum, trigger: ['blur', 'change'] },
        ],
        // sendFrequency: [
        //   { required: true, message: '请输入每日发送次数', trigger: 'change' },
        // ],
        sendTypes: [
          { required: true, message: '请输入发送方式', trigger: 'change' },
        ],
      },
    };
  },
  created() {
    this.getItemList();
  },
  computed: {
    alarmTypes: {
      get() {
        return this.configForm.alarmTypes.map(n => n.id);
      },
      set(val) {
        this.configForm.alarmTypes = this.alarmTypeList.filter(n => val.includes(n.id));
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
    // 表格
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    beforeClose() {
      this.$refs.form.resetFields();
      this.configForm.beginTime = '';
      this.configForm.endTime = '';
      this.configForm.id = '';
      this.configForm.psIsSend = false;
      this.configForm.opMainIsSend = false;
      this.date = ['', ''];
      this.$refs.dialog.closeDialog();
    },
    onClickAdd() { // 新增事件
      if (this.alarmTypeList.length === 0) {
        this.getAlarmTypeList();
      }
      delete this.configForm.id;
      this.configForm.sendFrequency = 1;
      this.$refs.dialog.openDialog();
    },
    onClickEdit(id) { // 编辑事件
      if (this.alarmTypeList.length === 0) {
        this.getAlarmTypeList();
      }
      this.$refs.dialog.openDialog();
      this.$http.get(`alarm/alarmSendConfig/${id}`).then((response) => {
        if (response.data.success) {
          this.configForm = response.data.rows || response.data.data || response.data;
          this.date = [this.configForm.beginTime || '', this.configForm.endTime || ''];
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
    },
    getAlarmTypeList() { // 获取报警类型数据
      this.$http.get('alarm/alarmType?page=1&rows=1000000&sort=alarmTypeName%2b,orderNum%2b').then((response) => {
        if (response.data.success) {
          this.alarmTypeList = response.data.rows || response.data.data || response.data;
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
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.get('alarm/alarmSendConfig', {
        params: {
          rows,
          page,
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.count = response.data.count;
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
        this.$http.delete('alarm/alarmSendConfig', { data: this.selectedIds })
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
    onSaveItem() { // 点击保存
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.configForm.sendType = this.configForm.sendTypes.reduce((acc, cur) => acc + cur, 0);
        [this.configForm.beginTime, this.configForm.endTime] = this.date || ['', ''];
        this.$http[this.configForm.id ? 'put' : 'post']('alarm/alarmSendConfig', {
          ...this.configForm,
        }).then((response) => {
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
