import { analyzeResp } from '@/libs/util';

export default {
  data() {
    return {
      url: '',            // API 接口地址（必填）
      isAuto: true,       // 是否在载入组件时自动获取数据
      loading: false,     // 数据列表加载状态
      queryForm: {},      // 查询表单对象
      itemList: [],       // 数据列表
      selected: [],       // 已选择的数据对象
      selectedIds: [],    // 已选择的数据 id 数组
      selectedIndexs: [], // 已选择的数据的索引
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  created() {
    if (this.isAuto) {
      this.onQueryList();
    }
  },
  watch: {
    itemList() {
      this.selectedIndexs = [];
    },
  },
  methods: {
    // 当选择项发生变化时会触发该事件
    onChangeSelected(option) {
      this.selected = option;
      this.selectedIds = option.map(val => val.id);
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    onChangeCheck(selection, row) {
      const rowindex = this.itemList.findIndex(v => v === row);
      const index = this.selectedIndexs.findIndex(v => v === rowindex);
      if (index !== -1) {
        this.selectedIndexs.splice(index, 1);
      } else {
        this.selectedIndexs.push(rowindex);
      }
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    onChangeCheckAll(selection) {
      const len = selection.length;
      const all = [];
      if (len) {
        for (let i = 0; i < len; i++) { all.push(i); }
      }
      this.selected = selection;
      this.selectedIndexs = all;
    },
    rowClassName({ rowIndex }) {
      const className = 'selected-row';
      return this.selectedIndexs.includes(rowIndex) ? className : '';
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
      this.selectedIndexs = [];  // 触发查询时取消勾选高亮
      const { page, rows } = this.pager;
      this.$http.get(this.url, {
        params: { page, rows, ...this.queryForm },
      }).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemList = response.data.data;
          this.pager.count = response.data.count;
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
