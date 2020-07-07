<template>
  <container class="Page-RoleManagement">

    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <a-row :gutter="10">
      <a-col :span="4">
        <a-card :bordered="false" title="角色组" class="role-group">
          <a-menu mode="inline" :defaultSelectedKeys="[1]" style="width:100%" @click="selectGroup">
            <a-menu-item v-for="item in roleGroups" :key="item.key" >{{item.title}}</a-menu-item>
          </a-menu>
        </a-card>
      </a-col>
      <a-col :span="20">
        <a-card :bordered="false" title="角色管理">
          <search-extend>
            <!-- 操作按钮 -->
            <template v-slot:default>
              <div class="mar-t-xs">
                <a-button type="primary" icon="plus" @click="onAddClick">添加角色</a-button>
                <a-button
                  type="danger"
                  icon="delete"
                  :disabled="!selectedRowKeys.length || selectedRowKeys.includes(3) || selectedRowKeys.includes(8)"
                  @click="onRemoveClick">删除</a-button>
                <span style="margin-left:20px;color:#aaaeb8">
                  <a-icon type="exclamation-circle" theme="filled"></a-icon>
                  <span style="margin-left:5px">说明：管理员和默认角色不可以操作（删除、编辑）。</span>
                </span>
              </div>
            </template>
          </search-extend>
          <!-- 列表 -->
          <a-table
            rowKey="id"
            size="middle"
            :loading='loading'
            :columns='columns'
            :dataSource='itemList'
            :rowSelection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
              getCheckboxProps: record => ({ props: { disabled: record.disabled } }),
            }"
            :pagination="false"
          >
            <template slot="operation" slot-scope="text, record">
              <!-- <a @click="onEditClick(record)"><a-icon type="edit"></a-icon>编辑</a> -->
              <a-button :class="{'noallow-class' : record.disabled}" type="primary"
                :disabled="record.disabled" @click="onEditClick(record)" title="编辑">
                <a-icon type="edit" theme="filled"></a-icon>
              </a-button>
              <a-button type="primary" @click="onConfigAuthority(record)" title="权限">
                <a-icon type="idcard"></a-icon>
              </a-button>
              <!-- <a @click="onConfigAuthority(record)" style="margin-left:10px;"><a-icon type="idcard"></a-icon>权限</a> -->
              <!-- <a @click="onConfigUser(record)" style="margin-left:10px;"><icon name="user"></icon>用户</a> -->
              <a-button type="primary" @click="onConfigUser(record)" title="用户">
                <a-icon type="user"></a-icon>
              </a-button>
            </template>
          </a-table>
          <DialogForm ref="dialogForm" @refreshList="getItemList"></DialogForm>
          <DialogAuthority ref="dialogAuthority" @refreshList="getItemList"></DialogAuthority>
          <DialogUser ref="dialogUser"></DialogUser>
          <DialogUsers ref="dialogUsers"></DialogUsers>
        </a-card>
      </a-col>
    </a-row>
  </container>
</template>

<script>
import { queryTest } from '@/mixins';
import { emptyQuery, getList, remove } from '@/api/modules/role-management.js';
import DialogForm from './components/DialogForm';
import DialogAuthority from './components/DialogAuthority';
import DialogUser from './components/DialogUser';
import DialogUsers from './components/DialogUsers';

export default {
  name: '',
  mixins: [queryTest],
  components: {
    DialogForm,
    DialogAuthority,
    DialogUser,
    DialogUsers,
  },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '角色名称',
          dataIndex: 'roleName',
          key: 'roleName',
          width: 300,
        },
        {
          title: '角色编号',
          dataIndex: 'roleCode',
          key: 'roleCode',
          width: 300,
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'operation' },
        },
      ],
      itemList: [],
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
      },
      roleGroups: [
        {
          title: '默认角色组',
          key: 1,
        },
        {
          title: '监管角色组',
          key: 2,
        },
      ],
      getList,
      defaultSelectedKeys: [1],
      selectedRowKeys: [],
      queryForm: emptyQuery(),
    };
  },
  methods: {
    // onSelect(record, selected) {
    //   if (record.id === 3 || record.id === 8) {
    //     selected = false;
    //     this.selectedRowKeys.pop();
    //   }
    // },
    selectGroup(selected) {
      const roleGroup = selected.key;
      this.queryForm.roleGroup = roleGroup;
      // this.$refs.dialogForm.itemModel.roleGroup = roleGroup;
      this.$refs.dialogForm.selectedGroup = roleGroup;
      this.getItemList();
    },
    // 编辑事件
    onEditClick(row) {
      this.$refs.dialogForm.openDialog(row);
    },
    // 配置权限事件
    onConfigAuthority(row) {
      this.$refs.dialogAuthority.openDialog(row);
    },
    // 配置用户事件
    onConfigUser(row) {
      // this.$refs.dialogUser.openDialog(row);
      this.$refs.dialogUsers.openDialog(row);
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 角色新增事件
    onAddClick() {
      this.$refs.dialogForm.openDialog();
    },
    // 角色移除事件
    onRemoveClick() {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前选中的角色吗？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          remove(this.selectedRowKeys).then((response) => {
            if (response.data.code === 200) {
              this.$message.success('删除成功', 3);
            } else {
              this.$message.warning(response.data.message || response.data.msg, 3);
            }
            this.selectedRowKeys = [];
            this.getItemList();
          });
        },
      });
    },
  },
  created() {
    this.getItemList();
  },
};
</script>
<style lang="scss">
.Page-RoleManagement{
  .ant-card{
    .ant-card-head{
      .ant-card-head-title{
        font-weight: bold;
        color: #409eff;
      }
    }
    .ant-card-body{
      min-height: 610px;
    }
  }
  .ant-card.role-group{
    .ant-card-body{
      // min-height: 566px;
      min-height: 610px;
      padding: 5px 0 0 0;
      .ant-menu-inline{
        border: none;
      }
    }
  }
  .ant-tree{
    min-height: 566px;
  }
  .ant-table{
  // margin-top: 5px !important;
  .ant-table-content{
    min-height: 520px;
    .ant-table-placeholder{
      padding: 0;
      border-bottom: none;
      .ant-empty{
        min-height: 427px;
        line-height: 427px;
        margin: 0;
      }
    }
    .ant-table-tbody > tr > td,th{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      .ant-btn{
        height: 22px;
        padding: 0 5px;
      }
    }
  }
}
}
</style>
<style lang="scss" scoped>
.noallow-class{
  color: #B9B9BC;
  cursor: not-allowed;
}
</style>
