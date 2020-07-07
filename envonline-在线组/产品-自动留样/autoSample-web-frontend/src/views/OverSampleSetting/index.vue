<template>
<!-- 超标留样配置 -->
<el-row :gutter="5" class="fill-h">
    <el-col :span="7">
      <el-card type="title">
        <template slot="header">
          <span class="el-card__title">排口列表</span>
        </template>
        <div class="tree-list" style="height: 100%;">
          <el-form inline class="mar-y-xs mar-l-xs">
            <el-form-item>
              <el-input
                clearable
                v-model="queryForm.psName"
                placeholder="企业名称"
                @keyup.enter.native="getPortList">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                clearable
                v-model="queryForm.portName"
                placeholder="排口名称"
                @keyup.enter.native="getPortList">
              </el-input>
            </el-form-item>
            <el-form-item class="mar-r-xs">
              <el-button type="primary" icon="fas fa-search" @click="getPortList">查 询</el-button>
            </el-form-item>
          </el-form>
          <el-tree
            style="height: calc(100% - 80px);overflow: auto;"
            v-loading="treeLoading"
            ref="tree"
            :data="treeData"
            highlight-current
            :render-after-expand="false"
            :expand-on-click-node="false"
            :default-expand-all="false"
            :render-content="renderContent"
            @node-click="onNodeClick">
          </el-tree>
        </div>
      </el-card>
    </el-col>
    <el-col :span="17">
      <el-card type="title" fill>
        <template slot="header">{{!port.psName ? '排口配置' : `${port.psName}-${port.portName}`}}</template>
        <div class="mar-l-sm mar-y-xs">
          <el-button
            type="primary"
            icon="fas fa-plus"
            :disabled="!port.psName"
            @click="onCreated">新 增</el-button>
          <el-button
            size="mini"
            icon="fas fa-times"
            :disabled="!selectedIds.length"
            @click="onDelItem">取消</el-button>
        </div>
        <el-table
          border
          height="calc(100% - 71px)"
          v-loading="loading"
          highlight-current-row
          :data="itemList"
          :row-class-name="_rowClassName"
          @selection-change="changeSelected">
          <el-table-column align="center" type="selection" width="37"></el-table-column>
          <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
          <el-table-column prop="psName" min-width="180" label="企业名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="portName" min-width="200" label="排口名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="factorName" label="因子名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="standardUpper" min-width="100" label="超标上限值" show-overflow-tooltip></el-table-column>
          <el-table-column prop="standardLow" min-width="100" label="超标下限值" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sampleBottleNum" label="采样瓶数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="timeSpan" min-width="110" label="时间间隔(时)" show-overflow-tooltip></el-table-column>
          <el-table-column prop="mixingAmount" min-width="110" label="混合量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="execFlagName" label="执行状态" show-overflow-tooltip></el-table-column>
          <el-table-column property="exeRtn" label="执行结果" show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <paging-query :pager="pager" @query="getItemList"/>
        <dialog-modal ref="dialog" title="超标任务下达" :before-close="beforeClose">
          <el-form :rules="rules" :model="createForm" ref="form" label-width="100px" class="item-space pad-x-sm">
            <el-form-item label="监测因子：" prop="factorId">
              <el-select style="width: 100%" v-model="createForm.factorId" @change="onChangeSelect">
                <el-option v-for="(item, key) in factorList"
                  :key="key"
                  :label="item.factorName"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="超标限值：" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="standardLow">
                    <el-input-number
                      v-model="createForm.standardLow"
                      :controls="false"
                      :max="2147483647"
                      clearable
                      @change="onChangeStandard"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="2"><p style="text-align: center;">~</p></el-col>
                <el-col :span="11">
                  <el-form-item prop="standardUpper">
                    <el-input-number
                      v-model="createForm.standardUpper"
                      :controls="false"
                      :max="2147483647"
                      clearable
                      @change="onChangeStandard"></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="采样瓶数：" prop="sampleBottleNum">
              <el-input v-model="createForm.sampleBottleNum"></el-input>
            </el-form-item>
            <el-form-item label="时间间隔：" prop="timeSpan">
              <el-input v-model="createForm.timeSpan">
                <template slot="append">(时)</template>
              </el-input>
            </el-form-item>
            <el-form-item label="混合量：" prop="mixingAmount">
              <el-input v-model="createForm.mixingAmount">
                <template slot="append">
                  (毫升)
                </template>
              </el-input>
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
  name: 'OverSampleSetting',
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
    const validateStandard = (rule, value, callback) => {
      if (!(value - 0) && (value - 0) !== 0) {
        callback(new Error('请输入数字值'));
      } else if (this.createForm.standardLow > this.createForm.standardUpper) {
        callback(new Error('超标下限需要小于超标上限'));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      treeLoading: false,
      isCollapse: false,
      queryForm: {
        psName: '',
        portName: '',
      },
      pager: {
        rows: 15,
        page: 1,
        total: 1,
      },
      port: {},
      itemList: [],
      treeData: [],
      selectedIds: [], // 选中的配置id
      factorItem: {}, // 选中的因子相关信息
      createForm: { // 新增表单
        factorId: '',
        standardUpper: 0,
        standardLow: 0,
        timeSpan: '',
        mixingAmount: '',
      },
      factorList: [],
      rules: {
        factorId: [
          { required: true, message: '请选择因子', trigger: 'change' },
          // { required: true, message: '请选择因子', trigger: 'blur' },
        ],
        standardUpper: [
          { required: true, message: '请输入超标上限', trigger: 'blur' },
          { validator: validateStandard, trigger: 'blur' },
        ],
        standardLow: [
          { required: true, message: '请输入超标下限', trigger: 'blur' },
          { validator: validateStandard, trigger: 'blur' },
        ],
        sampleBottleNum: [
          { required: true, message: '请输入采样瓶数', trigger: 'blur' },
          { validator: validateInt, trigger: 'blur' },
        ],
        timeSpan: [
          { required: true, message: '请输入时间间隔', trigger: 'blur' },
          { validator: validateInt, trigger: 'blur' },
        ],
        mixingAmount: [
          { required: true, message: '请输入混合量', trigger: 'blur' },
          { validator: validateFloat, trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    this.getPortList();
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
    onNodeClick(data, node) { // 点击树点位节点
      if (node.isLeaf) {
        this.port = { ...data, portId: data.id };
        // this.port.portName = data.portName;
        // this.port.psName = data.psName;
        this.getItemList();
      }
    },
    onChangeSelect(val) {  // 选择因子下拉框变化
      const factorItem = this.factorList.filter(n => n.id === val);
      [this.factorItem] = factorItem;
    },
    beforeClose() {
      this.$refs.form.resetFields();
      this.$refs.dialog.closeDialog();
    },
    onCreated() { // 点击新增打开弹窗
      this.$refs.dialog.openDialog();
      this.$http.get('cfg/factors/?page=1&rows=100000&factorsType=1&category=1&sort=factorName').then((response) => {
        if (response.data.code === 200) {
          this.factorList = response.data.rows || response.data.data || response.data;
        }
      });
    },
    onChangeStandard() {
      this.$refs.form.validateField(['standardLow', 'standardUpper']);
    },
    onSaveItem() { // 点击保存
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const {
          regionCodeId,
          regionName,
          psId,
          psName,
          portName,
          portId,
          dgiMn,
        } = this.port;
        const {
          factorId,
          standardUpper,
          standardLow,
          timeSpan,
          sampleBottleNum,
          mixingAmount,
        } = this.createForm;
        const { factorName, factorCode } = this.factorItem;
        this.$http.post('autoSample/overProofSampleConfig', {
          regionCodeId,
          regionName,
          psId,
          psName,
          portName,
          portId,
          dgiMn,
          factorCode,
          factorName,
          // createForm
          factorId,
          standardUpper,
          standardLow,
          timeSpan,
          sampleBottleNum,
          mixingAmount,
        }).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: response.data.msg,
              duration: 3000,
              showClose: true,
            });
            this.beforeClose();
            this.pager.page = 1;
            this.getItemList();
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
    onDelItem() { // 删除配置
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('autoSample/overProofSampleConfig', { data: this.selectedIds })
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
    getItemList() { // 获取列表数据
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get('autoSample/overProofSampleConfig', {
        params: {
          page,
          rows,
          portId: this.port.portId,
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
    getPortList() { // 获取树列表数据
      this.treeLoading = true;
      this.$http.get('bas/portInfo/queryAuthority/?page=1&rows=100000', {
        params: {
          childPortType: 4,
          portType: 1,
          sort: 'psName+,portName',
          ...this.queryForm,
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

<style lang="scss" scoped>

</style>
