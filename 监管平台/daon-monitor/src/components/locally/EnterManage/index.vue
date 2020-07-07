<template>
<!-- 企业列表 -->
<div>

  <search-extend>
    <template v-slot:right>
      <a-form layout="inline">
        <a-form-item class="mar-r-0">
          <a-input-search
            v-model="queryForm.name"
            style="width: 240px"
            @search="onQueryList"
            placeholder="请输入企业名称" :allowClear="true">
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
      class="mar-t-table WaterDataQuery"
      size="middle"
      rowKey="id"
      :columns='columns'
      :loading="loading"
      :dataSource='itemList'
      :pagination="pagination"
      @change="_change">
      <template slot="nameSlot" slot-scope="text, record">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span class="p-class" @click="onClick(record)">{{ text }}</span>
        </a-tooltip>
      </template>
      <template slot="address" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span>{{ text }}</span>
        </a-tooltip>
      </template>
      <template slot="stationNameSlot" slot-scope="text">
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ text }}</span>
          </template>
          <span class="p-class">{{ text }}</span>
        </a-tooltip>
      </template>
    </a-table>
  </a-card>
</div>
</template>

<script>
import { getCompany, emptyQueryCompany } from '@/api/modules/water-data-query.js';
import { setSessionStorage } from '@/libs/tools';
import { queryTest } from '@/mixins';

export default {
  name: 'EnterManage',
  components: {},
  mixins: [queryTest],
  data() {
    return {
      isShow: false,
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      spinning: false,
      columns: [
        {
          title: 'No.',
          dataIndex: 'index',
          key: 'index',
          align: 'center',
          width: 55,
          customRender: (text, record, index) => `${index + 1 + (this.queryForm.page - 1) * this.queryForm.rows}`,
        },
        {
          title: '企业名称',
          dataIndex: 'name',
          key: 'name',
          width: 200,
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
        {
          title: '行业',
          dataIndex: 'industryName',
          key: 'industryName',
          width: 200,
          scopedSlots: { customRender: 'industryNameSlot' },
        },
        // {
        //   title: '区域',
        //   dataIndex: 'districtName',
        //   key: 'districtName',
        //   width: 200,
        //   scopedSlots: { customRender: 'districtNameSlot' },
        // },
        {
          title: '地址',
          dataIndex: 'address',
          key: 'address',
          scopedSlots: { customRender: 'address' },
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
      itemList: [],
      getList: getCompany,
      queryForm: emptyQueryCompany(),
    };
  },
  mounted() {
    this.getItemList();
  },
  methods: {
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
    // 企业点击事件
    onClick(item) {
      setSessionStorage('CHOOSECOM', item);
      this.$emit('changeIsShow', {
        isShow: true,
        comName: item.name,
      });
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
  .p-class{
    color: #0F79D8;
    cursor: pointer;
  }
</style>
