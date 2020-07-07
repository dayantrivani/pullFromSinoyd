<!-- 分页查询
<pager-query :pager=[分页对象] @query=[列表查询方法] />
-->

<template>
  <div class="mod-paging-query fn-clear">
    <el-pagination
      small
      class="fn-right"
      layout="total, sizes, prev, pager, next, jumper"
      background
      :pager-count="7"
      :total="pager[props.total]"
      :current-page.sync="pager[props.page]"
      :page-size="pager[props.rows]"
      :page-sizes="[10, 15, 30, 50]"
      @size-change="onChangeSize"
      @current-change="onChangePage">
    </el-pagination>
    <span v-if="refreshTime" class="btn-refresh fn-right" title="刷新" @click="onResetCountDown()">
      <i class="el-icon-time"></i>
      <span>{{ formatTime(countDown) }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'PagingQuery',
  // 设置绑定参数
  model: {
    prop: 'pager',
    event: 'setPager',
  },
  props: {
    pager: {
      type: Object,
      required: true,
    },
    refreshTime: {
      type: Number,
    },
    props: {
      type: Object,
      required: false,
      default: () => ({
        page: 'page',   // 第几页
        rows: 'rows',   // 显示条数
        total: 'count', // 总记录条数
      }),
    },
  },
  computed: {
    total() {
      return this.pager[this.props.total] || 0;
    },
    // 检测获取到的数据是否为空
    isEmptyList() {
      return Math.ceil(this.pager[this.props.total] / this.pager[this.props.rows]) < this.pager[this.props.page];
    },
  },
  data() {
    return {
      countDown: this.refreshTime,
      timer: () => {},
    };
  },
  watch: {
    total() {
      // 存在记录但未获取到数据时, 重新请求
      if (this.pager[this.props.page] > 1 && this.isEmptyList) {
        this.$emit('setPager', Object.assign(this.pager, {
          [this.props.page]: this.pager[this.props.page] - 1,
        }));
        this.$emit('query');
      }
    },
    countDown() {
      return this.countDown === 0 && this.onResetCountDown();
    },
  },
  created() {
    if (this.refreshTime) {
      this.timer = setInterval(() => this.countDown > 0 && this.countDown--, 1000);
    }
  },
  methods: {
    // 每页条数
    onChangeSize(rows) {
      const temp = {
        [this.props.rows]: rows,
        // 当显示条数小于或等于总条数时，重置页数
        [this.props.page]: rows <= this.total ? 1 : this.pager[this.props.page],
      };

      this.$emit('setPager', Object.assign(this.pager, temp));
      // 触发父组件查询请求
      this.$emit('query');
    },
    // 翻页
    onChangePage(page) {
      this.$emit('setPager', Object.assign(this.pager, { [this.props.page]: page }));
      this.$emit('query');
    },
    // 重置计时
    onResetCountDown() {
      this.$emit('setPager', Object.assign(this.pager, { [this.props.page]: 1 }));
      this.$emit('query');
      if (this.refreshTime) {
        this.countDown = this.refreshTime;
        clearInterval(this.timer);
        this.timer = setInterval(() => this.countDown > 0 && this.countDown--, 1000);
      }
    },
    formatTime(t) {
      const s = t % 60;
      return ` ${Math.floor(t / 60)} : ${s < 10 ? `0${s}` : s}`;
    },
  },
};
</script>
