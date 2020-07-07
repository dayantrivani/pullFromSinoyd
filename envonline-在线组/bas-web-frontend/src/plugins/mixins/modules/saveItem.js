export default {
  data() {
    return {
      formLoading: false, // 表单加载状态
      itemModel: {},
    };
  },
  methods: {
    // 获取空项表单对象
    getEmptyItem() {
      return {};
    },
    // 获取单条记录
    getItemOne(id = '') {
      this.formLoading = true;
      this.$http.get(`${this.url}/${id}`).then((response) => {
        if (response.data.success) {
          this.itemModel = Object.assign(this.getEmptyItem(), response.data.data);
        } else {
          this.$message.warning({
            message: response.body.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.formLoading = false;
      });
    },
    // 保存记录
    onSaveItem() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        const { id } = this.itemModel;
        this.$http[id ? 'put' : 'post'](this.url, this.itemModel)
          .then((response) => {
            if (response.data.success) {
              this.$message.success({
                message: `${id ? '编辑' : '新增'}成功`,
                duration: 3000,
                showClose: true,
              });
              this.itemModel = response.data.data;
              this.$emit('setRowId', this.itemModel.id);
              this.$emit('query');
            } else {
              this.$message.warning({
                message: response.data.message,
                duration: 3000,
                showClose: true,
              });
            }
          });
      });
    },
  },
};
