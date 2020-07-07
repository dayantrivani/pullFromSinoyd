export default {
  data() {
    return {
      itemList: [],       // 数据列表
      selected: [],       // 已选择的数据对象
      pager: {            // 分页
        page: 1,
        rows: 15,
        count: 0,
      },
    };
  },
  computed: {
    selectedIds() {
      return this.selected.map(v => v.id);
    },
    selectedIndexs() {
      const indexs = [];
      this.itemList.forEach((v, i) => {
        if (this.selectedIds.includes(v.id)) { indexs.push(i); }
      });
      return indexs;
    },
  },
  methods: {
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
    // 当选择项发生变化时会触发该事件
    select(selection) {
      this.selected = selection;
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    selectAll(selection) {
      this.selected = selection;
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
    selectionChange(selection) {
      this.selected = selection;
    },
    // 行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className
    rowClassName({ rowIndex }) {
      return this.selectedIndexs.includes(rowIndex) ? 'is-selected' : '';
    },
  },
};
