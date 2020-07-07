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
      :pagination="false"
    >
    </a-table>
  </div>
</template>

<script>
import { getDiy } from '@/api/modules/rank-detail.js';
import { analyzeResp, message } from '@/libs/util';

export default {
  name: 'MattTable',
  props: {
    year: {
      require: true,
      type: [Number, String],
    },
    companyId: {
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
      // 重大事件列
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1}`,
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
    };
  },
  methods: {
    // 获取重大事项数据
    getDiyList(list) {
      this.loading.spinning = true;
      getDiy(list).then((response) => {
        if (response.data.success && response.data.code === 200) {
          this.mattItemList = response.data.data;
        } else {
          message('warning', response);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.loading.spinning = false;
      });
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
