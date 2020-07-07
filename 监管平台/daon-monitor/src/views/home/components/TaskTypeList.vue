<!-- 超标任务列表 -->
<template>
  <div class="ExceTasks">
    <span class="title">
      <img src="@/assets/img/renwu.png"/>
      超期任务列表
      <a-form class="form_class" layout="inline">
        <a-form-item>
          <a-select
            :allow-clear="true"
            style="width: 200px"
            placeholder="任务类型"
            v-model="priority">
            <a-select-option
              v-for="item in maskData"
              :key="item.id"
              :value="item.id">
              {{item.name}}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item class="mar-r-0">
          <a-button type="primary" icon="search" @click="onQueryList">查 询</a-button>
        </a-form-item>
      </a-form>
    </span>
    <a-config-provider>
      <template v-if="!itemList.length" #renderEmpty>
        <div style="text-align: center">
          <img src="@/assets/img/no_data.gif"/>
        </div>
      </template>
      <a-table
        id="exce_table"
        class="exce_table"
        rowKey="id"
        size="middle"
        :columns='columns'
        :scroll="{ y: 405 }"
        :dataSource='itemList'
        :pagination="false"
      >
        <template slot="name" slot-scope="text">
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
        <template slot="companyName" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="finishedAt" slot-scope="text">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template slot="statusText" slot-scope="text">
          <a-tag :color="text === '已完成' ? '#52c41a' : '#108ee9'">{{text}}</a-tag>
        </template>
      </a-table>
    </a-config-provider>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getMaskList } from '@/api/modules/home.js';

export default {
  name: 'TaskTypeList',
  data() {
    return {
      priority: undefined,
      maskData: [
        {
          id: 1,
          name: '故障',
        },
        {
          id: 0,
          name: '非故障',
        },
      ],
      page: 1,
      itemList: [],
      scrolled: [], // 记录已经请求过的位置
      columns: [
        {
          title: '任务名称',
          dataIndex: 'name',
          key: 'name',
          width: 180,
          align: 'left',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '站点名称',
          dataIndex: 'stationName',
          key: 'stationName',
          align: 'left',
          width: 180,
          scopedSlots: { customRender: 'stationName' },
        },
        {
          title: '企业名称',
          dataIndex: 'companyName',
          key: 'companyName',
          width: 180,
          align: 'left',
          scopedSlots: { customRender: 'companyName' },
        },
        {
          title: '完成日期',
          dataIndex: 'finishedAt',
          key: 'finishedAt',
          // width: 100,
          align: 'left',
          scopedSlots: { customRender: 'finishedAt' },
        },
        {
          title: '任务状态',
          dataIndex: 'statusText',
          key: 'statusText',
          width: 120,
          align: 'left',
          scopedSlots: { customRender: 'statusText' },
        },
      ],
    };
  },
  computed: {
    ...mapState('home', ['homeParams']),
  },
  watch: {
    homeParams: {
      handler() {
        this.onQueryList();
      },
      deep: true,
      immediate: true,
    },
    $route(to, form) {
      // 离开当前页面时取消滚动事件  返回时重新绑定
      if (form.name === 'home') {
        window.removeEventListener('scroll', this.handleScroll, true);
      } else if (to.name === 'home' && this.homeParams.companyName) {
        window.addEventListener('scroll', this.handleScroll, true);
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
  methods: {
    // 滚动事件
    handleScroll() {
      // eslint-disable-next-line
      let scrollTop = document.getElementById('exce_table').getElementsByClassName('ant-table-body')[0].scrollTop;
      this.scrollTop = scrollTop;
      if ((this.scrollTop - 55) % 460 === 0 && !this.scrolled.includes(this.scrollTop)) {
        this.scrolled.push(this.scrollTop);
        this.page += 1;
        const params = { ...this.homeParams };
        params.priority = this.priority !== undefined ? Boolean(this.priority) : '';
        params.page = this.page;
        getMaskList(params).then((res) => {
          this.itemList = [...this.itemList, ...res.data.data];
        });
      }
      // console.log(scrollTop);
    },
    onQueryList() {
      const params = { ...this.homeParams };
      this.scrolled = [];
      this.page = 1;
      params.priority = this.priority !== undefined ? Boolean(this.priority) : '';
      params.rows = 10;
      getMaskList(params).then((res) => {
        if (res.data.code === 200 && res.data.success) {
          this.itemList = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss">
.exce_table{
  display: inline-block;
  width: 100%;
  height: calc(100% - 50px);
  margin-top: 50px;
  td{
    min-width: 80px;
    max-width: 140px!important;
  }
  .ant-spin-nested-loading, .ant-spin-container, .ant-table, .ant-table-content{
    height: 100%;
  }
  .ant-table-placeholder{
    height: calc(100% - 46px);
  }
  .ant-empty-normal{
    margin: 150px 0;
  }
  .ant-table-content{
    min-height: 455px!important;
    .ant-table-scroll{
      height: 100%;
    }
    >.ant-empty{
      height: 100%;
      >.ant-empty-image{
        margin-top: 25%;
        display: inline-block;
      }
    }
  }
  .ant-empty-description{
    height: calc(100% - 40px);
  }
}
</style>

<style lang="scss" scoped>
.ExceTasks{
  height: 100%;
  background: #fff;
  >.title{
    position: absolute;
    top: 0;
    left: 0;
    font-weight: 600;
    color: #409eff;
    z-index: 1000;
    height: 50px;
    width: 100%;
    line-height: 50px;
    padding-left: 20px;
    border-bottom: 1px solid #f7f3f3;
    >img{
      color: #409eff;
      width: 20px;
      margin-right: 5px;
    }
  }
  .form_class{
    display: inline-block;
    position: absolute;
    right: 10px;
    bottom: 0;
  }
}
</style>
