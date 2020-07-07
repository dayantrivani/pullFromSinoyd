export default {
  data() {
    return {
      selectedIndexs: [],
    };
  },
  methods: {
    rowClassName({ rowIndex }) {
      const className = 'selected-row';
      return this.selectedIndexs.includes(rowIndex) ? className : '';
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
      this.selectedIndexs = all;
    },
    // 表格索引衔接
    index(index) {
      return (this.pager.page - 1) * this.pager.rows + index + 1;
    },
  },
};
