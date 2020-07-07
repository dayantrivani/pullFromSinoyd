/**
 * @description 查询记录列表
 */

import { analyzeResp, message } from '@/libs/util';

export default {
  data() {
    return {
      loading: {
        spinning: false,
        tip: '数据加载中',
      },     // 数据列表加载状态
      itemList: [],       // 数据列表
      queryForm: {},      // 查询表单对象
    };
  },
  methods: {
    // 获取记录列表
    getItemList() {
      this.loading.spinning = true;
      this.getList(this.queryForm).then((response) => {
        if (response.data.success && response.data.code === 200) {
          this.itemList = response.data.data;
          this.pagination.total = response.data.total;
          if (response.data.data && response.data.data.length === 0 && this.queryForm.page !== 1) {
            this.queryForm.page -= 1;
            this.getList(this.queryForm).then((response) => {
              this.itemList = response.data.data;
              this.pagination.total = response.data.total;
            });
          }
        } else {
          message('warning', response);
        }
      }, ({ error }) => {
        analyzeResp(error);
      }).finally(() => {
        this.loading.spinning = false;
      });
    },
  },
};
