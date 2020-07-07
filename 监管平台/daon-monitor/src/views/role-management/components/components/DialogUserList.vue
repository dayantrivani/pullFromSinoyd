<template>
  <a-modal
    class="Page-UserList"
    width="780px"
    :visible="isVisible"
    title="用户信息"
    :footer="null"
    @cancel="closeDialog">
    <div class="mar-t-xs">
      <a-button icon="schedule"
        @click="saveAndContinue"
        style="background-color:#67c23a;color:#fff"
        :disabled="!selectedRowKeys.length">保存并继续</a-button>
      <a-button type="primary" icon="save" @click="saveAndClose" :disabled="!selectedRowKeys.length">保存并关闭</a-button>
    </div>
    <a-table
      rowKey="id"
      size="small"
      :loading='loading'
      :columns='columns'
      :dataSource='itemList'
      :pagination="pagination"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      @change="_change"
    >
    </a-table>
  </a-modal>
</template>

<script>
import {
  userQuery, getAllUsers, saveUser,
} from '@/api/modules/role-management.js';
import { queryTest } from '@/mixins';

export default {
  name: '',
  mixins: [queryTest],
  components: {},
  data() {
    return {
      isVisible: false,
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
          title: '用户名称',
          dataIndex: 'userName',
          key: 'userName',
          width: 120,
          scopedSlots: { customRender: 'nameSlot' },
        },
        {
          title: '中文名称',
          dataIndex: 'name',
          key: 'name',
          width: 120,
        },
        {
          title: '手机号码',
          dataIndex: 'mobile',
          key: 'mobile',
          width: 120,
        },
        {
          title: '邮箱地址',
          dataIndex: 'email',
          key: 'email',
          // width: 150,
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
      queryForm: userQuery(),
      getList: getAllUsers,
      selectedRowKeys: [],
      row: {},
    };
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
    // 保存并继续
    saveAndContinue() {
      saveUser(this.selectedRowKeys, this.row).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          this.getItemList();
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 保存并关闭
    saveAndClose() {
      saveUser(this.selectedRowKeys, this.row).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          this.closeDialog();
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 弹框显示
    openDialog(row) {
      this.row = row;
      this.queryForm.roleId = row.id;
      this.getItemList();
      this.isVisible = true;
    },
    // 弹框隐藏
    closeDialog() {
      this.isVisible = false;
      this.row = {};
      this.$emit('refreshList');
    },
  },
  created() {},
};
</script>
<style lang="scss">
.Page-UserList{
  .ant-modal-content{
    .ant-modal-body{
      padding: 0 12px;
    }
  }
  .ant-table-small{
    margin-top: 5px !important;
    .ant-table-content{
      min-height: 418px;
      .ant-table-body{
        margin: 0;
      }
      .ant-table-placeholder{
        padding: 0;
        border-bottom: none;
        .ant-empty{
          min-height: 380px;
          line-height: 380px;
          margin: 0;
        }
      }
      .ant-table-tbody > tr > td,th{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
</style>
