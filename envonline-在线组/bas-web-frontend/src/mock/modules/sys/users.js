/* eslint-disable */

// 布局规范
const docs = {
  icon: 'fas fa-swatchbook',
  label: '设计规范',
  moduleUrl: 'docs',
  children: [
    {
      icon: 'fab fa-codepen',
      label: '基础组件',
      moduleUrl: 'basicWidget',
      children: [
        {
          icon: 'fas fa-tag',
          label: '按钮',
          moduleUrl: 'Buttons',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '单选和多选框',
          moduleUrl: 'Checkboxs',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '输入框',
          moduleUrl: 'Inputs',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '计数器',
          moduleUrl: 'Counter',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '选择器',
          moduleUrl: 'Selects',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '开关',
          moduleUrl: 'Switch',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '时间选择器',
          moduleUrl: 'TimePickers',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '穿梭框',
          moduleUrl: 'Transfers',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '上传',
          moduleUrl: 'Uploads',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '下载',
          moduleUrl: 'Downloads',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '树形控件',
          moduleUrl: 'Tree',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '标记',
          moduleUrl: 'Badges',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '提示信息',
          moduleUrl: 'Hints',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '对话框',
          moduleUrl: 'Dialogs',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '标签页',
          moduleUrl: 'Tabs',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'fas fa-tag',
          label: '下拉菜单',
          moduleUrl: 'Dropdowns',
          class: 'text-danger',
          children: [],
        },
      ],
    },
    {
      icon: 'icon icon-qita',
      label: '组件应用',
      moduleUrl: 'useWidget',
      children: [
        {
          icon: 'far fa-file',
          label: '列表 - 状态',
          moduleUrl: 'FormElement',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '列表 - 按钮标记',
          moduleUrl: 'ListItem',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '列表 - 按钮组',
          moduleUrl: 'ButtonGroup',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '列表 - 标签',
          moduleUrl: 'StateGruid',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '排序列表',
          moduleUrl: 'SortGrud',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '扩展列表',
          moduleUrl: 'KuoGruid',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '双行列表',
          moduleUrl: 'DoubleRowTable',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '多行列表',
          moduleUrl: 'MutiLineGrid',
          class: 'text-danger',
          children: [],
        },
      ],
    },
    {
      icon: 'icon icon-jiancemobanpeizhia1',
      label: '特殊应用',
      moduleUrl: 'specialWidget',
      children: [
        {
          icon: 'far fa-file',
          label: '树形表格',
          moduleUrl: 'TreeTable',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '窗格选择器',
          moduleUrl: 'PaneSelect',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '弹框选择器',
          moduleUrl: 'DialogSelects',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '动态增减表单',
          moduleUrl: 'DynamicAddForm',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '拖拽栏',
          moduleUrl: 'DragCol',
          class: 'text-danger',
          children: [],
        },
      ],
    },
    {
      icon: 'icon icon-renwuleixing',
      label: '页面布局',
      moduleUrl: 'grid',
      children: [
        {
          icon: 'far fa-file',
          label: '两列 + 两个拖拽列',
          moduleUrl: 'AnalysisItemSort',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '两列 + 伸缩标签',
          moduleUrl: 'ScalingUpDown',
          class: 'text-danger',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '单列 + 一个拖拽列',
          moduleUrl: 'TesterConfig',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '单列 + 树',
          moduleUrl: 'PlanDetails',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '单列 + 标签页',
          moduleUrl: 'Consumables',
          children: [],
        },
        {
          icon: 'far fa-file',
          label: '三个列表',
          moduleUrl: 'QualityControl',
          children: [],
        },
      ],
    },
  ],
};

