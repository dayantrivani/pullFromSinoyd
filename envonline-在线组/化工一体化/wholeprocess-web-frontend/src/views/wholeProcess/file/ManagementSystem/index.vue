<template>
  <el-row :gutter="5" v-resize v-if="isRouterCheck">
    <el-col :span="5">
      <el-card class="title-card">
        <div slot="header">
          <span class="text-primary font-bold" style="line-height: 25px;">安全{{params.title}}目录</span>
        </div>
        <div class="mod-tree-list">
          <el-scrollbar class="fill-h" :native="false" :noresize="false">
            <el-tree
              ref="tree"
              v-loading="treeLoading"
              highlight-current
              style="height: '100%'"
              :expand-on-click-node="false"
              :default-expanded-keys="['']"
              :default-expand-all="false"
              :props="propsMerge"
              :data="treeList"
              :render-content="renderContent"
              node-key="id"
              :load="onLoadChildren"
              lazy
              @node-click="onClickNode">
            </el-tree>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-row style="height: 100%;">
        <el-col class="mar-b-sm fill-h">
          <file-management ref="fileManagement" title="文件管理"></file-management>
        </el-col>
      </el-row>
    </el-col>
    <dialog-modal
      type="title"
      ref="dialog"
      size="mini"
      maxScrollbar
      :title="`${isAdd ? '新增': '编辑'}${params.title}`"
      @close="closeDialog">
      <el-form ref="form"
        :rules="formRules"
        label-width="90px"
        :model="itemModel"
        class="mar-t-xs pad-x-sm item-space el-box"
      >
        <el-form-item label="目录名称：" prop="name" hint-down>
          <el-input
            v-model="itemModel.name"
            clearable
            placeholder="目录名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序号：">
          <!-- 正数 -->
          <el-input-number
            v-model="itemModel.orderNum"
            placeholder="排序号"
            :min="0"
            :max="2147483647"
            style="width: 100%;"
            controls-position="right"
          >
          </el-input-number>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            v-model="itemModel.remark"
            :autosize="{ minRows: 2 }"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="itemModel.status">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="停用" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary"
          icon="fas fa-save"
          :loading="saveLoading"
          @click="onSaveCheck()"
        >
          保 存
        </el-button>
        <el-button icon="fas fa-times"  @click="closeDialog">关 闭</el-button>
      </div>
    </dialog-modal>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import FileManagement from './components/FileManagement';
import { saveItem } from '@/global/libs/mixins';
import { analyzeResp } from '@/global/libs/util';

export default {
  name: 'ManagementSystem',
  components: { FileManagement },
  mixins: [saveItem],
  data() {
    return {
      isRouterCheck: true, // 切换路由刷新组件
      params: {
        title: '',
        type: '',
      },
      btnLevel: 1, // 按钮显示在那一层（新增按钮）
      btnNode: 'add edit remove',
      treeLoading: false,
      treeList: [],
      // 新增/编辑 排口弹窗
      saveLoading: false, // 保存按钮loading
      targetNode: {}, // 新增，编辑，删除正在操作的目标节点
      url: 'wholeprocess/folder',
      isAdd: true, // 是否新增弹窗
      itemModel: {
        status: 1,
      },
      formRules: {
        name: [
          { required: true, message: '请输入目录名称', trigger: ['blur', 'change'] },
        ],
      },
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 树形控件配置项参数合并
    propsMerge() {
      const propsTemp = Object.assign({
        parent: 'parentId',
        value: 'id',
        label: 'name',
        children: 'children',
        disabled: 'disabled', // 是否禁用
        isLeaf: 'isLeaf',     // 是否为叶子节点
      }, this.props);
      return propsTemp;
    },
    route() { return this.$route; },
  },
  watch: {
    route: {
      handler(val) {
        this.reload();
        this.params = { ...val.meta };
      },
      immediate: true,
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    reload() { // 切换路由刷新当前实例
      this.isRouterCheck = false;
      this.$nextTick(() => {
        this.isRouterCheck = true;
      });
    },
    onLoadChildren(node, resolve) { // 懒加载子节点数据
      if (node.level === 0) {
        resolve([{
          name: `${this.params.title}目录`,
          id: '',
          level: 0,
        }]);
      } else {
        this.$http.get('wholeprocess/folder', {
          params: {
            parentId: node.data.id,
            code: this.params.type,
            orgId: this.orgGuid, // 后续需要根据企业区分再加
          },
        }).then((response) => {
          resolve([...response.data.data]);
        }, (response) => {
          analyzeResp(response);
        });
      }
    },
    // 单击节点事件
    onClickNode(node) {
      const id = node.id || node.rowGuid;
      this.$refs.fileManagement.setConfigId({
        addDisabled: false,
        id,
      });
    },
    onClickBtn(node, store, event, type) {
      if (event && event.stopPropagation) {
        // 因此它支持W3C的stopPropagation()方法
        event.stopPropagation();
      } else {
        // 否则，我们需要使用IE的方式来取消事件冒泡
        window.event.cancelBubble = true;
      }
      this.targetNode = node || {};
      // 点击新增树节点
      if (type.includes('add')) {
        // 点击新增树节点
        this.isAdd = true;
        this.itemModel.parentId = node.data.id;
        this.itemModel.orgId = this.orgGuid || node.data.orgId;
        this.itemModel.code = this.params.type || node.data.code;
        this.itemModel.status = 1;
        this.$refs.dialog.openDialog();
      } else if (type.includes('edit')) {
        // 点击编辑树节点
        this.isAdd = false;
        this.itemModel = { ...node.data };
        this.$refs.dialog.openDialog();
      } else if (type.includes('remove')) {
        this.deleteTreeNode(node.data.id);
      }
    },
    onSaveCheck() {                         // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem((response) => {
          if (this.isAdd) {
            this.$refs.tree.append(response, this.targetNode);
          } else {
            this.targetNode.data = response || {};
          }
          this.closeDialog();
        });
      });
    },
    closeDialog() {
      this.itemModel = { status: 1 };
      this.$refs.dialog.closeDialog();
    },
    deleteTreeNode(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('wholeprocess/folder', { data: [id] })
      )).then((response) => {
        if (response.data.code === 200) {
          this.$refs.tree.remove(this.targetNode);
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, () => {});
    },
    // 图标类名规则
    getIconClass(node) {
      let icon = '';
      if (node.level === 1) {
        icon = 'fas fa-th-list text-success';
      } else if (node.level === 2) {
        icon = 'fab fa-windows text-success';
      } else if (node.level === 3) {
        icon = 'fas fa-project-diagram text-warning';
      } else if (node.level === 4) {
        icon = 'fas fa-tint text-primary';
      }
      return icon;
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      const level = ['string', 'number'].includes(typeof this.btnLevel)
        ? [this.btnLevel - 0, 10]
        : this.btnLevel;
      const showBtns = node.level > level[0];
      const showBtn = v => this.btnNode.includes(v);
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
              v-show={node.level >= 2}
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
