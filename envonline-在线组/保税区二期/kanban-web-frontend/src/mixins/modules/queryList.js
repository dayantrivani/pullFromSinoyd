/**
 * @description 查询记录列表
 */

import { analyzeResp, message } from '@/libs/util';

export default {
  data() {
    return {
      loading: false,     // 数据列表加载状态
      itemList: [],       // 数据列表
      queryForm: {},      // 查询表单对象
    };
  },
  methods: {
    // 获取记录列表
    getItemList(resetPage) {
      this.loading = true;
      if (resetPage) { this.pager.page = 1; }
      this.api.getList({ ...this.queryForm, ...this.pager }).then((res) => {
        if (res.status === 200 && res.data.success) {
          this.itemList = res.data.data;
          this.pager.count = res.data.count;
        } else {
          message('warning', res);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
