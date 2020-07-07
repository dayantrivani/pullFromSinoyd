export default {
  data() {
    return {
      url: '',          // API 接口地址（必填） 请求地址
      type: 'get',      // 接口请求类型
      isAuto: true,     // 是否在载入组件时自动获取数据
      isUrl: false,     // 是否是动态改变的url
      loading: false,   // 数据列表加载状态
      queryForm: {},    // 查询表单对象
      itemList: [],     // 数据列表
      selectedIds: [],  // 已选择的数据 id 数组
      selectedIndex: [],  // 已选择的数据的索引
      pager: {          // 分页
        page: 1,
        rows: 15,
        total: 0,
      },
    };
  },
  watch: {},
  methods: {
    // 当选择项发生变化时会触发该事件
    changeSelected(option) {
      this.selectedIds = option.map(val => val.id);
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    _select(selection, row) {
      const index = this.itemList.findIndex(v => v === row);
      const hasIndex = this.selectedIndex.findIndex(v => v === index);

      if (hasIndex !== -1) {
        this.selectedIndex.splice(hasIndex, 1);
      } else {
        this.selectedIndex.push(index);
      }
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    _selectAll(selection) {
      const len = selection.length;
      const all = [];
      if (len) {
        for (let i = 0; i < len; i++) { all.push(i); }
      }
      this.selectedIndex = all;
    },
    _rowClassName({ rowIndex }) {
      const className = 'selected-row';
      return this.selectedIndex.includes(rowIndex) ? className : '';
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 初始查询
    onQueryList() {
      this.pager.page = 1;
      this.getItemList();
    },
    // 获取记录列表
    getItemList() {
      this.loading = true;
      const { page, rows } = this.pager;
      // 请求传递的参数
      let data = { params: { page, rows, ...this.queryForm } };
      // 地址
      if (this.isUrl) this.url = this._URL;
      if (this.type === 'post') data = this.queryForm;
      this.$http[this.type](this.url, data).then((response) => {
        if (response.data.success) {
          this.itemList = response.data.rows || response.data.data || response.data;
          this.pager.total = response.data.total || response.data.count;
        } else {
          this.$message({
            type: 'warning',
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
