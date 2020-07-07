# vue-frame

## 项目安装
```
yarn
```

## 更新依赖子库(公共代码)
```
git submodule update --init --recursive
```
若无法更新，尝试执行
```
git rm --cached src/global
git submodule add http://192.168.6.15/Sinoyd-WuHan/public/vue-frame-global.git src/global
```

若还是无法更新，再尝试执行
```
git submodule add git@192.168.6.15:Sinoyd-WuHan/public/vue-frame-global.git src/global
```

### 运行开发环境
```
yarn dev
```

### 打包构建
```
yarn build
```

### 修复简单语法错误
```
yarn lint
```
