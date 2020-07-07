const mixinOption = {
  key: 'id',              // 唯一字段
  data: 'itemList',       // 数据字段名称
  refTable: 'table',      // 表格 refName 值
  indexHighlight: false,  // 索引高亮模式(适用操作存在同key值的情况下以索引作为依据)
};

export default {
  data() {
    return {
      // 混合配置参数
      mixinOption,
      // 勾选行 row
      selected: [],
    };
  },
  computed: {
    // 勾选行 id
    selectedIds() {
      return this.selected.map(val => val[this.mixinOption.key]);
    },
    // 勾选行 index
    selectedIndexs() {
      if (this.mixinOption.indexHighlight) {
        return this.selected.map(val => val.index);
      }
      const indexsArr = [];
      const data = this[this.mixinOption.data];
      if (data && data.length) {
        data.forEach((item, index) => {
          if (this.selectedIds.includes(item[this.mixinOption.key])) {
            indexsArr.push(index);
          }
        });
      }
      return indexsArr;
    },
    // 是否勾选
    isSelected() {
      return Boolean(!this.selected.length);
    },
  },
  methods: {
    // :row-class-name 行的 className 的回调方法
    // :row-class-name="rowClassName"
    rowClassName({ row, rowIndex }) {
      if (this.mixinOption.indexHighlight) {
        this[this.mixinOption.data][rowIndex].index = rowIndex;
        return this.selectedIndexs.includes(rowIndex) ? 'checkbox-row' : null;
      }
      return this.selectedIds.includes(row[this.mixinOption.key]) ? 'checkbox-row' : null;
    },
    // @select-all 当用户手动勾选全选 Checkbox 时触发的事件
    // @select-all="selectAll"
    selectAll(selection) {
      this.selected = selection;
    },
    // @selection-change 当选择项发生变化时会触发该事件
    // @selection-change="selectionChange"
    selectionChange(selection) {
      this.selected = selection;
    },
    // 初始化勾选（清空勾选）
    initSelected() {
      this.selected = [];
    },
    // 切换行的选中状态（用于多选表格）
    toggleRowSelection(rows, status = null, refName = this.mixinOption.refTable) {
      const rowsType = Object.prototype.toString.call(rows).slice(8, -1).toLowerCase();
      this.$nextTick(() => {
        this.$refs[refName].clearSelection();
        if (rowsType === 'array') {
          rows.forEach((row) => {
            this.$refs[refName].toggleRowSelection(row, status);
          });
        } else {
          this.$refs[refName].toggleRowSelection(rows, status);
        }
      });
    },
  },
};
