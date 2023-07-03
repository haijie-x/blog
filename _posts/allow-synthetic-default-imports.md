---
title: "Carefully use allowSyntheticDefaultImports in tsconfig.json"
excerpt: "谨慎开启 tsconfig.json 中的 allowSyntheticDefaultImports"
date: "2023-04-21T04:34:41.712Z"
---

## 背景

平常几乎不怎么写单元测试，昨天在使用 jest 对一个函数跑单测，一直报三方模块 undefined，下面是缩略过后的函数源代码。

```js
// 引入三方库做 url 的解析成 Object
import qs from "query-string";
export const getSearch = () => {
  return qs.parse(location.search);
};
```

此时执行 jest 命令，控制台报错 `cannot read parse of undefined`，一开始以为是 jest 无法加载外部的依赖，执行在沙盒环境中。需要指定 `moduleNameMapper` 来加载外部依赖，后来的尝试都以失败告终。

我百思不得其解，在项目中全文检索"query-string"库的引用，全是默认导入的写法。于是我又尝试在浏览器中调用 `getSearch` 方法，结果并无报错。

此时我只能在 node_modules 里找答案了，神奇的发现，源码中全是具名导出的写法。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d4349b094284fb892e5e0928c439e4f~tplv-k3u1fbpfcp-watermark.image?)

先将引入方式改为具名导入，跑过单测先。

```js
import { parse } from "query-string";
```

回过头来，思考这个问题。为什么项目中 `query-string` 库的引用，全是默认导入的写法`import qs from "query-string"`，在 ide 中没有 tsError 提示，在浏览器中也没 jsError 报错呢？

我翻看 tsconfig 中的配置文件，发现了这个配置项`allowSyntheticDefaultImports`，翻译一下：允许合成默认导入，从名字看上去就感觉是它搞的鬼。

查阅 ts 官网中关于它的定义解释：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/35b2dd2b948e4123a29bdfe885e0d607~tplv-k3u1fbpfcp-watermark.image?)

如果`allowSyntheticDefaultImports`为 false

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
module.exports = {
  getStringLength,
};

// @filename: index.ts
// Module '"/home/runner/work/TypeScript-Website/TypeScript-Website/utilFunctions"' has no default export.
import utils from "./utilFunctions";
const count = utils.getStringLength("Check JS");
```

恍然大悟，原来在 ide 中 ts 没有报错是因为它允许`使用默认导入方式去导入一个没有默认导入的外部依赖`。在浏览器中没有报错是因为在运行项目前 babel 会进行一层导出的编译，转义过后的模块代码类似

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};
module.exports = allFunctions;
module.exports.default = allFunctions;
```

翻看项目的代码，其实有很多这种类似的例子，如上方提及的例子

```js
import React from "react";
```

## 解决

1. 使用 tsconfig 的 reference 特性，将测试文件的 tsconfig 模块化，将该配置项设置为 false，局部编译。
2. 使用具名导入的方式去进行加载外部依赖。
3. 对于没有进行 babel 编译的项目，严禁使用 allowSyntheticDefaultImports，否则会导致开发者开发无报错感知，但项目启动一堆报错问题。
