<template>
  <el-row :gutter="$config.space" v-resize>
    <el-col :span="5">
      <el-card type="title">
        <div slot="header">
          <span>传输率配置</span>
        </div>
        <div class="mod-tree-list">
          <el-scrollbar class="fill-h" :native="false" :noresize="false">
            <el-tree
              ref="tree"
              v-loading="treeLoading"
              highlight-current
              style="height: '100%'"
              :expand-on-click-node="false"
              :default-expand-all="true"
              :props="propsMerge"
              :data="treeList"
              :render-content="renderContent"
              @node-click="onClickNode">
            </el-tree>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-row style="height: 100%;">
        <el-col :h="6" class="mar-b-sm">
          <factors-config ref="portFac" title="污染物因子"></factors-config>
        </el-col>
        <el-col :h="6">
          <factors-config ref="argumentFac" title="参数因子"></factors-config>
        </el-col>
      </el-row>
    </el-col>
    <dialog-modal
      ref="dialog"
      title="批量新增排口"
      size="large">
      <el-form inline class="pad-x-sm" :model="queryForm">
        <el-form-item label="排口名称：">
          <el-input v-model="queryForm.portName" style="width: 190px;">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onQueryList">查 询</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button
            type="success"
            icon="fas fa-check"
            style="float: right;"
            v-loading="checkLoading"
            :disabled="!selectedIds.length"
            @click="onClickCheck">确 认
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        border
        :data="itemList"
        height="calc(86vh - 114px)"
        highlight-current-row
        @select="onChangeCheck"
        @select-all="onChangeCheckAll"
        @selection-change="onChangeSelected">
        <el-table-column align="center" label="No." width="45" type="index" :index="index"></el-table-column>
        <el-table-column align="center" type="selection" width="37"></el-table-column>
        <el-table-column prop="regionName" label="所属区域" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="psName" label="企业名称" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="portName" label="排口名称" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dgiMn" label="MN" min-width="140" show-overflow-tooltip></el-table-column>
      </el-table>
      <paging-query :pager="pager" @query="getItemList"/>
    </dialog-modal>
  </el-row>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import FactorsConfig from './components/FactorsConfig';
import { queryList } from '@/global/libs/mixins';

