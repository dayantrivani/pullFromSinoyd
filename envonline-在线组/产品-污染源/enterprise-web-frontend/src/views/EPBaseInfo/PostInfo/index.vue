<template>
  <el-row :gutter="$config.space" v-resize>
    <el-col :span="5">
      <el-card type="title">
        <div slot="header">
          <span>部门</span>
        </div>
        <div class="mod-tree-list">
          <el-scrollbar class="fill-h" :native="false" :noresize="false">
            <el-tree ref="tree" v-loading="treeLoading" highlight-current style="height: '100%'"
              :expand-on-click-node="false" :default-expand-all="true" :props="propsMerge" :data="treeList"
              :render-content="renderContent" @node-click="onClickNode">
            </el-tree>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-card type="title">
        <div slot="header">
          <span>岗位列表</span>
        </div>
        <div class="mar-l-sm mar-y-xs">
          <el-button type="danger" icon="fas fa-trash-alt" @click="onDeleteItem(callback)">删 除
          </el-button>
        </div>
        <div class="fill-h">
          <el-table border highlight-current-row :height="`calc(100% - 71px)`" v-loading="loading" :data="itemList"
            @selection-change="onChangeSelected">
            <el-table-column align="center" type="selection" width="37"></el-table-column>
            <el-table-column align="center" label="No." width="50" type="index" :index="index"></el-table-column>
            <el-table-column align="center" label="操作" width="67">
              <template slot-scope="scope">
                <el-button type="primary" icon="fas fa-pencil-alt" @click="onClickEdit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
            <el-table-column property="postName" label="岗位名称" min-width="160" show-overflow-tooltip></el-table-column>
            <el-table-column property="postCode" label="岗位编码" min-width="160" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="parentName" label="上级岗位" min-width="90" show-overflow-tooltip></el-table-column>
            <el-table-column property="orgName" label="所属机构" min-width="160" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="isEnabled" label="状态" min-width="120" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="sortNum" label="排序" min-width="90" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-col>
    <dialog-form ref="postDialog" @query="getTreeList" />
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex';
import { analyzeResp } from '@/global/libs/util';
import dialogForm from './components/dialog';
import { queryListEnt, deleteItem } from '@/global/libs/mixins';

export default {
  name: 'PostInfo',
  mixins: [                   // 混合
    queryListEnt,
    deleteItem,
  ],
  data() {
    return {
      treeLoading: false,
      treeList: [],
      itemList: [],
      queryForm: {
        pageNo: 1,
        pageSize: 15,
        orgGuid: this.orgGuid,
        postName: '',
      },
      isAuto: false,
      deleteUrl: 'sinoyd-frame/sys/posts',
    };
  },
  computed: {
    ...mapGetters('auth', ['userType', 'orgGuid']),
    // 树形控件配置项参数合并
    propsMerge() {
      const propsTemp = Object.assign({
        parent: 'parentId',
        value: 'id',
        label: 'label',
        children: 'children',
        disabled: 'disabled', // 是否禁用
        isLeaf: 'isLeaf',     // 是否为叶子节点
      }, this.props);
      return propsTemp;
    },
  },
  components: {
    dialogForm,               // 新增编辑弹窗
  },
  created() {
    this.getTreeList();
    this.getPostList();
  },
  methods: {
    getTreeList() {
      this.treeLoading = true;
      this.$http.get('sinoyd-frame/sys/users/superadmin/permission/orgs/tree').then((response) => {
        if (response.data.success) {
          this.$nextTick(() => {
            this.treeList = response.data.data[0].children.filter(val => val.id === this.$store.state.auth.user.orgGuid);
          });
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
        this.treeLoading = false;
      });
    },
    getPostList() {
      this.loading = true;
      this.$http.get('sinoyd-frame/sys/posts/list', { params: { ...this.queryForm } }).then((response) => {
        if (response.data.success) {
          this.$nextTick(() => {
            this.itemList = response.data.data;
          });
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
      });
    },
    onClickNode(node) {
      this.queryForm.orgGuid = node.id;
      this.getPostList();
    },
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.rowGuid);
    },
    // 节点渲染函数
    renderContent(h, { node }) {
      return (
        <div class="node-item">
          <span class="el-tree__icon">
            <i class="far fa-address-card text-success" />
            <span title={node.label}>{node.label}</span>
          </span>
          <span class="tree-btns">
            <el-button
              v-show={node.data.id !== 0}
              type='primary'
              title='新增'
              icon="fas fa-plus"
              onClick={() => this.onClickBtn(node)}>
            </el-button>
          </span>
        </div>
      );
    },
    onClickBtn(node) {
      this.$refs.postDialog.openDialog('add', node);
    },
    onClickEdit(row) {
      this.$refs.postDialog.openDialog('edit', row);
    },
    callback() {
      this.getPostList();
    },
  },
};
</script>
