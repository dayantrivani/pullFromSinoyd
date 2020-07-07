<template>
  <div>
    <!-- 自动扣分 -->
    <a-table
      class="mar-t-table rank-table"
      rowKey="id"
      size="middle"
      :loading='loading'
      :columns='autoAolumns'
      :dataSource='autoItemList'
      :pagination="pagination"
      @change="_change"
    >
      <template slot="operation" slot-scope="text, record">
        <!-- <a @click="onEditClick(record)"><a-icon type="zoom-in"/>详情</a> -->
        <a-button type="primary" @click="onEditClick(record)" title="详情">
          <a-icon type="snippets" theme="filled"></a-icon>
        </a-button>
      </template>
    </a-table>
    <detail-table ref="DetailTable"/>
  </div>
</template>

<script>
import { getAuto } from '@/api/modules/maintain-company/maintain-rank-detail.js';
// import { queryTest } from '@/mixins';
import { analyzeResp, message } from '@/libs/util';
import DetailTable from './detail-table';

export default {
  name: 'AutoTable',
  // mixins: [queryTest],
  components: {
    DetailTable,
  },
  props: {
    year: {
      require: true,
      type: [Number, String],
    },
    // companyId: {
    //   require: true,
    //   type: [Number, String],
    // },
    corpId: {
      require: true,
      type: [Number, String],
    },
    index: {
      require: true,
      type: [Number, String],
    },
  },
  data() {
    return {
      list: [],
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      pagination: {
        total: 0,
        current: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '15', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: false,
        showTotal: total => `共${total}条`,
      },
      // 自动得分列
      autoAolumns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${(this.queryForm.page - 1) * this.queryForm.rows + index + 1}`,
        },
        {
          title: '点位名称',
          dataIndex: 'portName',
          key: 'portName',
        },
        {
          title: '所扣分值',
          dataIndex: 'minusPoints',
          key: 'minusPoints',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          scopedSlots: { customRender: 'operation' },
          width: 200,
          align: 'center',
        },
      ],
      autoItemList: [],   // 自动得分数据
      queryForm: {
        // ids: '',
        year: '',
        index: '',
        page: 1,
        rows: 10,
      },
    };
  },
  methods: {
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      // this.getItemList();
      this.getAutoList();
    },
    // 详情点击事件
    onEditClick(row) {
      const params = {
        portId: row.portId,
        portMn: row.portMn,
        index: this.index,
        year: this.year,
        // companyId: this.companyId,
        corpId: this.corpId,
      };
      this.$refs.DetailTable.openDialog(params);
      this.$refs.DetailTable.title = row.portName;
    },
    getData() {
      // this.queryForm.ids = list.join(',');
      this.queryForm.year = this.year;
      this.queryForm.index = this.index;
      this.getAutoList();
    },
    // 获取自动得分数据
    getAutoList() {
      this.loading.spinning = true;
      getAuto(this.queryForm, this.corpId).then((response) => {
        if (response.data.success && response.data.code === 200) {
          this.autoItemList = response.data.data;
          if (this.autoItemList) {
            this.autoItemList.forEach((el, index) => {
              this.$set(el, 'id', (this.queryForm.page - 1) * this.queryForm.rows + index);
            });
          }
          this.pagination.total = response.data.total;
        } else {
          message('warning', response);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.loading.spinning = false;
      });
    },
    emptyQueryForm() {
      this.queryForm = {
        // ids: '',
        year: '',
        index: '',
        page: 1,
        rows: 10,
      };
      this.pagination.current = 1;
    },
  },
};
</script>

<style lang="scss">
.rank-table{
  .ant-table-content{
    min-height: 516px;
    .ant-empty{
      min-height: 420px!important;
      line-height: 420px!important;
    }
    .ant-table-tbody > tr > td,th{
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding: 12px 8px!important;
      .ant-btn{
        height: 22px;
        padding: 0 5px;
      }
    }
  }
}
</style>

<style lang="scss" scoped>

</style>
