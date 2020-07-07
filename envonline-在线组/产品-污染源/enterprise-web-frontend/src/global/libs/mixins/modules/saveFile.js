import { getType } from '@/global/libs/tools';
import { analyzeResp } from '@/global/libs/util';

export default {
  data() {
    return {
      saveLoading: false, // 保存按钮状态
      isRequest: false,   // 是否调用获取附件接口
      isEdit: false,      // 是否是编辑对话框
      itemModel: {},      // 表单编辑对象
      formRules: {},      // 表单验证
      rulesMsg: {},       // 表单验证消息（用于文字提示判断）
      dict: {},           // 字典表数据
    };
  },
  methods: {
    /** 请求层 */
    getAttachGuId() {             // 获取附件全网唯一标识符
      this.loading = true;
      this.$http.get('sys/guid/new').then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemModel.id = response.data.data || '';
        } else {
          this.$message.warning({
            message: response.data.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }).finally(() => {
        this.loading = false;
      });
    },
    getDictList() {               // 获取字典表数据
      // 页面无需字典表时不执行
      if (this.isEmptyObj(this.dict)) { return; }
      const dictList = Object.keys(this.dict);
      // 循环请求字典表
      dictList.forEach(((key) => {
        this.$store.dispatch('dict/GET_SELECT_TYPE', key).then((val) => { this.dict[key] = val; });
      }));
    },
    getItemOne(row, callback) {   // 获取单条记录
      if (!row) return;
      const id = getType(row) === 'object' ? row.id : row;
      this.formLoading = true;
      this.$http.get(`${this.url}/${id}`).then((response) => {
        if (response.status === 200 && response.data.success) {
          this.itemModel = Object.assign(this.itemModel, response.data.data);
          if (callback) { callback(response.data.data); }
        } else {
          this.$message.warning({
            message: response.body.msg,
            duration: 3000,
            showClose: true,
          });
        }
      }, ({ response }) => {
        analyzeResp(response);
      }).finally(() => {
        this.formLoading = false;
      });
    },
    onSaveItem(callback) {        // 发送保存记录请求
      this.saveLoading = true;
      this.$http[this.isEdit ? 'put' : 'post'](this.url, this.itemModel)
        .then((response) => {
          if (response.status === 200 && response.data.success) {
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
        }, ({ response }) => {
          analyzeResp(response);
        }).finally(() => {
          this.saveLoading = false;
        });
    },

    /** 回调层 */
    initCallback() {              // 获取初始化数据结束后回调
    },
    onSaveCheck(callback) {       // 保存记录前回调
      // 表单是否需要验证
      if (this.isEmptyObj(this.formRules)) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },

    /** 特殊方法 */
    saveCallback() {         // 保存数据成功后的回调
      this.$refs.dialog.closeDialog();
      this.$emit('query');
    },
    isEmptyObj(obj) {      // 判断对象是否为空
      return Object.keys(obj).length === 0;
    },
    closeDialog() {       // 关闭对话框
      this.isEdit = false;
      this.isRequest = false;
      this.itemModel = this.getEmptyItem();
      this.$refs.form.clearValidate();
      this.$refs.dialog.closeDialog();
    },
    getEmptyItem() {     // 重置表单数据
      return {};
    },
  },
};
