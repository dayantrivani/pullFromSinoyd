<!-- 待办事项 -->
<template>
  <el-card fill shadow="hover" :body-style="{ padding: 0 }">
    <template slot="header">
      <div class="el-card__title">
        <icon name="todo" color="#B486F1" scale="1.3" />
        <span class="pad-l-sm">待办事项</span>
      </div>
    </template>
    <scrollbar>
      <el-row>
        <el-col
          v-for="item in statusList"
          style="height: 50%"
          :key="item.title"
          :sm="{ span: 12 }"
          :md="{ span: 6 }"
        >
          <div
            class="card-status"
            :style="{ 'background-color': item.bgColor }"
            @click.stop="$emit('to', item.moduleCode)"
          >
            <span class="value">
              <icon v-if="item.loading" name="el-icon-loading" />
              <count-to v-else-if="item.authorized" autoplay :duration="2500" :end-val="item.count" />
              <template v-else>--</template>
            </span>
            <p class="label">{{ item.label }}</p>
            <icon :name="item.icon" size="2.5em" y="35px" />
          </div>
        </el-col>
      </el-row>
    </scrollbar>
  </el-card>
</template>

<script>
import { mapState } from 'vuex';

import CountTo from '@/components/CountTo';
import { getOmStatistics } from '../request';

// 触发间隔（默认 5 分钟）
const interval = 5 * 60 * 1000;

const emptyList = () => ([
  {
    label: '项目登记',
    moduleCode: 'ProjectRegister',
    icon: 'icon-xiangmudengji',
    bgColor: '#FAC657',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '项目审核',
    moduleCode: 'ProjectAudit',
    icon: 'icon-xiangmushenhe',
    bgColor: '#F96799',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '采样准备',
    moduleCode: 'PrepareSample',
    icon: 'icon-caiyangzhunbei',
    bgColor: '#51D3C7',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '委托现场送样',
    moduleCode: 'LocalSendSample',
    icon: 'icon-weituoxianchangsongyang',
    bgColor: '#5DA5F1',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '现场任务',
    moduleCode: 'LocalTask',
    icon: 'icon-xianchangrenwu',
    bgColor: '#7D89E3',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '样品交接',
    moduleCode: 'SampleReceive',
    icon: 'icon-yangpinjiaojie',
    bgColor: '#B486F1',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '样品分配',
    moduleCode: 'SampleAssign',
    icon: 'icon-yangpinfenpei',
    bgColor: '#5CADF9',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '实验室分析',
    moduleCode: 'AnalyseDataManage',
    icon: 'icon-shiyanshifenxi',
    bgColor: '#61D976',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '报告编制',
    moduleCode: 'ReportEdit',
    icon: 'icon-baogaobianzhi',
    bgColor: '#FAC657',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '报告审核/签发',
    moduleCode: 'ReportAudit',
    icon: 'icon-baogaoshenheqianfa',
    bgColor: '#FA7C7D',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '任务办结',
    moduleCode: 'ProjectEnd',
    icon: 'icon-renwubanjie',
    bgColor: '#51D3C9',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '费用管理',
    moduleCode: 'CostInfoManage',
    icon: 'icon-feiyongguanli',
    bgColor: '#5DA5F9',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '质控任务登记',
    moduleCode: 'QCRegister',
    icon: 'icon-xiangmudengji',
    bgColor: '#7D89E3',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '数据汇总',
    moduleCode: 'QCSumData',
    icon: 'icon-shujuhuizong',
    bgColor: '#B486F1',
    authorized: false,
    loading: false,
    count: 0,
  },
  {
    label: '评价结果',
    moduleCode: 'QCEvaluation',
    icon: 'icon-pingjiajieguo',
    bgColor: '#5DA5F9',
    authorized: false,
    loading: false,
    count: 0,
  },

]);

export default {
  components: {
    CountTo,
  },
  inheritAttrs: false,
  data() {
    return {
      timer: null,
      statusList: emptyList(),
    };
  },
  computed: {
    ...mapState('auth', ['userMenu']),
  },
  watch: {
    userMenu: {
      handler(val) {
        const { /* icon, */ label, children } = this.$config.navbar;
        const business = (val || []).find(v => v[label] === '检测业务管理') || {};
        const quality = (val || []).find(v => v[label] === '质控管理') || {};
        const navList = [...(business[children] || []), ...(quality[children] || [])];
        if (navList && navList.length) {
          this.statusList.forEach((item, index) => {
            const nav = navList.find(v => v[label] === item.label);
            this.statusList[index].authorized = !!nav;
          });
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.setTimer(true);
    // 组件销毁时，清除定时
    this.$once('hook:beforeDestroy', () => { this.setTimer(false); });
  },
  activated() {
    this.setTimer(true);
  },
  deactivated() {
    this.setTimer(false);
  },
  methods: {
    // 设置定时器
    setTimer(status) {
      if (!status) {
        clearInterval(this.timer);
        return;
      }
      this.timer = setInterval(() => {
        this.getCount();
      }, interval);
      this.getCount(); // 设置定时器时即时触发一次
    },
    // 设置加载状态
    setLoading(indexs, status) {
      indexs.forEach((index) => {
        this.statusList[index].loading = status;
      });
    },
    // 获取统计数量
    getCount() {
      const indexs = this.statusList.map((v, i) => (v.authorized ? i : false)).filter(v => v !== false);
      const requests = this.statusList.filter(v => v.authorized !== false).map(({ moduleCode }) => {
        const code = moduleCode.replace(moduleCode[0], moduleCode[0].toLowerCase());
        return getOmStatistics(code);
      });
      this.setLoading(indexs, true);
      Promise.all(requests)
        .then((responses) => {
          responses.forEach(({ data }, i) => {
            if (data.success) {
              this.statusList[indexs[i]].count = data.data;
            }
          });
        })
        .finally(() => {
          this.setLoading(indexs, false);
        });
    },
  },
};
</script>

<style lang="scss">
.card-status {
  position: relative;
  padding: 10px 70px 10px 10px;
  height: 94px;
  color: $-color-white;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  text-align: center;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.4);
  }
  > .value {
    font-size: 2.5em;
    line-height: 50px;
    height: 50px;
  }
  > .label {
    position: absolute;
    bottom: 20px;
    width: 100%;
    padding-right: 70px;
    line-height: 30px;
    white-space: nowrap;
  }
  > i.icon-svg {
    position: absolute;
    right: 20px;
  }
}
</style>
