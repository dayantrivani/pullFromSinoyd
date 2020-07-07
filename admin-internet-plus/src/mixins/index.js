/**
 * 引用混合注意事项：
 * 1. 若变量或方法定义与混合中重名，则会将混合中的覆盖
 * 2. 仅适合在单个 vue 引用，无法在单个页面中多次引用相同混合
 * 3. 混合中的钩子按照传入顺序依次调用，并在调用组件自身的钩子之前被调用
 */

import TablePager from './modules/tablePager';
import TableSelected from './modules/tableSelected';

// 表格 - 分页
export const tablePager = TablePager;

// 表格 - 多选
export const tableSelected = TableSelected;
