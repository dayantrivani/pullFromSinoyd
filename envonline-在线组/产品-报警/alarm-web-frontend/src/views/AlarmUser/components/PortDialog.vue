<template>
  <!-- 相关排口弹窗 -->
  <dialog-modal ref="dialog" title="相关排口" size="middle">
    <!-- 查询表单 -->
    <el-form inline :model="queryForm" class="mar-l-xs fn-no-wrap">
      <el-form-item label="行政区域：">
        <select-tree
          lazy
          filterable
          joint
          root-key="0"
          v-model="queryForm.regionCodeId"
          :props="{ label: 'areaName' }"
          url="sys/area"
        ></select-tree>
      </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="queryForm.key" placeholder="请输入站点名称、MN号" style="width: 220px"></el-input>
        </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
      </el-form-item>
    </el-form>
    <hr class="mar-t-0"/>
    <div class="mar-l-xs mar-y-xs">
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
      height="450px"
      v-loading="loading"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="37"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50" :index="index"></el-table-column>
      <el-table-column property="regionName" min-width="80" label="行政区域" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="psName" min-width="150" label="企业名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="portName" label="站点名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="dgiMn" label="MN" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="portTypeName" label="排口类型" show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal
      ref="portDialog"
      :before-close="beforeClose"
      title="排口选择"
      appendToBody>
      <el-form inline :model="queryPortForm" class="mar-t-xs mar-l-xs fn-no-wrap">
        <el-form-item label="样品类型：">
          <select-tree-mod ref="selectTreeMod" @getTreeData="getTreeData" :options="options"></select-tree-mod>
        </el-form-item>
        <el-form-item label="关键字：">
          <el-input v-model="queryPortForm.key" placeholder="请输入站点名称、MN号" style="width: 220px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="getPortInfo">查 询</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        style="max-height: 50vh;overflow: auto;"
        v-loading="treeLoading"
        ref="tree"
        :data="treeData"
        highlight-current
        show-checkbox
        :render-after-expand="false"
        :expand-on-click-node="false"
        :default-expand-all="false"
        :render-content="renderContent">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSaveItem" icon="fas fa-save">保 存</el-button>
        <el-button @click="beforeClose" icon="fa fa-times">关 闭</el-button>
      </div>
    </dialog-modal>
  </dialog-modal>
</template>

<script>
import { mapState } from 'vuex';
import SelectTreeMod from '@/components/select-tree-mod';
// import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';
// import SelectTreeMod from '@/components/common/SelectTreeMod';

export default {
  name: 'PortDialog',
  components: { SelectTreeMod },
  data() {
    return {
      loading: false,
      queryForm: {
        key: '',
        regionCodeId: '',
        userId: '',
      },
      selectedIds: [],
      pager: {
        rows: 15,
        page: 1,
        count: 1,
      },
      itemList: [],
      // 新增排口弹窗
      treeLoading: false, // 树加载动画
      queryPortForm: {
        currentUserId: '', // 父级userId
        key: '',
        portTypes: [],
      },
      keys: ['regionName', 'psName', 'portTypeName', 'portName'],
      treeMap: [], // 排口树菜单（按类型，组成Map的格式）
      // treeData: [], // 排口树菜单
      // options: [], // 样品类型多选树菜单
    };
  },
  created() {},
  computed: {
    ...mapState({
      options: state => state.sample.portTypeList, // 样品类型多选树菜单
    }),
    treeData() {
      let treeData = [];
      if (this.options.length !== 0 && this.treeMap.length !== 0) {
        treeData = this.getTreeList(this.treeMap);
      } else {
        treeData = [];
      }
      return treeData;
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
    openDialog(row) {
      this.queryForm.userId = row.id;
      this.queryPortForm.currentUserId = row.userId;
      this.getItemList();
      this.$refs.dialog.openDialog();
    },
    beforeClose() {
      this.$refs.portDialog.closeDialog();
    },
    // 表格
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onClickAdd() { // 新增事件
      this.getPortTypeList();
      if (this.treeData.length === 0) {
        this.getPortInfo();
      }
      this.$refs.portDialog.openDialog();
    },
    getItemList() {
      this.loading = true;
      const { rows, page } = this.pager;
      this.$http.get('alarm/alarmUserPort', {
        params: {
          rows,
          page,
          sort: 'regionName+psName+portName',
          ...this.queryForm,
        },
      }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.count = response.data.total || response.data.count || response.count;
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
        this.$http.delete('alarm/alarmUserPort', { data: this.selectedIds })
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
    // 新增排口弹窗
    getPortTypeList() {
      this.$http.post('sys/enumCode/?codeValue=PortType', {
        portTypes: [[1, [1, 2]], [2, [2, 3]]],
        status: 1,
        key: '',
      }).then((response) => {
        const data = response.data.rows || response.data.data || response.data;
        this.$store.commit('sample/setPortTypeList', data);
        // if (this.treeData.length === 0) {
        //   this.getPortInfo();
        // }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
    getPortInfo() {
      this.treeLoading = true;
      this.$http.post('bas/portInfo/queryAuthority/', this.queryPortForm, {
        params: {
          page: 1,
          rows: 100000,
          sort: 'regionCodeId+,psName+,portType+,portName',
        },
      }).then((response) => {
        this.treeMap = this.mapTreeList(response.data.data, this.keys); // 按企业
        // this.treeData = this.getTreeList(map);
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.treeLoading = false;
      });
    },
    getTreeData(val) { // 类型下拉框选择事件
      this.queryPortForm.portTypes = val || [];
    },
    onSaveItem() {
      const selectNodes = this.$refs.tree.getCheckedNodes(true);
      const body = selectNodes.map(n => ({
        userId: this.queryForm.userId,
        psId: n.psId,
        psName: n.psName,
        dgiMn: n.dgiMn,
        regionName: n.regionName,
        regionCodeId: n.regionCodeId,
        portName: n.portName,
        portId: n.id,
      }));
      this.$http.post('alarm/alarmUserPort', body).then((response) => {
        if (response.data.success) {
          this.$message.success({
            message: response.data.msg,
            duration: 3000,
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.beforeClose();
        this.getItemList();
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
              this.$set(n, 'label', `${n.portName}(MN：${n.dgiMn})(${this.getDictName(n.portType, n.childPortType)})`);
              return n;
            }),
          });
        }
      });
      return treeData;
    },
    getDictName(parentId, childId) {
      let dictName = '';
      // eslint-disable-next-line
      const parent = this.options.filter(n => (n.dictValue == parentId) && (n.parentId == 0));
      if (childId && childId !== '') {
        const children = this.options.filter(n => n.parentId === parent[0].rowGuid);
        // eslint-disable-next-line
        const child = children.filter(n => n.dictValue == childId);
        dictName = child[0].dictName || '';
      } else {
        dictName = parent[0].dictName || '';
      }
      return dictName;
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
