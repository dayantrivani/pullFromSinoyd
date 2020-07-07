<template>
  <container class="Page-MaintainManagement">

    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>

      <!-- 操作按钮 -->
      <template v-slot:default>
        <div class="mar-t-xs">
          <a-button type="primary" icon="plus" @click="onAddClick" class="mar-l-0"> 新 增</a-button>
          <a-button type="danger" icon="delete" :disabled="!selectedRowKeys.length" @click="onRemoveClick"> 删 除</a-button>
          <a-divider type="vertical" />
          <a-upload
            class="upload-file"
            name="file"
            :beforeUpload="beforeUpload"
            :customRequest="upload"
            :showUploadList="false"
          >
            <a-button type="primary" icon="download">导 入</a-button>
          </a-upload>
          <a-button type="primary" icon="upload" @click="onExport">导 出</a-button>
        </div>
      </template>

      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item class="mar-r-0">
            <a-input-search
              allowClear
              ref="input"
              v-model="queryForm.name"
              @search="onQueryList"
              style="width: 240px" placeholder="请输入运维单位名称">
              <a-button slot="enterButton" title="查询">
                <a-icon type="search"></a-icon>
              </a-button>
            </a-input-search>
          </a-form-item>
        </a-form>
      </template>
    </search-extend>
    <a-card :bordered="false">
      <!-- 列表 -->
      <a-table
        class="mar-t-table"
        rowKey="id"
        size="middle"
        :loading='loading'
        :columns='columns'
        :dataSource='itemList'
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination="pagination"
        @change="_change"
      >
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="onEditClick(record)" title="编辑">
            <a-icon type="edit" theme="filled"></a-icon>
          </a-button>
        </template>
      </a-table>
      <DialogForm ref="dialog" @refreshList="getItemList"></DialogForm>
    </a-card>
  </container>
</template>

<script>
import DialogForm from './components/DialogForm';
import { queryTest } from '@/mixins';
import {
  emptyQuery, getList, remove, exportFile, uploadFile,
} from '@/api/modules/maintain-company/maintain-management.js';

export default {
  name: 'MaintainManagement',
  mixins: [queryTest],
  components: { DialogForm },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      queryForm: emptyQuery(),
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
          title: '运维单位名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '社会信用代码',
          dataIndex: 'uscc',
          key: 'uscc',
        },
        {
          title: '联系人',
          dataIndex: 'contactName',
          key: 'contactName',
        },
        {
          title: '电话',
          dataIndex: 'contactPhone',
          key: 'contactPhone',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 100,
          align: 'center',
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
      getList,
      selectedRowKeys: [],
    };
  },
  methods: {
    // 文件上传前
    beforeUpload(file) {
      this.formatData = new FormData();
      this.formatData.append('file', file);
    },
    // 上传事件
    upload() {
      uploadFile(this.formatData).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          this.getItemList();
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 导出事件
    onExport() {
      exportFile().then((response) => {
        this.downloadFn(response, '运维单位管理.xls');
      });
    },
    /* eslint-disable */
    downloadFn(res, name) {
      if (res.headers.success) {
        // IE 浏览器：a标签的download属性不支持IE，使用微软自带的 msSaveBlob 方法
        // 其他浏览器：创建a标签 ，添加download属性，模拟鼠标点击事件
        const blob = new Blob([res.data], { type: res.headers['content-type'] });
        // const filename = res.headers['content-disposition'].split(';')[1].replace('filename=', '');
        if (window.navigator.msSaveBlob) {   // 兼容ie
          try {
            window.navigator.msSaveBlob(blob, name);
          } catch (e) {
            return e;
          }
        } else {
          const a = document.createElement('a');
          a.style.display = 'none';
          a.download = name;
          a.href = window.URL.createObjectURL(blob);
          document.body.appendChild(a);
          a.click();
        }
      } else {
        this.$message.error('当前文件不存在，请联系管理员');
      }
    },
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    // 删除事件
    onRemoveClick() {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前选中的记录吗？',
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
    // 新增事件
    onAddClick() {
      this.$refs.dialog.openDialog();
    },
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
    // 编辑事件
    onEditClick(row) {
      this.$refs.dialog.openDialog(row);
    },
  },
  created() {
    this.getItemList();
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
};
</script>

<style>

</style>
