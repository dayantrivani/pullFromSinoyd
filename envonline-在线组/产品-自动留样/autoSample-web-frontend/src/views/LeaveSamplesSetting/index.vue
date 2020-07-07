<template>
<!-- 立即留样下达 -->
  <el-card>
    <!-- 查询表单 -->
    <div slot="header">
      <el-form inline :model="queryForm">
        <el-form-item label="时间：">
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
        <el-form-item label="企业名称：">
          <el-input
            clearable
            v-model="queryForm.psName"
            placeholder="企业名称"
            @keyup.enter.native="onQueryList">
          </el-input>
        </el-form-item>
        <el-form-item label="排口名称：">
          <el-input
            clearable
            v-model="queryForm.portName"
            placeholder="排口名称"
            @keyup.enter.native="onQueryList">
          </el-input>
        </el-form-item>
        <el-form-item label="执行状态：">
          <el-select v-model="queryForm.execFlag" placeholder="执行状态">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="执行中" :value="1"></el-option>
            <el-option label="已执行" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="留样结果：">
          <el-select v-model="queryForm.sampleStatus" placeholder="执行结果">
            <el-option label="全部" :value="-1"></el-option>
            <el-option label="成功" :value="1"></el-option>
            <el-option label="失败" :value="0"></el-option>
            <el-option label="留样中" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
  <!-- 操作按钮 -->
    <div class="mar-l-sm mar-y-xs">
      <el-button
        type="primary"
        icon="fas fa-plus"
        @click="onOpenDialog">下 达</el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDelItem">取 消</el-button>
    </div>
    <el-table
      border
      height="calc(100% - 71px)"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column property="regionName" min-width="80" label="行政区域" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="psName" min-width="180" label="企业名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="portName" label="排口名称" min-width="200" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sampleTsTamp" min-width="160" label="留样时间" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="taskCode" label="任务编号" show-overflow-tooltip>
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
      <el-table-column property="userName" label="发布人" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="execFlagName" label="执行状态" show-overflow-tooltip>
      </el-table-column>
       <el-table-column property="exeRtn" label="执行结果" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="sampleStatusName" label="留样结果" show-overflow-tooltip>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" title="任务下达" :before-close="beforeClose">
      <el-form inline class="mar-y-xs mar-l-xs">
        <el-form-item>
          <el-input
            clearable
            style="width: 220px"
            v-model="queryPortForm.psName"
            placeholder="企业名称"
            @keyup.enter.native="getPortList">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            clearable
            style="width: 220px"
            v-model="queryPortForm.portName"
            placeholder="排口名称"
            @keyup.enter.native="getPortList">
          </el-input>
        </el-form-item>
        <el-form-item class="mar-r-xs">
          <el-button type="primary" icon="fas fa-search" @click="getPortList">查 询</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="5" class="fill-h">
        <el-col :span="12" style="max-height: 65vh;overflow: auto;">
          <div class="tree-list">
            <el-tree
              style="height: 100%;"
              v-loading="treeLoading"
              ref="tree"
              :data="treeData"
              show-checkbox
              highlight-current
              :render-after-expand="false"
              :expand-on-click-node="false"
              :default-expand-all="false"
              :render-content="renderContent">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="12" style="border-left: 1px solid rgb(235, 238, 245);min-height: 350px">
          <el-form :rules="rules" :model="createForm" ref="form" label-width="100px" class="pad-x-sm">
            <el-form-item label="样品类型：" prop="sampleType">
              <el-select style="width: 100%" v-model="createForm.sampleType" @change="onChangeSampleType">
                <el-option label="单样" :value="1"></el-option>
                <el-option label="时间等比" :value="2"></el-option>
                <el-option label="排放量等比" :value="3"></el-option>
                <el-option label="实时流量等比" :value="4"></el-option>
                <el-option label="液位等比" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="混合次数：" prop="mixingTimes">
              <el-input v-model="createForm.mixingTimes" :disabled="createForm.sampleType === 1"></el-input>
            </el-form-item>
            <el-form-item label="混合量：" prop="mixingAmount">
              <el-input v-model.trim="createForm.mixingAmount">
                <template slot="append">
                  (毫升)
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="采样瓶数：" prop="sampleBottle">
              <el-input v-model="createForm.sampleBottle"></el-input>
            </el-form-item>
            <el-form-item label="等比量：" prop="equalRatio">
              <el-input v-model="createForm.equalRatio" :disabled="createForm.sampleType === 1">
                <template slot="append" v-if="createForm.sampleType === 2 || createForm.sampleType === 3">
                  {{createForm.sampleType === 2 ? '(秒)' : createForm.sampleType === 3 ? '(吨)' : ''}}
                </template>
              </el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSaveItem" icon="fas fa-save">保 存</el-button>
        <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button>
      </div>
    </dialog-modal>
  </el-card>
