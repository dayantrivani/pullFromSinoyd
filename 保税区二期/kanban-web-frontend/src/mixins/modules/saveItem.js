/**
 * @description 保存记录
 */

import { merge, cloneDeep } from 'lodash';
import { analyzeResp, message } from '@/libs/util';

export default {
  data() {
    return {
      formLoading: false, // 表单加载状态
      itemModel: {},      // 表单编辑对象
      rules: {},          // 表单验证
    };
  },
  methods: {
    // 获取单条记录
    getItemOne(id, callback) {
      if (!id) return;
      this.formLoading = true;
      this.api.getOne(id).then((res) => {
        if (res.status === 200 && res.data.success) {
          const emptyForm = cloneDeep(this.api.emptyForm);
          this.itemModel = merge(emptyForm, res.data.data);
          if (callback) { callback(res.data.data); }
        } else {
          message('warning', res);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.formLoading = false;
      });
    },
    // 保存记录
    onCheckForm(refsName, callback) {
      // 表单是否需要验证
      if (!Object.keys(this.rules).length) {
        this.onSaveItem(callback);
        return;
      }
      this.$refs[refsName].validate((valid) => {
        if (!valid) return;
        this.onSaveItem(callback);
      });
    },
    // 发送保存记录请求
    onSaveItem(callback) {
      this.formLoading = true;
      // eslint-disable-next-line no-undef
      this.api.save(this.itemModel)
        .then((res) => {
          if (res.status === 200 && res.data.success) {
            message('success', '操作成功');
            this.itemModel = res.data.data;
            if (callback) {
              callback(res.data.data);
            } else {
              this.$emit('query');
            }
          } else {
            message('warning', res);
          }
        }, ({ res }) => {
          analyzeResp(res);
        }).finally(() => {
          this.formLoading = false;
        });
    },
  },
};
