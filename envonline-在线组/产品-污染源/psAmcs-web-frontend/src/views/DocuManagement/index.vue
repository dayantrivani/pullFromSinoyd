<template>
  <el-row :gutter="$config.space" v-resize>
    <el-col :span="5">
      <el-card type="title">
        <div slot="header">
          <span>文档管理树</span>
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

    <!-- 右侧列表 -->
    <el-col :span="19">
      <el-row style="height: 100%;">
        <upload-table ref="upload" :uploadInfo="systemItem" />
      </el-row>
    </el-col>


    <!-- 新增树节点 -->
    <dialog-modal
      ref="dialog"
      :title="`${isEdit ? '编辑' : '新增'}节点`"
      size="mini"
      maxScrollbar
      @close="closeDialog"
    >
      <el-form
        ref="form"
        :rules="rules"
        label-width="85px"
        :model="itemModel"
        class="mar-t-xs pad-x-sm item-space el-box">
        <el-form-item label="文件名称：" prop="name" hint-down>
          <el-input v-model="itemModel.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="文件编号：" prop="code">
          <el-input v-model="itemModel.code" clearable></el-input>
        </el-form-item>
        <el-form-item label="文件分类：" prop="classifyCode">
          <el-select v-model="itemModel.classifyCode">
            <el-option
              v-for="(item, index) in $enum.get('CLASSIFY_CODE')"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序号：" prop="orderNum">
          <el-input-number
            style="width: 100%;"
            v-model="itemModel.orderNum"
            :min="0"
            clearable
            controls-position="right">
          </el-input-number>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="itemModel.remark" :autosize="{ minRows: 2 }"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" icon="fas fa-save" v-loading="saveLoading" @click="onSaveCheck">保 存</el-button>
        <el-button icon="fas fa-times" @click="closeDialog">关 闭</el-button>
      </div>
    </dialog-modal>
  </el-row>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import { queryList } from '@/global/libs/mixins';
import UploadTable from '@/components/widget/UploadTable';

