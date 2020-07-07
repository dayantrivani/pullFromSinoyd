<template>
  <div :class="{ 'mod-tree-list': 1, 'border-a': border }" v-loading="loading">
    <el-scrollbar class="fill-h" :native="false" :noresize="false">
      <el-form v-if="filterable" inline class="pad-x-xs">
        <el-form-item>
          <el-input
            clearable
            v-model="queryForm.codeText"
            :placeholder="typeof filterable === 'boolean' ? '' : filterable"
            @clear="onClickQuery">
            <!-- @keyup.enter.native="onClickQuery"> -->
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="fas fa-search" @click="onClickQuery">查 询</el-button>
        </el-form-item>
      </el-form>
      <el-tree
        ref="tree"
        highlight-current
        :style="`height: ${ filterable ? 'calc(100% - 33px)' : '100%'}`"
        :expand-on-click-node="false"
        :lazy="lazy"
        :show-checkbox="showCheckbox"
        :default-expanded-keys="expandedKeys"
        :default-expand-all="this.lazy ? false : true"
        :props="propsMerge"
        :load="onLoadNodes"
        :node-key="propsMerge.value"
        :data="randerData"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        @check="onCheck"
        @node-click="onClickNode"
        @node-expand="onNodeExpand"
        @node-collapse="onNodeCollapse">
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { getType } from '@/global/libs/tools';

