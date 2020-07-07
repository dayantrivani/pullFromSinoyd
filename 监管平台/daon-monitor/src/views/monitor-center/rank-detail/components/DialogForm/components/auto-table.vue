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
      :pagination="false"
    >
    <template slot="operation" slot-scope="text, record">
      <a @click="onEditClick(record)"><a-icon type="zoom-in"/>详情</a>
    </template>
    </a-table>
    <detail-table ref="DetailTable"/>
  </div>
</template>

<script>
import { getAuto } from '@/api/modules/rank-detail.js';
import { analyzeResp, message } from '@/libs/util';
import DetailTable from './detail-table';

export default {
  name: 'AutoTable',
  components: {
    DetailTable,
  },
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
      // 自动得分列
      autoAolumns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 50,
          customRender: (text, record, index) => `${index + 1}`,
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
    };
  },
  methods: {
    // 详情点击事件
    onEditClick(row) {
      const params = {
        portId: row.portId,
        portMn: row.portMn,
        index: this.index,
        year: this.year,
        companyId: this.companyId,
      };
      this.$refs.DetailTable.openDialog(params);
      this.$refs.DetailTable.title = row.portName;
    },
    // 获取自动得分数据
    getAutoList(list) {
      this.loading.spinning = true;
      getAuto(list).then((response) => {
        if (response.data.success && response.data.code === 200) {
          this.autoItemList = response.data.data;
          if (this.autoItemList) {
            this.autoItemList.forEach((el, index) => {
              this.$set(el, 'id', index);
            });
          }
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
