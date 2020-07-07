<template>
  <div class="mod-tree-list" v-loading="loading">
    <el-scrollbar class="fill-h" :native="false" :noresize="false">
      <el-form v-if="filterable" inline class="pad-x-xs">
        <el-form-item>
          <el-input
            clearable
            v-model="queryForm.codeText"
            :placeholder="typeof filterable === 'boolean' ? '' : filterable"
            @clear="onClickQuery"
            @keyup.enter.native="onClickQuery">
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
        :lazy="lazy"
        :expand-on-click-node="false"
        :default-expanded-keys="[0]"
        :default-expand-all="this.lazy ? false : true"
        :props="props"
        :load="onLoadNodes"
        :node-key="props.value"
        :data="randerData"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        @node-click="onClickNode">
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'treeList',
  props: {
    // 数据是否为字典表常量
    constant: Boolean,
    // API接口
    url: {
      type: String,
      required: true,
    },
    // 标题 - 全部记录
    title: {
      type: String,
      default: '所有记录',
    },
    // 是否懒加载
    lazy: Boolean,
    // 是否提供搜索支持
    filterable: {
      type: [Boolean, String],
      default: false,
    },
    // 是否启用文件夹管理(仅图标发生改变)
    folder: Boolean,
    // 节点悬浮按钮
    btnNode: {
      type: String,
      default: 'add edit copy remove',
    },
    // 按钮显示在那一层（新增按钮）
    btnLevel: {
      type: [String, Number, Array],
      default: 1,
    },
    // 一键折叠节点
    collapse: Boolean,
    // 查询参数
    queryParams: {
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
      default: () => ({
        // parent: 'parentId',
        value: 'rowGuid',
        label: 'label',
        isLeaf: 'leaf',
        children: 'children',
      }),
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
      me: {},                 // 当前操作关联的节点对象
      queryForm: {            // 查询表单
        parentId: 0,
        sort: 'orderNum-',
        codeText: '',
        rows: 100000,
      },
    };
  },
  computed: {
    // 树渲染数据
    randerData() {
      const rander = {};
      this.$set(rander, this.props.value, '0');
      this.$set(rander, this.props.label, this.title);
      this.$set(rander, this.props.children, this.itemList);
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
      this.me = {
        type,   // 触发事件类型
        event,  // 事件对象
        node,   // 节点对象
        store,  // 虚拟节点对象
      };
      // 触发事件
      this.$emit('btn-click', node.data, type, node);
    },
    // 动态更新节点
    updateNode(data) {
      const { me } = this;
      // 新增节点
      if (me.type === 'add') {
        this.$refs.tree.append(data, me.node);
        // TODO: 树节点新增后触发懒加载
        // const nodeTemp = { ...me.node };
        // nodeTemp.id = this.$refs.tree.getNode(data).id;
        // this.onLoadNodes(nodeTemp, this.resolve);
      }
      // 编辑节点
      if (me.type === 'edit') { me.node.data = data; }
      // 复制节点
      if (me.type === 'copy') { this.$refs.tree.insertAfter(data, me.node.data); }
      // 移除节点
      if (me.type === 'remove') { this.$refs.tree.remove(me.node); }
    },
    // 单击节点事件
    onClickNode(node, store) {
      // 清除单击穿透事件
      clearTimeout(this.clickTimeId);
      // 设置定时器
      this.clickTimeId = setTimeout(() => {
        // 重新指向调用对象
        this.$emit('node-click', node, store);
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
      this.$refs.tree.$children.forEach((v) => {
        this.$set(v.node, 'expanded', false);
      });
    },
    // 展开全部节点
    onExpandAll() {
      this.$refs.tree.$children.forEach((v) => {
        this.$set(v.node, 'expanded', true);
      });
    },
    // 单击模糊查询
    onClickQuery() {
      this.$refs.tree.filter(this.queryForm.codeText);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    },
    // 节点加载
    onLoadNodes(node, resolve) {
      if (this.isFirst) {
        this.resolve = resolve;
        this.isFirst = false;
      }
      this.getNodeList(node.data[this.props.value], node.id).then(data => resolve(data));
    },
    // 获取节点列表
    getNodeList(id = '0', nodeId) {
      let params = {};
      if (this.filterable) {
        this.queryForm.parentId = id;
        this.queryForm.codeText = '';
        params = { ...this.queryForm, ...this.queryParams };
      } else {
        params = { parentId: id === '0' ? this.$enum.emptyRowGuid : id, ...this.queryParams };
      }
      return new Promise((resolve) => {
        if (nodeId === 0 || this.initLazy) {
          this.initLazy = false;
          const rander = {};
          this.$set(rander, this.props.value, '0');
          this.$set(rander, this.props.label, this.title);
          this.$set(rander, this.props.children, []);
          resolve([rander]);
        } else {
          this.$http.get(this.url, { params }).then((response) => {
            resolve(response.data.data || []);
          }, (response) => {
            this.$hp.resp(response);
          });
        }
      });
    },
    // 获取记录列表
    getTreeList(id = '0', callback) {
      const url = this.lazy ? `${this.url}/${id}` : this.url;
      return new Promise((resolve) => {
        this.loading = true;
        this.$http.get(url, { params: { ...this.queryForm, ...this.queryParams } }).then((response) => {
          if (response.status === 200) {
            if (this.constant) {
              this.itemList = response.data;
              resolve(response.data);
            } else {
              this.itemList = response.data.data;
              resolve(response.data.data);
            }
          } else {
            this.$message.warning({
              message: response.body.msg,
              duration: 3000,
              showClose: true,
            });
          }
        }, (response) => {
          this.$hp.resp(response);
        }).finally(() => {
          this.loading = false;
          if (callback) { callback(this.$refs.tree); }
        });
      });
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      const level = ['string', 'number'].includes(typeof this.btnLevel)
        ? [this.btnLevel - 0, 10]
        : this.btnLevel;
      const showAdd = node.level >= level[0] && node.level <= level[1];
      const showBtns = node.level > level[0];
      const showBtn = v => this.btnNode.includes(v);
      // eslint-disable-next-line
      if (node.childNodes.length > 0) { node.isLeaf = false; }
      return (
        <div class="node-item" ondblclick={event => this.onDbClick(node, store, event)}>
          <span class="el-tree__icon">
            <i v-show={node.isLeaf} class={`fas fa-${this.folder ? 'folder-open' : 'file'}`} />
            <i
              v-show={!node.isLeaf || node.level === 0}
              class={`fas fa-${node.expanded ? 'folder-open' : 'folder'}`} />
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
