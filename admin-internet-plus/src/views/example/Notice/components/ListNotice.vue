<!-- 应用 / 公告管理 -->

<template>
  <layout-doc :loading="loading">
    <template #doc>
      <el-button
        round
        type="primary"
        icon="el-icon-plus"
        class="fill-w mar-b-scope"
        @click="onDetail({ row: {}, isEdit: true })"
      >内容发布</el-button>
      <el-card shadow="never">
        <el-form label-suffix="：">
          <el-form-item label="开始日期">
            <el-date-picker v-model="queryForm.timeStart" class="fill-w" placeholder="开始日期" />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker v-model="queryForm.timeEnd" placeholder="结束日期" class="fill-w" />
          </el-form-item>
          <el-form-item label="公告类型">
            <enum v-model="queryForm.noticeType" clearable type="NOTICE_CATEGOTY" class="fill-w" />
          </el-form-item>
          <el-form-item label="公告标签">
            <enum v-model="queryForm.noticeLabel" clearable type="NOTICE_LABEL" class="fill-w" />
          </el-form-item>
          <el-form-item label="关键字">
            <el-input v-model="queryForm.key" placeholder="公告标题、公告内容、发布人"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="fill-w" @click="onQueryList()">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </template>
    <div style="min-height: 500px">
      <el-row :gutter="$config.gutter">
        <el-col v-for="item in itemList" :key="item.id" :sm="24" :lg="12">
          <item-notive
            class="mar-b-scope"
            :data="item"
            @detail="onDetail"
            @query="getItemList()"
          />
        </el-col>
      </el-row>
      <div class="text-center">
        <paging :pager="pager" @query="getItemList()" />
      </div>
    </div>
  </layout-doc>
</template>

<script>
import { tablePager } from '@/mixins';

import LayoutDoc from '@/layouts/LayoutDoc';
import ItemNotive from './ItemNotice';

import { emptyQuery, getNoticeList } from '../request';

export default {
  components: {
    LayoutDoc,
    ItemNotive,
  },
  mixins: [tablePager],
  data() {
    return {
      loading: false,
      queryForm: emptyQuery(),
      itemList: [],
      pager: {
        rows: 10,
      },
    };
  },
  created() {
    this.onQueryList();
  },
  methods: {
    onQueryList() {
      this.initPage();
      this.getItemList();
    },
    // 详情
    onDetail(data) {
      this.$emit('detail', data);
    },
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      getNoticeList({ page, rows, ...this.queryForm })
        .then((response) => {
          const {
            success, data, count, msg,
          } = response.data;
          if (success) {
            this.itemList = data || [];
            this.pager.count = count;
          } else {
            this.$message.warning(msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