// 需求开发
const tasks = {
  icon: 'fas fa-tasks',
  label: '需求开发',
  moduleUrl: 'tasks',
  children: [
    {
      icon: 'fas fa-hashtag',
      label: '01. 表单-表单显示',
      moduleUrl: 'BasicForm',
      class: 'text-danger',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '02. 表单-动态布局',
      moduleUrl: 'SampleDataQuery',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '03. 表单-动态参数',
      moduleUrl: 'DynamicFormItem',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '04. 表单-公式插入',
      moduleUrl: 'FormulaInsert',
      class: 'text-danger',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '06. 多级表头',
      moduleUrl: 'MultistageHeader',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '07. 可编辑表格',
      moduleUrl: 'EditTable',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '08. 批量操作&列锁定',
      moduleUrl: 'LockCol',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '09. 编辑弹框',
      moduleUrl: 'DialogEdit',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '10. 选项卡切换提示',
      moduleUrl: 'TabSwitchHint',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '11. 选项卡内容显示',
      moduleUrl: 'DynamicTabShow',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '12. 行操作编辑',
      moduleUrl: 'RowOperation',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '13. 拖拽&检索',
      moduleUrl: 'DragSearchData',
      class: 'text-danger',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '14. 已选项拖拽排序',
      moduleUrl: 'DropSort',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '15. 列的显示和隐藏',
      moduleUrl: 'ColShowHide',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '16. 表头按钮',
      moduleUrl: 'HeaderAddButton',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '17. 双击清除列',
      moduleUrl: 'DblclickCleanCol',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '18. 列表内状态标识',
      moduleUrl: 'ColourChanges',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '20. 表格统计',
      moduleUrl: 'TableStatistics',
      class: 'text-danger',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '21. 表格分组',
      moduleUrl: 'Drouping',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '24. 项目进度条',
      moduleUrl: 'ProjectPmgressbar',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '25. 多选项卡页',
      moduleUrl: 'MoreTabs',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '27. 单步调试',
      moduleUrl: 'SingleStepDebug',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '28. 分块收缩布局',
      moduleUrl: 'BlockShrink',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '29. 页面展开与收缩',
      moduleUrl: 'DialogExtend',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '35. 批量上传附件',
      moduleUrl: 'FilesUpload',
      class: 'text-danger',
      children: [],
    },
    {
      icon: 'fas fa-hashtag',
      label: '36. 分栏边界拖拽',
      moduleUrl: 'BoundaryDrag',
      children: [],
    },
  ],
};