export default {
  name: 'DocuManagement',
  components: {
    UploadTable,
  },
  mixins: [queryList],
  data() {
    return {
      folder: true,
      iconLevel: {},              // 指定层级图标的类
      treeLoading: false,         // 树记载状态
      treeList: [],

      /* 树控件 */
      url: 'res/folder',
      isAuto: false,
      queryForm: {                // 文件列表数据请求参数
        rows: 1000000,
        page: 1,
        sort: 'classifyCode+,orderNum',
      },
      systemItem: {},             // 系统类型节点
      itemList: [],               // 树结构请求数据

      /* 新增排口弹窗 */
      itemModel: {
        name: '',
        code: '',
        classifyCode: '',
        orderNum: 0,
        remark: '',
      },
      rules: {
        name: [
          { required: true, message: '请输入文件名称', trigger: ['blur', 'change'] },
        ],
        classifyCode: [
          { required: true, message: '请选择文件类型', trigger: ['blur', 'change'] },
        ],
      },
      saveLoading: false,         // 节点保存按钮
    };
  },
  computed: {
    propsMerge() {                // 树形控件配置项参数合并
      const propsTemp = Object.assign({
        parent: 'parentId',       // 父节点值
        value: 'id',              // 节点值
        label: 'name',            // 节点名称
        children: 'children',     // 子项字段
        disabled: 'disabled',     // 是否禁用
        isLeaf: 'isLeaf',         // 是否为叶子节点
      });
      return propsTemp;
    },
    isEdit() {
      return this.itemModel.id;
    },
  },
  watch: {
    itemList: {
      handler(val) {
        this.treeList = [
          {
            name: '根目录',
            id: '',
            parentId: null,
            children: this.getFlatArr(val),
          },
        ];
      },
      deep: true,
    },
  },
  created() {
    // if () {  有用注释
    //   this.$set(this.queryForm, 'classifyCode', 'PSSharingFiles');
    // }
    this.onQueryList();
  },
  methods: {
    onClickNode(data) {                     // 单击节点事件
      this.systemItem = data;
    },

    /** 接口层 */
    onClickBtn(node, store, event, type) {  // 点击新增或删除树节点
      this.systemItem = node.data;
      if (type.includes('add')) {              // 点击新增树节点
        this.$refs.dialog.openDialog();
      } else if (type.includes('edit')) {      // 点击编辑树节点
        this.$refs.dialog.openDialog();
        this.itemModel = this.getCopyItem(node.data);
      } else if (type.includes('remove')) {    // 点击删除节点
        this.deleteTreeNode(node.data.id);
      }
    },
    onSaveCheck() {                         // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem();
      });
    },
    onSaveItem() {                          // 点击新增或编辑节点
      this.saveLoading = true;
      const { id } = this.itemModel;
      const parentId = id ? this.systemItem.parentId : this.systemItem.id;
      this.$http[id ? 'put' : 'post']('res/folder', { ...this.itemModel, parentId })
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.$refs.dialog.closeDialog();
            this.getItemList();
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
          this.saveLoading = false;
        });
    },
    deleteTreeNode(id) {                    // 点击确认删除节点
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('res/folder', { data: [id] })
      )).then((response) => {
        if (response.status === 200 && response.data.success) {
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
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      });
    },

    /** 特殊方法层 */
    closeDialog() {                         // 关闭对话框
      this.itemModel = this.getEmptyItem();
      this.$refs.dialog.closeDialog();
    },
    getEmptyItem() {                        // 重置表单对象
      return {
        name: '',
        code: '',
        classifyCode: '',
        orderNum: 0,
        remark: '',
      };
    },
    getCopyItem(data) {                     // 拷贝表单对象
      const d = { ...data };
      return {
        id: d.id,
        name: d.name,
        code: d.code,
        classifyCode: d.classifyCode,
        orderNum: d.orderNum,
        remark: d.remark,
      };
    },
    getFlatArr(a) {                         // 扁平化数组转为层级结构
      const newArr = [];
      a.forEach((v) => {
        if (v.parentId === '') {
          newArr.push(v);
        }
        a.forEach((p) => {
          if (v.id === p.parentId) {
            if (!v.children) {
              v.children = [];
            }
            v.children.push(p);
          }
        });
      });
      return newArr;
    },
    getIconClass(node) {                    // 图标类名规则
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
    renderContent(h, { node, store }) {     // 节点渲染函数
      const showBtnsAdd = true;
      let showBtnsEdit = true;
      let showBtnsDete = true;
      if (node.data.code === 'PSSharingFiles' || node.data.code === 'FilingReport') {
        showBtnsDete = false;
        showBtnsEdit = false;
      }
      // if () {  有用注释
      /* 如果是企业端应该隐藏操作按钮， 政府端才需要显示，等权限好了之后再进行完成 */
      // }
      if (node.childNodes.length > 0) { node.isLeaf = false; }  // 叶子节点就是没有孩子节点的节点
      return (
        // <div class="node-item" ondblclick={event => this.onDbClick(node, store, event)}>
        <div class="node-item">
          <span class="el-tree__icon">
            <i class={this.getIconClass(node)} />
            <span title={node.label}>{node.label}</span>
          </span>
          <span class="tree-btns">
            <el-button
              v-show={showBtnsAdd}
              type='primary'
              title='新增'
              icon="fas fa-plus"
              onClick={event => this.onClickBtn(node, store, event, 'add')}>
            </el-button>
            <el-button
              v-show={showBtnsEdit && node.level !== 1}
              type='primary'
              title='编辑'
              icon="fas fa-pencil-alt"
              onClick={event => this.onClickBtn(node, store, event, 'edit')}>
            </el-button>
            <el-button
              v-show={showBtnsDete && node.level !== 1}
              type='danger'
              title='删除'
              icon="fas fa-trash-alt"
              onClick={event => this.onClickBtn(node, store, event, 'remove')}>
            </el-button>
          </span>
        </div>
      );
    },
  },
};
</script>
