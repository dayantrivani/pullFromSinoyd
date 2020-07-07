export default {
  data() {
    return {
      // 分页对象
      pager: {
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  methods: {
    // 初始化页数
    initPage() {
      this.pager.page = 1;
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
  },
};
