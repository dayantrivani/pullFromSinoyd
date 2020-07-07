/**
 * @description 删除记录
 */

import { analyzeResp, message } from '@/libs/util';

export default {
  methods: {
    // 删除记录
    // eslint-disable-next-line consistent-return
    onDeleteItem(callback) {
      if (!this.selectedIds.length) {
        message('请选择需要删除的数据');
        return false;
      }
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => (
        this.api.remove(this.selectedIds)
      )).then((res) => {
        if (res.status === 200 && res.data.success) {
          message('success', '删除成功');
          if (callback) {
            callback();
          } else {
            this.getItemList();
          }
        } else {
          message('warning', res);
        }
      }, ({ error }) => {
        analyzeResp(error);
      });
    },
  },
};
