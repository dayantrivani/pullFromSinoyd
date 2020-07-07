<!-- Page: 总体监控情况 -->
<template>
  <container>
    <el-card fill header="更新日志" shadow="never">
      <div class="row-md">
        <p>1. 实现自定义布局功能，可拖拽首页元素块来进行布局调整</p>
        <p>2. 导航配置的外链页面将通过（iframe）嵌入进来，本框架页面也都做了被嵌入的调整（隐藏侧栏与顶栏）</p>
        <p>3. 引入了丰富的主题个性化风格设置，见右上角用户名 - 用户菜单 - 主题设置</p>
        <p>4. 鉴权验证功能 403（有配置路由，用户导航未配置）、404（未配置路由，用户导航已配置）、500（路由导向异常）</p>
        <p>5. 在 token 过期时，会尝试同步刷新后再调原请求，实现无感刷新，需在登录时勾选保持登录项</p>
        <p>6. 更灵活的图标引入方式，只需将图标文件（.svg）放在项目 src/assets/icons 目录下，即可调图标组件直接使用该图标</p>
        <p>7. 开发环境点顶栏的搜索图标，即可查找当前项目中引入的全部图标</p>
        <p>8. 引入了枚举机制，以及配套使用的 SelectEnum 组件</p>
      </div>
    </el-card>
    <el-card fill header="注意事项" shadow="never" class="mar-t-scope">
      <div class="row-md">
        <p>1. 若使用本项目中未引用的图标，该图标将不会显示</p>
        <p>2. 按需引入 element-ui 的组件，若所使用 element-ui 组件无效，请在项目 src/lib/components.js 文件中引入即可</p>
        <p>3. 本框架兼容至IE10, 若项目中需使用新的依赖插件时，请考量其兼容性是否满足要求</p>
      </div>
    </el-card>
  </container>
</template>

<script>

export default {
  name: 'Dashboard',
};
</script>
