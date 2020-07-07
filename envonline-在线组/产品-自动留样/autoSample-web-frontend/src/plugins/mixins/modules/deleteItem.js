export default {
  methods: {
    // 删除记录
    onDeleteItem(callback) {
      if (this.selectedIds.length === 0) {
        this.$message('请选择需要删除的数据');
        return;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.$http.delete(`${this.url}`, { data: this.selectedIds })
      )).then((response) => {
        if (response.status === 200 && response.data.msg.includes('成功')) {
          this.$message.success({
            message: '删除成功',
            duration: 3000,
            showClose: true,
          });
          if (callback) {
            callback(this.selectedIds);
          } else {
            this.getItemList();
          }
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      });
    },
  },
};
