<!-- 基础配置管理 / 检测类型 -->

<template>
  <container fill class="fn-flex">
    <el-card header="检测类型" fill class="flex-1" shadow="never" :body-style="{ padding: 0 }">
      <el-row v-loading="loading" class="fill-h">
        <el-col class="fill-h" :span="8">
          <list
            header="行业类型"
            ref="panel-0"
            :data="industryTypeList"
            @row-click="(row) => getChildList({ level: 0, ...row })"
          />
        </el-col>
        <el-col class="fill-h" :span="8">
          <list
            header="检测大类"
            ref="panel-1"
            show-icon
            show-child-count
            style="border-left: none"
            :data="sampleBigTypeList"
            @row-click="(row) => getChildList({ level: 1, ...row })"
          >
            <template slot="more">
              <el-button icon="el-icon-plus" class="pad-a-xs" title="新增检测大类"></el-button>
            </template>
          </list>
        </el-col>
        <el-col class="fill-h" :span="8">
          <list
            header="检测小类"
            ref="panel-2"
            style="border-left: none"
            :data="sampleTypeList"
            @row-click="(row) => getChildList({ level: 2, ...row })"
          >
            <template slot="more">
              <el-button icon="el-icon-plus" class="pad-a-xs" title="新增检测小类"></el-button>
            </template>
          </list>
        </el-col>
      </el-row>
    </el-card>
    <el-card
      header="参数"
      class="mar-l-scope"
      shadow="never"
      style="width: 400px"
    >
      <FormNode ref="formNode" @query="getItemList()" />
    </el-card>
  </container>
</template>

<script>
import FormNode from './components/FormNode';

import { getIndustryTypeTree } from './request';

export default {
  name: 'SampleType',
  components: {
    FormNode,
  },
  data() {
    return {
      loading: false,
      itemList: [],
      industryTypeList: [],   // 行业类型
      sampleBigTypeList: [],  // 检测大类
      sampleTypeList: [],     // 检测小类
    };
  },
  mounted() {
    this.getItemList();
  },
  methods: {
    getItemList() {
      this.loading = true;
      getIndustryTypeTree()
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            this.industryTypeList = data;
            this.itemList = this.$tools.flatten(data);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getChildList(row) {
      const { data, level } = row;
      if (level !== 2) {
        if (level) {
          this.sampleTypeList = this.itemList.filter(v => v.parentId === data.id);
        } else {
          this.sampleBigTypeList = this.itemList.filter(v => v.parentId === data.id);
          this.sampleTypeList = [];
        }
        this.$nextTick(() => {
          this.$refs[`panel-${level + 1}`].setCurrentRow();
        });
      }
      this.$nextTick(() => {
        this.$refs.formNode.init(row);
      });
    },
  },
};
</script>