export default {
  name: 'MenuTree',
  props: {
    // 数据是否为字典表常量
    constant: Boolean,
    // 是否显示边框
    border: Boolean,
    // 是否懒加载
    lazy: Boolean,
    // 是否启用文件夹管理(仅图标发生改变)
    folder: Boolean,
    // 一键折叠节点
    collapse: Boolean,
    // 一键折叠节点指定层级
    collapseRoot: Boolean,
    // API接口
    url: {
      type: String,
      required: true,
    },
    // 刷新后保留高亮
    saveActive: {
      type: Boolean,
      default: true,
    },
    // 路由name值作为高亮key
    currentRoute: Boolean,
    // 标题 - 全部记录
    title: {
      type: String,
      default: '所有记录',
    },
    // 是否提供搜索支持
    filterable: {
      type: [Boolean, String],
      default: false,
    },
    // 根节点key值
    rootKey: {
      type: String,
      default: '0',
    },
    // 节点悬浮按钮 add edit copy remove
    btnNode: {
      type: String,
      default: '',
    },
    // 按钮显示在那一层（新增按钮）
    btnLevel: {
      type: [String, Number, Array],
      default: 1,
    },
    // 显示选择框
    showCheckbox: Boolean,
    // 指定层级图标的类
    iconLevel: {
      type: Object,
      default: () => ({}),
    },
    // 查询参数
    queryParams: {
      type: Object,
      default: () => ({
        rows: 100000,
        page: 1,
        sort: 'orderNum-',
      }),
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      initLazy: true,         // 是否初始化懒加载
      isFirst: true,          // 确保只缓存一次懒加载方法
      resolve: () => {},      // 缓存懒加载方法
      itemList: [],           // 数据记录列表
      clickTimeId: undefined, // 单击延时触发
      self: {},               // 当前操作关联的节点对象
      // 已展开节点的 key
      expandedKeys: [this.rootKey],
      // 查询表单
      queryForm: {
        parentId: 0,
        sort: 'orderNum-',
        codeText: '',
        rows: 100000,
      },
    };
  },
  computed: {
    // 树形控件配置项参数合并
    propsMerge() {
      const propsTemp = Object.assign({
        parent: 'parentId',
        value: 'rowGuid',
        label: 'label',
        children: 'children',
        disabled: 'disabled', // 是否禁用
        isLeaf: 'isLeaf',     // 是否为叶子节点
      }, this.props);
      return propsTemp;
    },
    // 树渲染数据
    randerData() {
      const rander = {};
      this.$set(rander, this.propsMerge.value, this.rootKey);
      this.$set(rander, this.propsMerge.label, this.title);
      this.$set(rander, this.propsMerge.children, this.itemList);
      return this.lazy ? this.itemList : [rander];
    },
  },
  watch: {
    collapse(val) {
      if (val) {
        this.onExpandAll();
      } else {
        this.onCollapseAll();
      }
    },
    $route({ name }) {
      if (this.currentRoute) {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(name);
        });
      }
    },
  },
  created() {
    if (!this.lazy) {
      this.getTreeList();
    } else {
      this.initLazy = true;
    }
  },
  methods: {
    // 单击节点悬浮按钮事件
    onClickBtn(node, store, event, type) {
      // 清除事件穿透
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      // 暂存操作信息
      this.self = {
        type,   // 触发事件类型
        event,  // 事件对象
        node,   // 节点对象
        store,  // 虚拟节点对象
      };
      // 触发事件
      this.$emit('btn-click', node.data, type, node);
    },
    // 动态更新节点
    updateNode() {
      const { self } = this;
      const isAdd = self.type === 'add';  // 是否为新增操作
      const nodeId = isAdd ? self.node.id : self.node.parent.id;
      const nodeKey = isAdd ? self.node.data[this.propsMerge.value] : self.node.parent.data[this.propsMerge.value];
      // 获取节点数据, 新增操作获取子节点数据， 非新增获取父节点数据
      this.getNodeList(nodeKey, nodeId).then((data) => {
        // 动态更新节点 keys
        this.$refs.tree.updateKeyChildren(nodeKey, data);
        this.expendedNode();
      });
    },
    // 恢复节点展开状态
    expandedNode() {
      this.expandedKeys.forEach((key) => {
        this.$set(this.$refs.tree.getNode(key), 'expanded', true);
      });
    },
    // 节点选中状态发生变化时的回调
    onCheck(...args) {
      if (!this.showCheckbox) return;
      this.$emit('check', args);
    },
    // 单击节点事件
    onClickNode(data, node) {
      // 清除单击穿透事件
      clearTimeout(this.clickTimeId);
      // 暂存操作节点，方便刷新后设置高亮
      this.self.node = node;
      // 设置定时器
      this.clickTimeId = setTimeout(() => {
        // 重新指向调用对象
        // 异常报警不做处理
        if (data.alarmTypeCode !== 'AlarmAbnormal') this.$emit('node-click', data, node);
      }, 300);
    },
    // 双击节点事件(展开与收缩)
    onDbClick(node) {
      // 取消单击延时未执行的方法
      clearTimeout(this.clickTimeId);
      if (node.isLeaf) return;
      if (node.expanded) {
        node.collapse();
      } else {
        node.expand();
      }
    },
    // 折叠全部节点
    onCollapseAll() {
      this.onChangeNodeAll(false);
      this.expandedKeys = [];
    },
    // 展开全部节点
    onExpandAll() {
      this.onChangeNodeAll(true);
    },
    // 节点被展开时触发的事件
    onNodeExpand(data, node) {
      if (!this.expandedKeys.includes(node.key)) {
        this.expandedKeys.push(node.key);
      }
    },
    // 节点被关闭时触发的事件
    onNodeCollapse(data, node) {
      const index = this.expandedKeys.indexOf(node.key);
      if (index !== -1) {
        this.expandedKeys.splice(node.key, 1);
      }
    },
    // 改变节点状态，折叠 or 展开
    onChangeNodeAll(isExpanded = false) {
      if (this.$refs.tree.$children.length === 1 && !this.collapseRoot) {
        this.$refs.tree.$children[0].$children.forEach((v) => {
          this.$set(v.node, 'expanded', isExpanded);
        });
        this.$set(this.$refs.tree.$children[0].node, 'expanded', true);
      } else {
        this.$refs.tree.$children.forEach((v) => {
          this.$set(v.node, 'expanded', isExpanded);
        });
      }
    },
    // 单击模糊查询
    onClickQuery() {
      this.$refs.tree.filter(this.queryForm.codeText);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.propsMerge.label].indexOf(query) !== -1;
    },
    // 节点加载
    onLoadNodes(node, resolve) {
      if (this.isFirst) {
        this.resolve = resolve;
        this.isFirst = false;
      }
      this.getNodeList(node.data[this.propsMerge.value], node.id).then(data => resolve(data));
    },
    // 获取节点列表
    getNodeList(id = this.rootKey, nodeId) {
      let params = {};
      if (this.filterable) {
        this.queryForm.parentId = id;
        this.queryForm.codeText = '';
        params = { ...this.queryForm, ...this.queryParams };
      } else {
        params = { parentId: id === this.rootKey ? this.$enum.emptyRowGuid : id, ...this.queryParams };
      }
      return new Promise((resolve) => {
        if (nodeId === 0 || this.initLazy) {
          this.initLazy = false;
          const rander = {};
          this.$set(rander, this.propsMerge.value, this.rootKey);
          this.$set(rander, this.propsMerge.label, this.title);
          this.$set(rander, this.propsMerge.children, []);
          resolve([rander]);
        } else {
          this.$http.get(this.url, { params }).then((response) => {
            resolve(response.data.data || []);
          }, ({ response }) => {
            analyzeResp(response);
          });
        }
      });
    },
    // 获取记录列表
    getTreeList(id = this.rootKey, callback) {
      const url = this.lazy ? `${this.url}/${id}` : this.url;
      return new Promise((resolve) => {
        this.loading = true;
        this.$http.get(url, { params: { ...this.queryForm, ...this.queryParams } }).then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$store.commit('sample/setAlarmType', response.data.data);
            this.itemList = getType(response.data) === 'object' ? response.data.data : response.data;
            this.itemList = this.cleanChildren(this.buildTree(this.itemList, ''));
            this.itemList.sort((m, n) => n.alarmTypeCode.localeCompare(m.alarmTypeCode));
            this.$router.push({ name: this.getChildOne(this.itemList).alarmTypeCode });
            // 刷新后保留高亮状态
            if (this.self.node && this.saveActive) {
              this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(this.self.node.key);
              });
            }
            if (this.currentRoute) {
              this.$nextTick(() => {
                this.$refs.tree.setCurrentKey(this.$route.name || null);
              });
            }
            resolve(this.itemList);
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
          this.loading = false;
          if (callback) { callback(this.$refs.tree); }
        });
      });
    },
    // 获取第一个子节点
    getChildOne(data) {
      const fa = (item) => {
        let temp;
        if (item[0].children) {
          temp = fa(item[0].children);
        } else {
          [temp] = item;
        }
        return temp;
      };
      return fa(data);
    },
    // 将一维的扁平数组转换为多层级对象
    buildTree(data, id = '0') {
      const fa = (parentId) => {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          const n = data[i];
          if (n.parentId === parentId) {
            n.children = fa(n.id);
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
          if (e.children.length) {
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
      // 叶子节点是否显示为文件夹图标
      if (this.folder) return `fas fa-folder${node.isLeaf ? '-open' : ''}`;
      // 是否定制图标
      const keys = Object.keys(this.iconLevel);
      if (keys.length && keys.includes(`${node.level}`)) {
        return this.iconLevel[node.level];
      }
      // 默认状态
      const folderClass = node.expanded ? 'folder-open' : 'folder';
      return `fas fa-${node.isLeaf ? 'file' : folderClass}`;
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      const level = ['string', 'number'].includes(typeof this.btnLevel)
        ? [this.btnLevel - 0, 10]
        : this.btnLevel;
      const showAdd = node.level >= level[0] && node.level <= level[1];
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
            <span>{node.label}</span>
          </span>
          <span class="tree-btns">
            <el-button
              v-show={showAdd && showBtn('add')}
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
              v-show={showBtns && showBtn('remove')}
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
