<template>
  <a-modal
    class="DetailTable"
    width="740px"
    :title="title"
    :visible="isVisible"
    :maskClosable="false"
    :centered="true"
    :footer="false"
    @cancel="closeDialog"
  >
    <a-table
      class="mar-t-table"
      rowKey="id"
      size="middle"
      :loading='loading'
      :columns='columns'
      :pagination="false"
      :dataSource='itemList'
    >
      <template slot="remark" slot-scope="record">
        <span>{{record.join(',')}}</span>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { getScoringDetails } from '@/api/modules/rank-detail.js';

export default {
  name: 'DetailTable',
  data() {
    return {
      title: '123213',
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
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: '明细',
          dataIndex: 'ruleName',
          key: 'ruleName',
        },
        {
          title: '扣分',
          dataIndex: 'minusPoints',
          key: 'minusPoints',
        },
        {
          title: '扣分明细',
          dataIndex: 'remark',
          key: 'remark',
          scopedSlots: { customRender: 'remark' },
        },
      ],
      itemList: [],
    };
  },
  methods: {
    openDialog(params) {
      this.isVisible = true;
      this.loading.spinning = true;
      getScoringDetails(params).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.loading.spinning = false;
          this.itemList = res.data.data;
        }
      });
    },
    closeDialog() {
      this.isVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
