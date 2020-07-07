<template>
  <div class="tree-list">
    <!-- <el-form inline class="mar-t-xs mar-x-xs fn-flex">
      <el-form-item>
        <el-input
          clearable
          v-model="queryForm.codeText"
          placeholder="站点名称"
          @clear="onClickQuery"
          @keyup.enter.native="onClickQuery">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fas fa-search" @click="onSearch">查 询</el-button>
      </el-form-item>
    </el-form> -->
    <el-tree
      ref="tree"
      highlight-current
      :lazy="lazy"
      :show-checkbox="checkbox"
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
    <el-dialog
      v-if="dialogVisible"
      ref="form"
      :title="`${isEdit ? '编辑' : '新增'}${title}`"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @close="closeDialog">
      <slot :scope="itemModel"></slot>
      <div slot="footer">
        <el-button type="primary" icon="fas fa-save" :loading="saveLoading" @click="onSaveItem">保 存</el-button>
        <el-button class="fas fa-times" @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'setValue',
  },
  props: {
    // API接口
    url: {
      type: String,
      required: true,
    },
    // 标题 - 全部记录
    title: {
      type: String,
      default: '记录',
    },
    // 是否懒加载
    lazy: Boolean,
    // 是否显示多选框
    checkbox: {
      type: Boolean,
      default: true,
    },
    // 节点悬浮按钮
    nodeBtn: {
      type: String,
      default: 'add edit copy remove',
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        // parent: 'parentId',
        value: 'id',
        label: 'areaName',
        children: 'children',
      }),
    },
  },
  data() {
    return {
      dialogVisible: false, // 节点编辑表单显示
      saveLoading: false,
      isEdit: false,        // 编辑或新增
      itemModel: {},        // 表单绑定对象
      itemList: [],         // 数据记录列表
      queryForm: {          // 查询表单
        parentId: 0,
        codeText: '',
      },
    };
  },
  computed: {
    // 树渲染数据
    randerData() {
      // 若真实数据请求请删掉一下 if 中的代码
      if (!this.lazy) {
        return [
          {
            id: 1,
            label: '一级 1',
            children: [{
              id: 4,
              label: '二级 1-1',
              children: [{ id: 9, label: '三级 1-1-1' }, { id: 10,  label: '三级 1-1-2' }],
            }],
          }, { id: 2, label: '一级 2', children: [{ id: 5, label: '二级 2-1' }, { id: 6, label: '二级 2-2' }] },
          { id: 3, label: '一级 3', children: [{ id: 7, label: '二级 3-1' }, { id: 8, label: '二级 3-2' }] },
        ];
      }
      const rander = {};
      this.$set(rander, this.props.value, '0');
      this.$set(rander, this.props.label, `所有${this.title}`);
      this.$set(rander, this.props.children, this.itemList);
      return [rander];
    },
  },
  created() {
    this.getItemList();
  },
  methods: {
    onSearch() {
      this.onClickQuery();
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      const isRoot = node.label === `所有${this.title}`;
      const btnStr = this.nodeBtn;
      return (
        <div class="node-item" ondblclick={event => this.ondblclick(node, store, event)}>
          <span class="el-tree__icon">
            <i v-show={node.isLeaf} class="fas fa-file" />
            <i v-show={!node.isLeaf} class={`fas fa-${node.expanded ? 'folder-open' : 'folder'}`} />
            <span>{node.label}</span>
          </span>
          <span class="tree-btns">
            <el-button
              v-show={btnStr.includes('add')}
              type='primary'
              title='新增'
              icon="fas fa-plus"
              onClick={event => this.onClickAdd(node, store, event)}>
            </el-button>
            <el-button
              v-show={!isRoot && btnStr.includes('edit')}
              type='primary'
              title='编辑'
              icon="fas fa-pencil-alt"
              onClick={event => this.onClickEdit(node, store, event)}>
            </el-button>
            <el-button
              v-show={!isRoot && btnStr.includes('copy')}
              type='warning'
              title='复制'
              icon="far fa-copy"
              onClick={event => this.onClickCopy(node, store, event)}>
            </el-button>
            <el-button
              v-show={!isRoot && btnStr.includes('remove')}
              type='danger'
              title='删除'
              icon="far fa-trash-alt"
              onClick={event => this.onClickRemove(node, store, event)}>
            </el-button>
          </span>
        </div>
      );
    },
    // 双击节点事件(展开收缩)
    ondblclick(node) {
      if (node.isLeaf) return;
      if (node.expanded) {
        node.collapse();
      } else {
        node.expand();
      }
    },
    // 单击节点事件
    onClickNode(item) {
      this.$emit('query', item);
    },
    // 单击模糊查询
    onClickQuery() {
      this.$refs.tree.filter(this.queryForm.codeText);
    },
    // 节点加载
    onLoadNodes(node, resolve) {
      this.getNodeList(node.data[this.props.value]).then(data => resolve(data));
    },
    // 获取节点列表
    getNodeList(id = '0') {
      // this.queryForm.parentId = id;
      // this.queryForm.codeText = '';
      return new Promise((resolve) => {
        // this.$http.get(this.url, { params: { ...this.queryForm } }).then((response) => {
        //   resolve(response.data.rows || []);
        // }, ({ response }) => {
        //   this.$hp.resp(response);
        // });

        // 若真实请求请删除以下 resolve() 中的代码,并取消以上注释代码
        const data = {
          '0': [{ id: 1, label: '一级 1', children: [] },
            { id: 2, label: '一级 2', children: [] },
            { id: 3, label: '一级 3', children: [] }],
          '1': [{ id: 4,  label: '二级 1-1', children: [] }],
          '2': [{ id: 5, label: '二级 2-1', leaf: true }, { id: 6, label: '二级 2-2', leaf: true }],
          '3': [{ id: 7, label: '二级 3-1', leaf: true }, { id: 8, label: '二级 3-2', leaf: true }],
          '4': [{ id: 9, label: '三级 1-1-1', leaf: true }, { id: 10, label: '三级 1-1-2', leaf: true }],
        };
        setTimeout(() => {
          resolve(data[id] || []);
        }, 500);
      });
    },
    // 获取新建节点对象
    getEmptyItem(node) {
      const reset = (obj) => {
        const initObj = {};
        const enums = {
          string: '',
          boolean: false,
          number: 0,
          array: [],
          object: {},
        };
        Object.keys(obj).forEach((key) => {
          initObj[key] = enums[this.$hp.getType(obj[key])];
        });
        return initObj;
      };
      const empty = reset(this.itemList[0]);
      empty[this.props.parent] = node[this.props.value];
      return empty;
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    },
    // 新增节点
    onClickAdd(node, store, e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      // this.itemModel = this.getEmptyItem(node.data);
      // this.isEdit = false;
      // this.dialogVisible = true;
    },
    // 编辑节点
    onClickEdit(node, store, e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      // this.itemModel = { ...node.data };
      // this.isEdit = true;
      // this.dialogVisible = true;
    },
    // 复制节点
    onClickCopy(node, store, e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      // const item = node.data;
      // delete item[this.props.value];
      // this.$http.post(this.url, item)
      //   .then((response) => {
      //     if (response.status === 200) {
      //       this.$message.success({
      //         message: '复制成功',
      //         duration: 3000,
      //         showClose: true,
      //       });
      //       this.getItemList();
      //     } else {
      //       this.$message.warning({
      //         message: response.data.message,
      //         duration: 3000,
      //       });
      //     }
      //   }, ({ response }) => {
      //     this.$hp.resp(response);
      //   });
    },
    // 删除节点
    onClickRemove(node, store, e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      // this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      // }).then(() => (
      //   this.$http.delete(this.url, { data: [node.data[this.props.value]] })
      // )).then((response) => {
      //   if (response.status === 200) {
      //     this.$message.success({
      //       message: '删除成功',
      //       duration: 1500,
      //       showClose: true,
      //     });
      //     this.getItemList();
      //   } else {
      //     this.$message.warning({
      //       message: response.data.message,
      //       duration: 1500,
      //     });
      //   }
      // }, ({ response }) => {
      //   this.$hp.resp(response);
      // });
    },
    // 保存记录
    onSaveItem() {
      // console.log(this.$refs.form.$children[2]);
      this.$refs.form.$children[2].validate((valid) => {
        if (!valid) return;
        this.saveLoading = true;
        this.$http[this.isEdit ? 'put' : 'post'](this.url, this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${this.isEdit ? '编辑' : '新增'}成功`,
                duration: 3000,
                showClose: true,
              });
              this.getItemList();
              this.dialogVisible = false;
            } else {
              this.$message.warning({
                message: response.data.msg,
                duration: 3000,
                showClose: true,
              });
            }
          }).finally(() => {
            this.saveLoading = false;
          });
      });
    },
    // 关闭弹框表单
    closeDialog() {},
    // 获取记录列表
    getItemList() {
      return new Promise((resolve) => {
        this.loading = true;
        this.$http.get(this.url, {
          params: this.queryForm,
        }).then((response) => {
          if (response.data.success) {
            this.itemList = response.data.data;
            resolve(this.itemList);
          } else {
            this.$message.warning({
              message: response.body.msg,
              duration: 1500,
              showClose: true,
            });
          }
        }).finally(() => {
          this.loading = false;
        });
      });
    },
    loadNode1(node, resolve) {
      this.getItemList().then((date) => {
        resolve(date);
      });
    },
  },
};
</script>

<style lang="scss">
  .tree-list {
    .el-tree-node .el-tree-node__content {
      position: relative;
      &:hover {
        cursor: default;
        .node-item .tree-btns { display: inline-block; }
      }
      .node-item {
        width: 100%;
        user-select: none;
      }
      .node-item .tree-btns {
        position: absolute;
        top: 3px;
        right: 5px;
        display: none;
        font-size: 0;
        background-color: #f5f7fa;
      }
    }
  }
</style>