</template>

<script>
export default {
  name: 'LeaveSamplesSetting',
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
      loading: false,
      queryForm: {
        fromDate: this.$hp.formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          'Y-m-d 00:00:00'),
        toDate: this.$hp.formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          'Y-m-d 23:59:59'),
        sampleModule: 2,
        execFlag: -1,
        sampleStatus: -1,
        psName: '',
        portName: '',
        sort: 'sampleTsTamp-',
        isAll: true,
      },
      itemList: [],
      selectedIds: [],
      pager: {
        rows: 15,
        page: 1,
        total: 0,
      },
      // 新增弹窗
      treeLoading: false,
      queryPortForm: {}, // 查询点位表单
      createForm: {
        sampleType: 1,
        // mixingAmount: 1,
        // sampleBottle: 1,
        mixingTimes: '1',
        // equalRatio: 1,
      },
      treeData: [],
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
        equalRatio: [
          { required: false, message: '请输入等比量', trigger: 'blur' },
          { validator: validateEqual, trigger: 'blur' },
        ],
      },
    };
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
  created() {
    this.getItemList();
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
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.get('autoSample/remoteSampleRecord', {
        params: {
          rows,
          page,
          ...this.queryForm,
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
    // 弹窗相关方法
    onOpenDialog() {
      this.getPortList();
      this.$refs.dialog.openDialog();
    },
    onChangeSampleType(val) { // 留样类型改变事件
      if (val === 1) {
        this.rules.equalRatio[0].required = false;
        this.$refs.form.clearValidate(['equalRatio']);
        delete (this.createForm.mixingTimes);
      } else {
        this.rules.equalRatio[0].required = true;
      }
    },
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        if (this.$refs.tree.getCheckedNodes().filter(n => !n.children).length === 0) {
          this.$message({
            type: 'warning',
            message: '请先选择排口',
            duration: 3000,
            showClose: true,
          });
          return;
        }
        const portList = this.$refs.tree.getCheckedNodes().filter(n => !n.children).map(n => ({
          regionCodeId: n.regionCodeId,
          regionName: n.regionName,
          psId: n.psId,
          psName: n.psName,
          portName: n.portName,
          portId: n.id,
          dgiMn: n.dgiMn,
          sampleModule: 2,
          // 表单数据
          ...this.createForm,
        }));
        this.$http.post('autoSample/remoteSampleRecord/batch', [...portList]).then((response) => {
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
    beforeClose() { // 关闭弹窗
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    getPortList() { // 获取树列表数据
      this.treeLoading = true;
      this.$http.get('bas/portInfo/queryAuthority/?page=1&rows=100000', {
        params: {
          childPortType: 4,
          portType: 1,
          sort: 'psName+,portName',
          ...this.queryPortForm,
        },
      }).then((response) => {
        if (response.data.success) {
          const map = this.mapTreeList(response.data.data, ['psName', 'portName']);
          this.treeData = this.getTreeList(map);
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
    mapTreeList(arr, keys) { // 将接口数据按keys汇总成map对象
      // arr--传入数组 keys--根据哪个key汇总的key数组
      const map = new Map();
      const key = keys[0];
      arr.forEach((element) => {
        map.set(element[key], []);
      });
      arr.forEach((element) => {
        map.get(element[key]).push(element);
      });
      map.forEach((element, index) => {
        if (keys[1] !== keys[keys.length - 1]) {
          // console.log(element, index, keys.slice(1), key);
          map.set(index, this.mapTreeList(element, keys.slice(1)));
        }
      });
      return map;
    },
    getTreeList(map) { // 将map对象按层级组成{ label, children }格式
      const treeData = [];
      map.forEach((element, index) => {
        if (element.size) {
          treeData.push({
            label: index,
            children: this.getTreeList(element),
          });
        } else {
          treeData.push({
            label: index,
            children: element.map((n) => {
              this.$set(n, 'label', n.portName);
              return n;
            }),
          });
        }
      });
      return treeData;
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      return (
        <div class="node-item" ondblclick={event => this.ondblclick(node, store, event)}>
          <span class="el-tree__icon">
            <i v-show={node.isLeaf} class="fas fa-file" />
            <i v-show={!node.isLeaf} class={`fas fa-${node.expanded ? 'folder-open' : 'folder'}`} />
            <span>{node.label}</span>
          </span>
        </div>
      );
    },
    // 双击节点收缩/展开
    ondblclick(node) {
      if (node.isLeaf) return;
      if (node.expanded) {
        node.collapse();
      } else {
        node.expand();
      }
    },
  },
};
</script>

<style>

</style>
