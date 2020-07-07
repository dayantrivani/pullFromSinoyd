<template>
  <!-- 角色排口配置 -->
  <el-row :gutter="5" class="fill-h">
    <el-col style="width: 200px">
      <el-card class="title-card dialog-scoller">
        <template slot="header">
          <span class="el-card__title">组织架构</span>
        </template>
        <el-tree
          ref="roleTree"
          :props="{ label: 'orgName', isLeaf:'isLeaf' }"
          :data="treeList"
          lazy
          :load="onLoad"
          highlight-current
          :render-after-expand="false"
          :expand-on-click-node="false"
          :default-expand-all="false"
          :render-content="renderContent"
          @node-click="onClickNode">
        </el-tree>
      </el-card>
    </el-col>
    <el-col style="width: calc(100% - 200px);">
      <el-tabs type="border-card" fill>
        <el-tab-pane label="排口配置" lazy>
          <el-form inline :model="queryForms" class="query-form-box mar-t-xs">
            <el-form-item label="行政区域：">
              <select-tree
                lazy
                filterable
                joint
                root-key="0"
                v-model="queryForms.regionCodeId"
                :props="{ label: 'areaName' }"
                url="sys/area"
              ></select-tree>
            </el-form-item>
            <el-form-item label="关注程度：">
              <el-select placeholder="关注程度" v-model="queryForms.attentionDegree">
                <el-option label="全部" :value="-1"></el-option>
                <el-option
                  v-for="(item, key) in $enum.AttentionDegreeList"
                  :key="key"
                  :label="item"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="排口类型：">
              <el-select placeholder="排口类型" v-model="queryForms.portType" clearable>
                <el-option v-for="(item, key) in $enum.PortTypeList" :key="key" :label="item" :value="key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input
                v-model="queryForms.key"
                style="width: 290px"
                placeholder="排口名称、MN号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="fas fa-search"
                @click="onQueryList"
                :disabled="orgId === ''">查 询</el-button>
            </el-form-item>
          </el-form>
          <hr>
          <div class="mar-l-sm mar-y-xs">
            <el-button
              type="primary"
              icon="fas fa-cog"
              :disabled="orgId ? false : true"
              @click="$refs.dialog.openDialog(queryForms.roleId)">
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
            height="calc(100% - 120px)"
            :data="itemList"
            highlight-current-row
            :row-class-name="_rowClassName"
            @selection-change="onSaveSelected">
            <el-table-column align="center" type="selection" width="36"></el-table-column>
            <el-table-column align="center" label="No." type="index" width="50"></el-table-column>
            <el-table-column property="regionName" label="行政区域" min-width="60" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="psName" label="企业名称" min-width="140" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="portName" label="排口名称" min-width="160" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="attentionDegreeName" label="关注程度" min-width="60" show-overflow-tooltip>
            </el-table-column>
            <el-table-column property="dgiMn" label="MN" min-width="180" show-overflow-tooltip></el-table-column>
            <el-table-column property="portTypeName" label="排口类型" min-width="60" show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <paging-query :pager="pager" @query="getItemList"/>
          <!-- 排口配置弹窗 -->
          <tab-pan-dialog ref="dialog" @query="onQueryList"></tab-pan-dialog>
        </el-tab-pane>
        <el-tab-pane label="排口权限" lazy :disabled="orgId === ''">
          <role-tab-pan :orgId="orgId" ref="roleTabPan"></role-tab-pan>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
// import SelectTreeLazy from '@/components/widgets/SelectTreeLazy';
import RoleTabPan from './components/RoleTabPan';
import TabPanDialog from './components/TabPanDialog';

export default {
  name: 'RolePorts',
  components: { RoleTabPan, TabPanDialog },
  data() {
    return {
      loading: false,                 // 界面加载
      treeList: [],
      selectedIds: [],
      queryForms: {
        regionCodeId: '',
        attentionDegree: '',
        portType: '',
        key: '',
        roleId: '',
      },
      orgId: '', // /组织架构id/角色id
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
      itemList: [],
    };
  },
  created() {
    this.getTreeList();
  },
  methods: {
    // 页面基本方法
    index(index) { // 表格索引衔接
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    _rowClassName({ row }) { // 勾选样式修改
      const className = 'selected-row';
      return this.selectedIds.includes(row.portId) ? className : '';
    },
    onSaveSelected(selection) { // 保存选中项 id
      this.selectedIds = selection.map(val => val.portId);
    },
    onClickNode(item, node) { // 单击节点
      if (node.level === 2) {
        this.queryForms.roleId = item.roleGuid;
        this.onQueryList();
        if (this.$refs.roleTabPan) {
          this.$refs.roleTabPan.onQueryList(item.roleGuid);
        }
        this.orgId = `/${item.orgId}/${item.roleGuid}`;
      }
    },
    // 角色与排口
    onQueryList() { // 点击查询
      this.pager.page = 1;
      this.getItemList();
    },
    onDeleteItem() { // 点击删除
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.ROLE_PORT_DELETE(this.selectedIds).then(() => {
          this.onQueryList();
        });
      });
    },
    getItemList() { // 获取角色对应排口
      const { rows, page } = this.pager;
      if (this.queryForms.roleId) {
        this.loading = true;
        this.$http.get('cfg/rolePort', {
          params: {
            page,
            rows,
            ...this.queryForms,
            sort: 'psName+,portName+',
          },
        }).then((response) => {
          if (response.data.success) {
            this.itemList = response.data.data;
            this.pager.count = response.data.count;
          } else {
            this.$message.warning({
              message: response.data.msg,
              duration: 1500,
            });
          }
        }).finally(() => {
          this.loading = false;
        });
      } else {
        this.$message.warning({
          message: '请先选择角色！',
          duration: 1500,
        });
      }
    },
    ROLE_PORT_DELETE(body) { // 删除角色对应点位
      return new Promise((resolve) => {
        this.$http.delete(`cfg/rolePort/${this.queryForms.roleId}`, { data: body }).then((response) => {
          if (response.data.success) {
            resolve(response);
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
        });
      });
    },
    // 角色树菜单
    getTreeList() { // 获取角色列表树菜单
      this.$http.get('sys/org', { params: { orgTypeCodes: 'hb,yw' } }).then((response) => {
        if (response.data.success) {
          this.treeList = response.data.data;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 1500,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    async onLoad(node, resolve) { // 展开树菜单回调请求
      let children = [];
      if (node.level > 0) {
        await this.$http.get('sys/role', { params: { orgGuid: node.data.rowGuid } }).then((response) => {
          if (response.data.success) {
            children = response.data.data.map((val) => {
              this.$set(val, 'orgName', val.roleName);
              this.$set(val, 'orgId', node.data.rowGuid);
              this.$set(val, 'isLeaf', true);
              return val;
            });
          } else {
            this.$message.warning({
              message: '当前组织架构下没有角色！',
              duration: 1500,
            });
          }
        });
      }
      return resolve(children);
    },
    // 节点渲染函数
    renderContent(h, { node, store }) {
      return (
        <div class="node-item" ondblclick={event => this.ondblclick(node, store, event)}>
          <span class="el-tree__icon">
            <i v-show={node.isLeaf} class={`fas fa-${node.level === 1 ? 'folder-open' : 'file'}`} />
            <i
              v-show={!node.isLeaf || node.level === 0}
              class={`fas fa-${node.expanded ? 'folder-open' : 'folder'}`} />
            <span style="user-select: none;">{node.label}</span>
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
.query-form-box {
  padding: 5px 10px 0;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style lang="scss">
.dialog-scoller.el-card {
  >.el-card__body {
    overflow: auto;
  }
}
</style>
