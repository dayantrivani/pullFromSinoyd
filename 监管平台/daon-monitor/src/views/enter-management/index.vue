<!-- Page: 企业管理 -->
<template>
  <container class="Page-EnterManagement">
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>
      <!-- 操作按钮 -->
      <template v-slot:default>
        <div class="mar-t-xs">
          <a-button type="primary" icon="plus" @click="onAddClick" class="mar-l-0">新 增</a-button>
          <a-button
            type="danger"
            icon="delete"
            :disabled="!selectedRowKeys.length"
            @click="onRemoveClick"
          >删 除</a-button>
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
          <a-upload
            class="upload-file"
            name="file"
            :beforeUpload="beforeUpload"
            :customRequest="uploadStation"
            :showUploadList="false"
          >
            <a-button type="primary" icon="download">导入站点</a-button>
          </a-upload>
          <a-upload
            class="upload-file"
            name="file"
            :beforeUpload="beforeUpload"
            :customRequest="uploadInstru"
            :showUploadList="false"
          >
            <a-button type="primary" icon="download">导入仪器</a-button>
          </a-upload>
          <a-dropdown placement="bottomLeft">
            <a-button>
              模板上传
              <a-icon type="down" />
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item v-for="item in templeteData" :key="item.type">
                <a-upload
                  class="upload-file"
                  name="file"
                  :beforeUpload="beforeUpload"
                  :customRequest="uploadTemp"
                  :showUploadList="false"
                  accept=".xls, .xlsx, .doc, .docx"
                >
                  <span @click="type = item.type" style="width: 100%;height: 100%">{{item.name}}</span>
                </a-upload>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-dropdown placement="bottomLeft">
            <a-button>
              模板下载
              <a-icon type="down" />
            </a-button>
            <a-menu slot="overlay">
              <a-menu-item v-for="item in templeteData" :key="item.type">
                <span @click="downTemp(item.type)" style="width: 100%;height: 100%">{{item.name}}</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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
              style="width: 270px"
              placeholder="企业名称、社会信用代码"
            >
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
        :loading="loading"
        :columns="columns"
        :dataSource="itemList"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :pagination="pagination"
        @change="_change"
      >
        <template slot="nameSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <!-- <template slot="address" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>-->
        <template slot="isVital" slot-scope="text">
          <status :type="text ? 'success' : 'danger'">
            <template>{{text ? '是' : '否'}}</template>
          </status>
        </template>
        <template slot="isOperationSlot" slot-scope="text">
          <status :type="text ? 'success' : 'danger'">
            <template>{{text ? '是' : '否'}}</template>
          </status>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="onEditClick(record)" title="编辑">
            <a-icon type="edit" theme="filled"></a-icon>
          </a-button>
          <a-button type="primary" @click="onPointClick(record)" title="点位信息">
            <a-icon type="environment" theme="filled"></a-icon>
          </a-button>
        </template>
      </a-table>
      <DialogForm ref="dialog" @refreshList="getItemList"></DialogForm>
      <pointDailog ref="pointDailog"></pointDailog>
    </a-card>
  </container>
</template>

<script>
import DialogForm from './components/DialogForm';
import pointDailog from './components/pointDailog';
import {
  emptyQuery, getCompanyList, exportFile, uploadFile, remove, uploadStation, uploadInstru, uploadTemplate, downTemplate,
} from '@/api/modules/enter-management.js';
import { queryTest } from '@/mixins';

export default {
  name: 'EnterManagement',
  mixins: [queryTest],
  components: { DialogForm, pointDailog },
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      // 上传模板数据
      templeteData: [
        {
          type: 8,
          name: '企业模板',
        },
        {
          type: 6,
          name: '站点模板',
        },
        {
          type: 7,
          name: '仪器模板',
        },
      ],
      itemList: [],
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
          title: '企业名称',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          scopedSlots: { customRender: 'nameSlot' },
        },
        {
          title: '社会信用代码',
          dataIndex: 'creditCode',
          key: 'creditCode',
          width: 180,
        },
        {
          title: '联系人',
          dataIndex: 'contactName',
          key: 'contactName',
          width: 100,
        },
        {
          title: '电话',
          dataIndex: 'contactPhone',
          key: 'contactPhone',
          width: 120,
        },
        // {
        //   title: '区域',
        //   dataIndex: 'districtName',
        //   width: 100,
        //   key: 'districtName',
        // },
        // {
        //   title: '地址',
        //   dataIndex: 'address',
        //   key: 'address',
        //   scopedSlots: { customRender: 'address' },
        // },
        {
          title: '是否重点污染源',
          dataIndex: 'isVital',
          key: 'isVital',
          width: 120,
          scopedSlots: { customRender: 'isVital' },
        },
        {
          title: '是否聘用专业运维公司',
          dataIndex: 'isOperation',
          key: 'isOperation',
          width: 170,
          scopedSlots: { customRender: 'isOperationSlot' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: 100,
          align: 'center',
          scopedSlots: { customRender: 'operation' },
        },
      ],
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: total => `共${total}条`,
      },
      selectedRowKeys: [],
      queryForm: emptyQuery(),
      getList: getCompanyList,
      formatData: {},
      type: 0,
    };
  },
  methods: {
    // 上传模板
    uploadTemp() {
      uploadTemplate(this.type, this.formatData).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          // this.getItemList();
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 模板下载
    downTemp(type) {
      downTemplate(type).then((response) => {
        if (response.data.code === 500) {
          this.$message.warning(response.data.msg, 1.5);
          return;
        }
        const a = response.headers['content-disposition'].split('.');
        const typeName = a[a.length - 1];
        const name = `${this.templeteData.filter(val => val.type === type)[0].name}.${typeName}`;
        this.downloadFn(response, name);
      });
    },
    // 文件上传前
    beforeUpload(file) {
      this.formatData = new FormData();
      this.formatData.append('file', file);
    },
    // 上传企业事件
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
    // 导入站点事件
    uploadStation() {
      uploadStation(this.formatData).then((response) => {
        if (response.data.code === 200 && response.data.success) {
          this.$message.success(response.data.msg, 1.5);
          this.getItemList();
        } else {
          this.$message.warning(response.data.msg, 1.5);
        }
      });
    },
    // 导入仪器事件
    uploadInstru() {
      uploadInstru(this.formatData).then((response) => {
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
        this.downloadFn(response, '企业管理.xls');
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
    // 新增事件
    onAddClick() {
      this.$refs.dialog.openDialog();
    },
    // 删除事件
    onRemoveClick() {
      this.$confirm({
        title: '提示',
        content: '你确定要删除当前选中的企业吗？',
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
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    // 编辑事件
    onEditClick(row) {
      this.$refs.dialog.openDialog(row);
    },
    // 打开点位信息
    onPointClick(row) {
      this.$refs.pointDailog.openDialog(row);
    },
  },
  created() {
    this.getItemList();
  },
};
</script>
<style lang="scss" scoped>
.page-EnterManagement {
  .ant-tag {
    height: 21px;
  }
  .ant-form {
    .ant-form-item {
      margin-right: 10px;
    }
  }
}
</style>
