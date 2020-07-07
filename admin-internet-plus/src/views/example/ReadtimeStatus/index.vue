<!-- 系统管理 / 数据管理 / 参数设置 -->

<template>
  <container fill>
    <div class="pad-b-sm flex-x-between">
      <div class="operate-btn pad-t-xs">
        <el-tag effect="dark" class="pad-r-xs">联网总数 {{ count.sum }}</el-tag>
        <el-tag effect="dark" type="success" class="mar-l-sm pad-r-xs">在线 {{ count.online }}</el-tag>
        <el-tag effect="dark" type="info" class="mar-l-sm pad-r-xs">离线 {{ count.offline }}</el-tag>
        <span class="inline-block mar-l-md">
          <el-tag effect="plain" type="danger" class="pad-r-xs">国控点位 8</el-tag>
          <el-tag effect="plain" type="warning" class="mar-l-sm pad-r-xs">省控点位 8</el-tag>
          <el-tag effect="plain" class="mar-l-sm pad-r-xs">市控点位 8</el-tag>
          <el-tag effect="plain" type="info" class="mar-l-sm pad-r-xs">其他点位 8</el-tag>
        </span>
      </div>
      <el-form inline label-suffix="：" @submit.native.prevent>
        <el-form-item class="mar-b-0">
          <el-radio-group v-model="queryForm.timeType" @change="onQueryList()">
            <el-radio-button label="五分钟"></el-radio-button>
            <el-radio-button label="一小时"></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="mar-b-0">
          <el-input
            v-model="queryForm.configName"
            clearable
            style="width: 200px"
            prefix-icon="el-icon-location"
            placeholder="请选择测点"
            @keyup.enter.native="getItemList()"
          ></el-input>
        </el-form-item>
        <el-form-item class="mar-b-0">
          <el-input
            v-model="queryForm.configName"
            clearable
            style="width: 200px"
            placeholder="请选择因子"
            @keyup.enter.native="getItemList()"
          >
            <icon slot="prefix" name="factor" />
          </el-input>
          <el-button type="primary" icon="el-icon-search" @click="getItemList()" />
        </el-form-item>
        <el-form-item class="mar-b-0 mar-r-0">
          <el-tooltip>
            <template slot="content">
              <el-row :gutter="10">
                <el-col :span="12">
                  <p class="row-sm i-wrap-no">H 有效数据不足</p>
                  <p class="row-sm i-wrap-no">HSp 超上限</p>
                  <p class="row-sm i-wrap-no">LSp 超下限</p>
                  <p class="row-sm i-wrap-no">Neg 负值异常</p>
                  <p class="row-sm i-wrap-no">BB 连接不良</p>
                  <p class="row-sm i-wrap-no">B 运行不良</p>
                </el-col>
                <el-col :span="12">
                  <p class="row-sm i-wrap-no">W 等待数据恢复</p>
                  <p class="row-sm i-wrap-no">PS 跨度检查</p>
                  <p class="row-sm i-wrap-no">PZ 零点检查</p>
                  <p class="row-sm i-wrap-no">AS 精度检查</p>
                  <p class="row-sm i-wrap-no">CZ 零点校准</p>
                  <p class="row-sm i-wrap-no">CS 跨度校准</p>
                </el-col>
              </el-row>
            </template>
            <span class="inline-block"><icon name="el-icon-info" /> 标记位说明</span>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </div>
    <el-card fill shadow="never" style="height: calc(100% - 43px)" :body-style="{ padding: 0 }">
      <el-table
        ref="table"
        v-loading="loading"
        border
        stripe
        highlight-current-row
        height="100%"
        :data="itemList"
      >
        <el-table-column fixed align="center" label="No." width="50" type="index" />
        <el-table-column fixed show-overflow-tooltip width="180" property="site" label="测点" />
        <el-table-column
          fixed
          align="center"
          width="100"
          property="online"
          filter-placement="bottom-end"
          :filters="[{ text: '在线', value: true }, { text: '离线', value: false }]"
          :filter-method="filterHandler"
        >
          <template #header>
            <span class="inline-block">
              <span>联网状态</span>
              <el-progress
                text-inside
                style="width: 60px"
                status="success"
                :stroke-width="18"
                :percentage="count.percentage"
              />
            </span>
          </template>
          <template v-slot="{ row }">
            <icon scale="1.5" :name="`${row.online ? 'on' : 'off'}-line`" />
          </template>
        </el-table-column>
        <el-table-column fixed filters width="80" label="联网信息">
          <template v-slot="{ row }">
            <span> {{ row.online ? '在线' : '离线' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed sortable width="155" property="time" label="最新数据时间" />
        <el-table-column
          v-for="col in factor"
          align="center"
          min-width="110"
          :key="col.field"
          :property="col.field"
        >
          <template slot="header">
            <p v-html="col.label" class="row-sm"></p>
            <p class="row-sm">（{{ col.unit }}）</p>
          </template>
          <template v-slot="{ row }">
            <el-tooltip placement="top">
              <template slot="content">
                <p class="row-sm">上限：{{ col.limilt || '--' }}</p>
                <p class="row-sm">下限：--</p>
                <p class="row-sm">标记位：--</p>
              </template>
              <span :class="{ 'text-danger': row[col.field] >= col.limilt }">
                {{ row[col.field] }}
                <span v-show="row[col.field] >= col.limilt">({{ col.limiltType }})</span>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </container>
</template>

<script>

import { emptyQuery, getConfigList } from './request';

export default {
  name: 'ReadtimeStatus',
  data() {
    return {
      loading: false,
      itemList: [],
      queryForm: emptyQuery(),
      factor: [],
      radio: ['在线', '离线'],
    };
  },
  computed: {
    count() {
      const sum = this.itemList.length || 0;
      const online = this.itemList.filter(v => v.online).length || 0;
      const offline = sum - online;
      const percentage = parseInt((online / sum) * 100, 10) || 0;
      return {
        sum,
        online,
        offline,
        percentage,
      };
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.getItemList();
    },
    getItemList() {
      this.loading = true;
      getConfigList(this.queryForm)
        .then((response) => {
          const { success, data, msg } = response.data;
          if (success) {
            this.itemList = data.site || [];
            this.factor = data.factor || [];
            this.$nextTick(() => {
              this.$refs.table.doLayout();
              this.$forceUpdate();
            });
          } else {
            this.$message.warning(msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    filterHandler(value, row, column) {
      return row[column.property] === value;
    },
  },
};
</script>
