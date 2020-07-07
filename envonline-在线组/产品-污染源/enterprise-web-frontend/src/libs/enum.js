/** 枚举常量 -- 只适用于当前项目
 *  用法：this.$enum.level
 */

const enums = {
  // level: {
  //   1: '一级',
  //   2: '二级',
  //   3: '三级',
  //   4: '四级',
  // },
  shape: {
    1: '固态',
    2: '液态',
    3: '气态',
  },
  sourceCategorys: {
    1: '工艺源',
    2: '非工艺源',
  },
  sex: {
    1: '男',
    2: '女',
  },
  fireHazardClass: {
    1: '甲类',
    2: '乙类',
    3: '丙类',
    4: '丁类',
    5: '戊类',
  },
  EnumPersonStatus: {
    1: '在职',
    2: '离职',
    3: '休假',
  },
  fireResistanceRating: {
    1: '一级',
    2: '二级',
    3: '三级',
    4: '四级',
  },
  rawMaterialType: {
    1: '原料',
    2: '辅料',
  },
  collectionMethods: {
    pipeline: '管道',
    gasSkirt: '集气罩',
  },
};

export default enums;
