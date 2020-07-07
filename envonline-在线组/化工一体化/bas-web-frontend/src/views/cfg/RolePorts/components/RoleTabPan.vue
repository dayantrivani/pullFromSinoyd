<template>
  <!-- 排口权限标签页 -->
  <div style="height: calc(100% - 5px)">
    <div class="mar-l-sm mar-y-xs">
      <el-button type="primary" icon="fas fa-cog" :disabled="orgId ? false : true" @click="openDialog">
        配 置
      </el-button>
      <el-button
        type="danger"
        icon="fas fa-trash-alt"
        :disabled="!selectedIds.length"
        @click="onDeleteItem">删 除
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      border
      height="calc(100% - 69px)"
      :data="itemList"
      highlight-current-row
      :row-class-name="_rowClassName"
      @selection-change="changeSelected">
      <el-table-column align="center" type="selection" width="36"></el-table-column>
      <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
      <el-table-column property="userName" label="姓名" min-width="60" show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="性别" min-width="60" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.sex === '1' ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column property="birthDay" label="出生年月" min-width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="email" label="邮箱" min-width="140" show-overflow-tooltip>
      </el-table-column>
      <el-table-column property="telephone" label="联系方式" min-width="180" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <paging-query :pager="pager" @query="getItemList"/>
    <dialog-modal ref="dialog" title="人员配置" class="defealt-dialog">
      <div class="mar-l-sm mar-y-xs">
        <el-button
          type="primary"
          icon="fas fa-save"
          :loading="saveLoading"
          :disabled="!treeIds.length"
          @click="onSaveSelected">保 存</el-button>
      </div>
      <hr/>
      <el-tree
        ref="tree"
        :data="treeData"
        highlight-current
        show-checkbox
        :render-after-expand="false"
        :expand-on-click-node="false"
        :default-expand-all="false"
        :render-content="renderContent"
        @check-change="handleCheckChange">
      </el-tree>
    </dialog-modal>
  </div>
</template>

<script>
export default {
  name: 'RoleTabPan',
  data() {
    return {
      loading: false,
      saveLoading: false,
      url: 'sys/role/user',
      queryForm: {},
      itemList: [],
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      treeData: [],
      selectedIds: [], // 表格中选中项
      treeIds: [], // 树菜单选中人员
      keys: ['orgName', 'userName'],
    };
  },
  props: ['orgId'],
  created() {
    this.onQueryList(this.orgId.split('/')[2]);
  },
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    _rowClassName({ row }) { // 勾选样式修改
      const className = 'selected-row';
      return this.selectedIds.includes(row.rowGuid) ? className : '';
    },
    changeSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.rowGuid);
    },
    handleCheckChange() {
      this.treeIds = this.$refs.tree.getCheckedNodes(true).map(val => val.rowGuid);
    },
    onQueryList(roleGuid) { // 点击查询
      if (roleGuid) {
        this.queryForm.roleGuid = roleGuid;
      }
      this.pager.page = 1;
      this.getItemList();
    },
    openDialog() { // 打开配置弹窗
      this.treeIds = [];
      this.$refs.dialog.openDialog();
      // 请求人员配置列表
      this.$http.get(`sys/user${this.orgId}`).then((response) => {
        if (response.data.success) {
          // this.treeData = response.data.data;
          const map = this.mapTreeList(response.data.data, this.keys);
          this.treeData = this.getTreeList(map);
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      });
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      // 请求传递的参数
      this.$http.get(this.url, { params: { page, rows, ...this.queryForm } }).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    // 保存选中项 id
    onSaveSelected() {
      this.saveLoading = true;
      this.$http.post(`sys/role/${this.queryForm.roleGuid}`, this.treeIds).then((response) => {
        if (response.data.success) {
          this.onQueryList();
          this.$message.success({
            message: response.data.msg,
            duration: 1500,
          });
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.saveLoading = false;
      });
      this.$refs.dialog.closeDialog();
    },
    onDeleteItem() { // 删除角色对应人员
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.loading = true;
        this.$http.delete(`sys/role/${this.queryForm.roleGuid}`, { data: this.selectedIds }).then((response) => {
          if (response.data.success) {
            this.onQueryList();
            this.$message.success({
              message: response.data.msg,
              duration: 1500,
            });
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        }).finally(() => {
          this.loading = false;
        });
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
              this.$set(n, 'label', n.userName);
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

<style lang="scss">
.defealt-dialog {
  >.el-dialog {
    >.el-dialog__body {
      height: calc(70vh - 40px);
    }
  }
}
</style>