// LIMS 模块示例
const example = {
  icon: 'fas fa-solar-panel',
  label: '示例模块',
  moduleUrl: 'example',
  children: [
    // LIMS 简易功能
    {
      icon: 'fas fa-cloud',
      label: 'LIMS 云平台',
      moduleUrl: 'limsYun',
      children: [
        {
          icon: 'icon icon-fenxixiangmuguanli',
          label: '项目管理',
          moduleUrl: 'projectManage',
          children: [],
        },
        {
          icon: 'fas fa-clipboard-list',
          label: '自定义项目',
          moduleUrl: 'customItems',
          children: [],
        },
        {
          icon: 'fas fa-sitemap',
          label: '工作流程设置',
          moduleUrl: 'workFlow',
          children: [],
        },
      ],
    },
    {
      icon: 'far fa-building',
      label: '实验室管理',
      moduleUrl: 'labManage',
      children: [
        {
          icon: 'icon icon-renyuanguanli1',
          label: '人员管理',
          moduleUrl: 'PeopleManage',
          children: [],
        },
        {
          icon: 'fas fa-vials',
          label: '测试管理',
          moduleUrl: 'testManage',
          children: [
            {
              icon: 'icon icon-fenxixiangmuguanli',
              label: '测试项目管理',
              moduleUrl: 'TestProject',
              children: [],
            },
            {
              icon: 'icon icon-fenxixiangmuguanli1',
              label: '分析项目管理',
              moduleUrl: 'AnalyzeProject',
              children: [],
            },
            {
              icon: 'icon icon-fenxifangfaguanli',
              label: '分析方法管理',
              moduleUrl: 'AnalyzeMethod',
              children: [],
            },
          ],
        },
        {
          icon: 'fas fa-snowflake',
          label: '消耗品管理',
          moduleUrl: 'expendManage',
          children: [
            {
              icon: 'far fa-file',
              label: '消耗品管理',
              moduleUrl: 'ExpendableManage',
              children: [],
            },
            {
              icon: 'far fa-folder',
              label: '领料管理',
              moduleUrl: 'pickingManage',
              children: [
                {
                  icon: 'far fa-file',
                  label: '领料申请',
                  moduleUrl: 'PickingApply',
                  children: [],
                },
                {
                  icon: 'far fa-file',
                  label: '领料审核',
                  moduleUrl: 'PickingAudit',
                  children: [],
                },
                {
                  icon: 'far fa-file',
                  label: '发料',
                  moduleUrl: 'PickingIssue',
                  children: [],
                },
                {
                  icon: 'far fa-file',
                  label: '个人确认领料',
                  moduleUrl: 'PickingAffirm',
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      icon: 'fab fa-windows',
      label: '系统管理',
      moduleUrl: 'sysManage',
      children: [
        {
          icon: 'icon icon-renwuqingkuang1',
          label: '常量管理',
          moduleUrl: 'ConstantManage',
          children: [],
        },
        {
          icon: 'icon icon-jiancecanshupeizhi1',
          label: '参数管理',
          moduleUrl: 'ParameterManage',
          children: [],
        },
        {
          icon: 'icon icon-lianggangguanli1',
          label: '量纲管理',
          moduleUrl: 'DimensionManage',
          children: [],
        },
        {
          icon: 'icon icon-wenjianguanli1',
          label: '文件管理',
          moduleUrl: 'DocumentManage',
          children: [],
        },
      ],
    },
  ],
};

// 第三方插件评估
const test = {
  icon: 'fas fa-puzzle-piece',
  label: '插件测试',
  moduleUrl: 'test',
  children: [
    {
      icon: 'fas fa-edit',
      label: 'TinymceEditor',
      moduleUrl: 'Editor',
      children: [],
    },
    {
      icon: 'fas fa-chart-bar',
      label: 'Echarts',
      moduleUrl: 'Echarts',
      class: 'text-danger',
      children: [],
    },
    {
      icon: 'fas fa-table',
      label: 'Handsontable',
      moduleUrl: 'Handsontable',
      children: [],
    },
  ],
};

// 代码练习
const demo = {
  icon: 'fas fa-code',
  label: '代码练习',
  moduleUrl: 'demo',
  children: [
    {
      icon: 'fas fa-tag',
      label: 'SVG动画1',
      moduleUrl: 'SVG1',
      children: [],
    },
    {
      icon: 'fas fa-tag',
      label: 'SVG动画2',
      moduleUrl: 'SVG2',
      children: [],
    },
    {
      icon: 'fas fa-tag',
      label: '自定义表单1',
      moduleUrl: 'FROM1',
      children: [],
    },
    {
      icon: 'fas fa-tag',
      label: '弹性卡片',
      moduleUrl: 'Card1',
      children: [],
    },
  ],
};

const level = {
  icon: 'fas fa-bars',
  label: '一级导航五六七八九十',
  moduleUrl: '01',
  children: [
    {
      icon: 'fas fa-eraser',
      label: '二级导航',
      moduleUrl: '0101',
      children: [],
    },
    {
      icon: 'fas fa-check',
      label: '二级导航五六七八九',
      moduleUrl: '0102',
      children: [
        {
          icon: 'fas fa-eraser',
          label: '三级导航',
          moduleUrl: '010201',
          children: [],
        },
        {
          icon: 'fas fa-check',
          label: '三级导航五六七八',
          moduleUrl: '010202',
          children: [
            {
              icon: 'fas fa-eraser',
              label: '四级导航',
              moduleUrl: '01020201',
              children: [],
            },
            {
              icon: 'fas fa-check',
              label: '四级导航五六七八',
              moduleUrl: 'Empty',
              children: [],
            },
          ],
        },
        {
          icon: 'fas fa-eraser',
          label: '三级导航',
          moduleUrl: '010103',
          children: [],
        },
      ],
    },
    {
      icon: 'fas fa-eraser',
      label: '二级导航',
      moduleUrl: '0103',
      children: [],
    }
  ],
};

export default {
  code: 200,
  count: 1,
  success: true,
  msg: '操作成功',
  data: [
    {
      blank: false,
      can: true,
      checked: false,
      icon: '',
      id: '@word(32)',
      label: 'LIMS 管理云平台',
      moduleCode: 'dynamic',
      moduleGuid: '@word(32)',
      moduleUrl: '',
      parentId: '0',
      webAppGuid: '@word(32)',
      children: [
        docs,
        tasks,
        // example,
        test,
        demo,
        level,
      ],
    },
  ],
};
