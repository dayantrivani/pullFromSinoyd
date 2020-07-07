<template>
  <!--  @tab-click="handleClick" -->
  <el-tabs v-model="activeName" class="YD-nest" @tab-click="onTabClick" v-loading="loading">

    <!-- 通用规则 -->
    <el-tab-pane label="通用规则" name="common">
      <pane-common-rules ref="common" :alarmType="alarmType"
        :onOff="!!itemList.length" :systemTypeList="systemType"
      />
    </el-tab-pane>

    <!-- 个性化排口 -->
    <el-tab-pane v-for="item in systemType" :key="item.dictCode"
      :label="item.dictName" :name="`${item.dictCode}`"
    >
      <pane-waste :waste="item" :ref="`${item.dictCode}`" :feild="item"
        :alarmType="alarmType" :onOff="!!itemList.length" :systemTypeList="systemType"
      />
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import PaneCommonRules from './PaneCommonRules';
import PaneWaste from './PaneWaste';
import { queryList } from '@/global/libs/mixins';

export default {
  components: {
    PaneCommonRules,
    PaneWaste,
  },
  mixins: [queryList],
  props: {
    alarmType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      url: 'alarm/alarmRuleParams',
      isAuto: false,
      itemList: [],
      isServerError: true,
      activeName: 'common',
      // 系统类型: 废水、废气、固废、噪声
      systemType: [],
    };
  },
  created() {
    this.$store.dispatch('dict/GET_SYSTEM_TYPE').then((val) => {
      this.systemType = val;
    });
  },
  methods: {
    onPaneQuery() {
      // 1. 数据重置
      this.isServerError = true;
      this.itemList = [];
      // 2. 请求接口
      this.getItemList();
      this.$refs.common.onPaneQuery();
    },
    // 获取xx报警参数列表数据
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, alarmTypeId: this.alarmType.id },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          if (typeof this.get_success_callback === 'function'
            && this.get_success_callback) this.get_success_callback(response);
        }
      }, () => {
        this.$message.warning({
          message: '服务器错误,请刷新页面重试..',
          duration: 3000,
          showClose: true,
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    onTabClick(val) {
      if (val.name === 'common') {
        this.$refs[val.name].onPaneQuery();
      } else {
        this.$refs[val.name][0].onPaneQuery();
      }
    },

    /** 请求接口回调(勿删) */
    get_success_callback() {
      this.isServerError = false;
    },
  },
};
</script>
