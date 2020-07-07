import QueryList from './modules/queryList';
import DeleteItem from './modules/deleteItem';
import SaveItem from './modules/saveItem';
import SaveFile from './modules/saveFile';
import TableStyle from './modules/tableStyle';
import Formula from './modules/formula';

export const queryList = QueryList;   // 列表查询
export const deleteItem = DeleteItem; // 删除记录
export const saveItem = SaveItem;     // 保存记录
export const saveFile = SaveFile;     // 保存记录（带附件上传）
export const tableStyle = TableStyle; // 表格的悬浮、点击、选中样式
export const formula = Formula;       //  用于处理公式插入的逻辑

export default {};
