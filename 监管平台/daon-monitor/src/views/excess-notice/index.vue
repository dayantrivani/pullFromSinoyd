<template>
<!-- 超标通告单 -->
  <container class="ExcessNotice">
    <!-- 页头 -->
    <template v-slot:header>
      <!-- <page-header breadcrumb /> -->
    </template>

    <search-extend>

      <!-- 检索表单 -->
      <template v-slot:right>
        <a-form layout="inline">
          <a-form-item>
            <a-input
              ref="input"
              :allowClear="true"
              v-model="queryForm.partnerName"
              style="width: 150px" placeholder="请输入企业名称">
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-date-picker
              style="width: 150px;"
              v-model="queryForm.queryDate"
              format="YYYY-MM-DD"
              :allowClear="true"/>
          </a-form-item>
          <a-form-item class="mar-r-0">
            <a-button type="plain" @click="onQueryList">
              <a-icon type="search">查询</a-icon>
            </a-button>
          </a-form-item>
        </a-form>
      </template>
    </search-extend>
    <a-card :bordered="false">

      <!-- 列表 -->
      <a-table
        class="mar-t-table"
        rowKey="alarmId"
        size="middle"
        :loading='loading'
        :columns='columns'
        :dataSource='itemList'
        :pagination="pagination"
        @change="_change"
      >
        <template slot="partnerNametSlot" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="stationName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="alarmedAt" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text.slice(0, 10) }}</span>
            </template>
            <span>{{ text.slice(0, 10) }}</span>
          </a-tooltip>
        </template>
        <template slot="factorNameList" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text.join(',') }}</span>
            </template>
            <span>{{ text.join(',') }}</span>
          </a-tooltip>
        </template>
        <template slot="operation" slot-scope="text, record">
          <!-- <a @click="onExport(record)">导出</a> -->
          <a-button type="primary" @click="onExport(record)" title="导出">
            <a-icon type="upload"></a-icon>
          </a-button>
        </template>
      </a-table>
    </a-card>
  </container>
</template>

<script>
// import moment from 'moment';
import { emptyQuery, getList, getExport } from '@/api/modules/excess-notice.js';
import { queryTest } from '@/mixins';

export default {
  name: 'excess-notice',
  mixins: [queryTest],
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },
      queryForm: emptyQuery(),
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
          dataIndex: 'partnerName',
          key: 'partnerName',
          width: 280,
          scopedSlots: { customRender: 'partnerNametSlot' },
        },
        {
          title: '测点名称',
          dataIndex: 'stationName',
          key: 'stationName',
          width: 280,
          scopedSlots: { customRender: 'stationName' },
        },
        {
          title: '时间',
          dataIndex: 'alarmedAt',
          key: 'alarmedAt',
          // width: 120,
          scopedSlots: { customRender: 'alarmedAt' },
        },
        {
          title: '因子',
          dataIndex: 'factorNameList',
          key: 'factorNameList',
          scopedSlots: { customRender: 'factorNameList' },
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
      getList,
    };
  },
  created() {
    this.getItemList();
  },
  methods: {
    // 详情点击事件
    onExport(row) {
      // console.log(row);
      getExport(row.alarmId).then((res) => {
        this.downloadFn(res, '超标通知单.xls');
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
    // 页码改变，参数改变后页码及每页条数
    _change(current) {
      this.queryForm.page = current.current;
      this.pagination.current = current.current;
      this.queryForm.rows = current.pageSize;
      this.getItemList();
    },
    // 查询事件
    onQueryList() {
      this.queryForm.page = 1;
      this.pagination.current = this.queryForm.page;
      this.getItemList();
    },
  },
};
</script>

<style lang="scss">
  .timeS{
    margin-right: 30px!important;
    >.ant-form-item-control-wrapper{
      width: 43%;
    }
  }
</style>

<style lang="scss" scoped>

</style>
