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
              :expand-on-click-node="false" :default-expand-all="true" :props="propsMerge" :data="itemList"
              :render-content="renderContent" @node-click="onClickNode">
            </el-tree>
          </el-scrollbar>
        </div>
      </el-card>
    </el-col>
    <el-col :span="19">
      <el-card type="title">
        <div slot="header">
          <span>部门信息</span>
        </div>
        <div class="fill-h">
          <el-form :model="dpInfo" label-width="100px" style="margin-top:10px;">
            <el-row>
              <el-col :span="12">
                <el-form-item label="部门名称：">
                  <el-input v-model="dpInfo.deptName"></el-input>
                </el-form-item>
                <el-form-item label="联系电话：">
                  <el-input v-model="dpInfo.telephone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱：">
                  <el-input v-model="dpInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="排序号：">
                  <el-input v-model="dpInfo.sortNum"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门编码：">
                  <el-input v-model="dpInfo.deptCode"></el-input>
                </el-form-item>
                <el-form-item label="分机号码：">
                  <el-input v-model="dpInfo.ext"></el-input>
                </el-form-item>
                <el-form-item label="传真：">
                  <el-input v-model="dpInfo.fax"></el-input>
                </el-form-item>
                <el-form-item label="部门状态：">
                  <el-input v-model="dpInfo.isEnabled"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-form-item label="备注：">
                  <el-input type="textarea" v-model="dpInfo.note"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <dialog-form ref="deptDialog" @query="getTreeList" />
  </el-row>
</template>

<script>
import { analyzeResp } from '@/global/libs/util';
import dialogForm from './components/dialog';

export default {
  name: 'PSDepartment',
  data() {
    return {
      treeLoading: false,
      itemList: [],
      dpInfo: {
        deptName: '',
        deptCode: '',
        parentGuid: '0',
        deptTypeCode: 'wh',
        principal: 'a2aa9c911f404bc984027b7373a6b60c',
        telephone: '',
        ext: '',
        email: '',
        fax: '',
        sortNum: 1000,
        isEnabled: '启用',
        note: '',
        orgGuid: '', // 父id
        parentName: '',
      },
    };
  },
  computed: {
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
  },
  methods: {
    getTreeList() {
      this.treeLoading = true;
      this.$http.get('sinoyd-frame/sys/users/superadmin/permission/departments/tree').then((response) => {
        if (response.data.success) {
          this.$nextTick(() => {
            this.itemList = response.data.data.filter(val => val.id === this.$store.state.auth.user.orgGuid);
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
    // 节点渲染函数
    renderContent(h, { node, store }) {
      return (
        <div class="node-item">
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
              v-show={node.data.dept}
              type='primary'
              title='编辑'
              icon="fas fa-pencil-alt"
              onClick={event => this.onClickBtn(node, store, event, 'edit')}>
            </el-button>
            <el-button
              v-show={node.data.dept}
              type='danger'
              title='删除'
              icon="fas fa-trash-alt"
              onClick={event => this.onClickBtn(node, store, event, 'remove')}>
            </el-button>
          </span>
        </div>
      );
    },
    // 图标类名规则
    getIconClass(node) {
      let icon = '';
      if (node.data.dept) {
        icon = 'far fa-address-book text-warning';
      } else {
        icon = 'far fa-address-card text-success';
      }
      return icon;
    },
    onClickBtn(node, store, event, type) {
      // 点击新增树节点
      if (type.includes('add')) {
        this.$refs.deptDialog.openDialog('add', node);
        // 点击新增树节点
      } else if (type.includes('remove')) {
        this.deleteTreeNode(node.data.id);
      } else if (type.includes('edit')) {
        this.$refs.deptDialog.openDialog('edit', node);
      }
    },
    onClickNode(node) {
      if (node.detail) {
        this.dpInfo = node.detail;
      }
    },
    deleteTreeNode(id) {
      const deleteId = [];
      deleteId.push(id);
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete('sinoyd-frame/sys/departments', { data: deleteId })
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
  },
};
</script>
