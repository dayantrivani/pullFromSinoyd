/* eslint-disable */

import Mock from 'mockjs';

const arr = [];
for (let i = 0; i < 50; i++) {
  arr.push(Mock.mock({
    'id|+1': 0,
    'rowGuid|32': '@word',
    'dictCode|10': '@word',
    'dictName|3-7': '@cword',
    'dictValue|1': '@word',
    'parentId|32': '@word',
    'entName': '@city@ctitle(1,4)有限公司',
    'regionName': '@county(true)',
    'date': '@date("yyyy-MM-dd")',
    'name': '@cname',
    'province': '@province',
    'city': '@city',
    'address': '@county(true)',
    'zip': '@string(number, 6, 6)',
    'formData|1-15': [
      {
        'label': '@pick(["样品编号", "样品名称", "站点名称", "样品类型", "项目名称"])',
        'value': '@word',
        'type': '@integer(1, 3)',
      },
    ],
  }));
}
const formData = Mock.mock({
  'formData|15-30': {
    '@word': {
      'label': '@cname',
      'value': '@name',
    },
  },
});

export default {
  getTableData() {
    return arr.slice(0, 15);
  },
  getFormData() {
    return formData;
  },
};
