/**
 * 引用混合注意事项：
 * 1. 若变量或方法定义与混合中重名，则会将混合中的覆盖
 * 2. 仅适合在单个 vue 引用，无法在单个页面中多次引用相同混合
 * 3. 混合中的钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用
 */

import QueryDict from './modules/queryDict';
import QueryList from './modules/queryList';
import SaveItem from './modules/saveItem';
import DeleteItem from './modules/deleteItem';
import Table from './modules/table';

export const queryDict = QueryDict;   // 查询常量字典表
export const queryList = QueryList;   // 查询列表
export const saveItem = SaveItem;     // 保存记录
export const deleteItem = DeleteItem; // 删除记录
export const table = Table;           // 表格常用方法

export default {};