export default {
  name: 'WaterTransmissionEfficiencyConfig',
  components: { FactorsConfig },
  mixins: [queryList],
  data() {
    return {
      btnLevel: 1, // 按钮显示在那一层（新增按钮）
      folder: true,
      iconLevel: {}, // 指定层级图标的类
      btnNode: 'add remove',
      treeLoading: false,
      treeList: [],
      // 新增排口弹窗
      url: 'bas/portInfo/queryAuthority/',
      isAuto: false,
      queryForm: {
        childPortType: 1,
        portType: 1,
        portName: '',
        sort: 'psName-,portName',
      }, // 新增排口检索表单
      checkLoading: false,
      systemItem: {}, // 系统类型节点
      itemList: [],
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  computed: {
    // 树形控件配置项参数合并
    propsMerge() {
      const propsTemp = Object.assign({
        parent: 'parentId',
        value: 'rowGuid',
        label: 'dictName',
        children: 'children',
        disabled: 'disabled', // 是否禁用
        isLeaf: 'isLeaf',     // 是否为叶子节点
      }, this.props);
      return propsTemp;
    },
  },
  created() {
    this.getTreeList();
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 获取父级树（一二级）列表
    getParentTreeList() {
      return this.$http.get('sys/enumCode?codeValue=PortType');
    },
    // 获取子级树（三级）列表
    getChildrenTreeList() {
      return this.$http.get('cfg/transferEffective');
    },
    getTreeList() {
      this.treeLoading = true;
      this.$http.all([this.getParentTreeList(), this.getChildrenTreeList()]).then(this.$http.spread((par, chi) => {
        this.treeList = this.getTreeData(par.data, chi.data.data);
      }), ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.treeLoading = false;
      });
    },
    // 获取树 数组
    getTreeData(parent, ports) {
      const treeData = [];
      parent.forEach((element) => {
        this.$set(element, 'children', []);
        if (element.parentId  === '0') {
          treeData.push(element);
        } else {
          ports.forEach((ele) => {
            // this.$set(ele, 'children', []);
            // eslint-disable-next-line
            if (ele.portType == element.dictValue && ele.systemTypeId === element.parentId) {
              element.children.push({ ...ele, dictName: ele.portName });
            }
          });
        }
      });
      treeData.forEach((element) => {
        parent.forEach((ele) => {
          if (element.rowGuid === ele.parentId) {
            element.children.push(ele);
          }
        });
      });
      return this.cleanChildren(treeData);
    },
    // 单击节点事件
    onClickNode(node, el) {
      const fn = (e) => {
        let portType;
        if (e.level === 1) {
          portType = e.data.dictValue;
        } else {
          portType = fn(e.parent);
        }
        return portType;
      };
      const configType = el.level;
      const portType = fn(el);
      const id = node.rowGuid || node.id;
      this.$refs.portFac.setConfigId({
        id,
        portType,
        configType,
        category: 0,
      });
      this.$refs.argumentFac.setConfigId({
        id,
        portType,
        configType,
        category: 1,
      });
    },
    onClickBtn(node, store, event, type) {
      // 点击新增树节点
      if (type.includes('add')) {
        this.systemItem = node.parent.data;
        this.queryForm.portType = node.parent.data.dictValue;
        this.queryForm.childPortType = node.data.dictValue;
        this.getItemList();
        this.$refs.dialog.openDialog();
      // 点击新增树节点
      } else if (type.includes('remove')) {
        this.deleteTreeNode(node.data.id);
      }
    },
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    onClickCheck() { // 点击确认新增节点
      this.checkLoading = true;
      this.$http.post('cfg/transferEffective', {
        configType: 3,
        systemTypeId: this.systemItem.rowGuid,
        systemTypeCode: this.systemItem.dictCode,
        portType: this.queryForm.childPortType,
        portIds: [...this.selectedIds],
      }).then((response) => {
        if (response.data.code === 200) {
          this.$message.success({
            message: '操作成功',
            duration: 3000,
            showClose: true,
          });
          this.$refs.dialog.closeDialog();
          this.getTreeList();
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.checkLoading = false;
      });
    },
    deleteTreeNode(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('cfg/transferEffective', { params: { configId: id } })
      )).then((response) => {
        if (response.data.code === 200) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          this.getTreeList();
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
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n.parentId === parentId) {
            n.children = fa(n.rowGuid);
            temp.push(n);
          }
        }
        return temp;
      };
      return fa(id);
    },
    // 清除空 children项
    cleanChildren(data) {
      const fa = (list) => {
        list.map((e) => {
          if (e.children ? e.children.length : false) {
            fa(e.children);
          } else {
            delete e.children;
          }
          return e;
        });
        return list;
      };
      return fa(data);
    },
    // 图标类名规则
    getIconClass(node) {
      // console.log(node, this.folder);
      let icon = '';
      if (node.level === 1) {
        icon = 'fab fa-windows text-success';
      } else if (node.level === 2) {
        icon = 'fas fa-project-diagram text-warning';
      } else if (node.level === 3) {
        icon = 'fas fa-tint text-primary';
      }
      return icon;
      // 叶子节点是否显示为文件夹图标
      // if (this.folder) return `fas fa-folder${node.isLeaf ? '-open' : ''}`;
      // // 是否定制图标
      // const keys = Object.keys(this.iconLevel);
      // if (keys.length && keys.includes(`${node.level}`)) {
      //   return this.iconLevel[node.level];
      // }
      // // 默认状态
      // const folderClass = node.expanded ? 'folder-open' : 'folder';
      // return `fas fa-${node.isLeaf ? 'file' : folderClass}`;
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      const level = ['string', 'number'].includes(typeof this.btnLevel)
        ? [this.btnLevel - 0, 10]
        : this.btnLevel;
      const showBtns = node.level > level[0];
      const showBtn = v => this.btnNode.includes(v);
      // const folderClass = node.level === 1 ? 'circle' : 'folder';
      // eslint-disable-next-line
      if (node.childNodes.length > 0) { node.isLeaf = false; }
      return (
        <div class="node-item" ondblclick={event => this.onDbClick(node, store, event)}>
          <span class="el-tree__icon">
            <i
              v-show={node.isLeaf}
              class={this.getIconClass(node)} />
            <i
              v-show={!node.isLeaf || node.level === 0}
              class={this.getIconClass(node)} />
            <span title={node.label}>{node.label}</span>
          </span>
          <span class="tree-btns">
            <el-button
              v-show={node.level === 2}
              type='primary'
              title='新增'
              icon="fas fa-plus"
              onClick={event => this.onClickBtn(node, store, event, 'add')}>
            </el-button>
            <el-button
              v-show={showBtns && showBtn('edit')}
              type='primary'
              title='编辑'
              icon="fas fa-pencil-alt"
              onClick={event => this.onClickBtn(node, store, event, 'edit')}>
            </el-button>
            <el-button
              v-show={showBtns && showBtn('copy')}
              type='warning'
              title='复制'
              icon="far fa-copy"
              onClick={event => this.onClickBtn(node, store, event, 'copy')}>
            </el-button>
            <el-button
              v-show={node.level === 3}
              type='danger'
              title='删除'
              icon="fas fa-trash-alt"
              onClick={event => this.onClickBtn(node, store, event, 'remove')}>
            </el-button>
            <el-button
              v-show={showBtns && showBtn('config')}
              type='warning'
              title='配置'
              icon="fas fa-cog"
              onClick={event => this.onClickBtn(node, store, event, 'config')}>
            </el-button>
          </span>
        </div>
      );
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
