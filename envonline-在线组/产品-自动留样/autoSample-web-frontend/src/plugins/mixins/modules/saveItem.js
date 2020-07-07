export default {
  data() {
    return {
      formLoading: false, // 表单加载状态
      saveLoading: false, // 保存按钮状态
      itemModel: {},      // 表单编辑对象
      rules: {},          // 表单验证
      rulesMsg: {},       // 表单验证消息（用于文字提示判断）
      dict: {},           // 字典表数据
    };
  },
  created() {
    // 生成表单验证消息字段（根据验证对象）
    Object.keys(this.rules).forEach((key) => {
      this.rulesMsg[key] = { check: true, msg: '' };
    });
  },
  methods: {
    // 对部分表单字段进行校验的方法
    onValidate(field, check, msg) {
      this.$set(this.rulesMsg, field, { check, msg: msg || '' });
    },
    // 判断对象是否为空
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0;
    },
    // 获取字典表数据
    getDictList() {
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
    },
    // 获取单条记录
    getItemOne(row, callback) {
      if (!row) return;
      const id = this.$hp.getType(row) === 'object' ? row.rowGuid : row;
      this.formLoading = true;
      this.$http.get(`${this.url}/${id}`).then((response) => {
        if (response.status === 200 && response.data.msg.includes('成功')) {
          this.itemModel = Object.assign(this.getEmptyItem(), response.data.data);
          if (callback) { callback(response.data.data); }
        } else {
          this.$message.warning({
            message: response.body.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, (response) => {
        this.$hp.resp(response);
      }).finally(() => {
        this.formLoading = false;
      });
    },
    // 获取初始化数据结束后回调
    initCallback() {},
    // 保存记录
    onSaveCheck(callback) {
      // 表单是否需要验证
      if (this.isEmptyObj(this.rules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.saveLoading = true;
      const { rowGuid } = this.itemModel;
      this.$http[rowGuid ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.msg.includes('成功')) {
            this.$message.success({
              message: '操作成功',
              duration: 3000,
              showClose: true,
            });
            this.itemModel = response.data.data;
            if (callback) {
              callback(response.data.data);
            } else {
              this.$emit('query');
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
        }).finally(() => {
          this.saveLoading = false;
        });
    },
  },
};
