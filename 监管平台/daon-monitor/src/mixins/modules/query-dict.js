/**
 * @description 保存记录
 */

import axios from '@/libs/api-request';
import { analyzeResp } from '@/libs/util';

export default {
  data() {
    return {
      dict: {},           // 字典表数据
    };
  },
  methods: {
    // 获取字典表数据
    getDictList() {
      // 页面无需字典表时不执行
      const dictList = Object.keys(this.dict);
      if (!dictList.length) return;

      // 循环请求字典表
      const requests = dictList.map(key => axios.request({
        url: `sys/enumCode/${key}/0`,
        method: 'get',
      }).then((res) => {
        this.dict[key] = res.data;
      }, ({ error }) => {
        analyzeResp(error);
      }));
      // eslint-disable-next-line
      return Promise.all(requests);
    },
  },
};
