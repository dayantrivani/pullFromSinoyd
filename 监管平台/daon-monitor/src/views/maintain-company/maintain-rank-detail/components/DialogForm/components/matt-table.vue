<template>
  <div>
    <!-- 重大事项登记 -->
    <a-table
      class="mar-t-table rank-table"
      rowKey="id"
      size="middle"
      :loading='loading'
      :columns='columns'
      :dataSource='mattItemList'
      :pagination="pagination"
      @change="_change"
    >
    </a-table>
  </div>
</template>

<script>
import { getDiy } from '@/api/modules/maintain-company/maintain-rank-detail.js';
import { analyzeResp, message } from '@/libs/util';

export default {
  name: 'MattTable',
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
      // 重大事件列
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${(this.queryForm.page - 1) * this.queryForm.rows + index + 1}`,
        },
        {
          title: '扣分规则',
          dataIndex: 'ruleName',
          key: 'ruleName',
        },
        {
          title: '所扣分值',
          dataIndex: 'minusPoints',
          key: 'minusPoints',
        },
        {
          title: '登记时间',
          dataIndex: 'updateAt',
          key: 'updateAt',
        },
        {
          title: '登记人',
          dataIndex: 'userName',
          key: 'userName',
          scopedSlots: { customRender: 'userName' },
        },
        {
          title: '说明',
          dataIndex: 'remark',
          key: 'remark',
        },
      ],
      mattItemList: [],   // 重大事项数据
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
      this.getDiyList();
    },
    getData() {
      // this.queryForm.ids = list.join(',');
      this.queryForm.year = this.year;
      this.queryForm.index = this.index;
      this.getDiyList();
    },
    // 获取重大事项数据
    getDiyList() {
      this.loading.spinning = true;
      getDiy(this.queryForm, this.corpId).then((response) => {
        if (response.data.success && response.data.code === 200) {
          this.mattItemList = response.data.data;
          if (this.mattItemList) {
            this.mattItemList.forEach((el, index) => {
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
  .ant-empty{
    min-height: 420px!important;
    line-height: 420px!important;
  }
}
</style>

<style lang="scss" scoped>

</style>
