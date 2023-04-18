---
title: "Getting Started with (and Surviving) Node.js ESM"
excerpt: "深入了解、研究一下 ESM 模块 和 CJS 模块"
coverImage: "/assets/blog/node-esm-cjs/cover.jpg"
date: "2023-04-17T14:33:52.673Z"
---

## package.json 字段

**type**: 定义该模块会被 Node 如何解析，若无该字段，会被认为是 CJS。

```js
// my-app.js, treated as an ES module because there is a package.json
// file in the same folder with "type": "module".

import "./startup/init.js";
// Loaded as ES module since ./startup contains no package.json file,
// and therefore inherits the "type" value from one level up.

import "commonjs-package";
// Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// lacks a "type" field or contains "type": "commonjs".

import "./node_modules/commonjs-package/index.js";
// Loaded as CommonJS since ./node_modules/commonjs-package/package.json
// lacks a "type" field or contains "type": "commonjs".
```

以 结尾的文件.mjs 总是作为 ES 模块加载，而不管最近的 parent package.json。

以结尾的文件.cjs 总是作为 CommonJS 加载，而不管最近的 parent package.json。

**main**: 定义包的主要入口点。所有版本的 Node 皆支持。

**exports**: 定义包多个入口点，只有 12+版本的 Node 才支持。它可以支持定义子路径导出和条件导出，同时封装内部未导出的模块。所有的路径定义都得是以'./'开头的相对路径。

**imports**: 创建仅适用于包本身内的导入说明符的私有映射。字段中的条目必须始终以 # 开头，以确保它们与外部包说明符没有歧义。

```json
// package.json
{
  "imports": {
    "#dep": {
      // 有先后执行顺序 先加载node 再加载default 相关文件不存在会报错
      "node": "dep-node-native",
      "default": "./dep-polyfill.js"
    }
  },
  "dependencies": {
    "dep-node-native": "^1.0.0"
  }
}
```

```js
// node_modules/dep-node-native/index.js
exports.name = "native";
// dep-polyfill.js
exports.name = "polyfill";

// foo.mjs
import a from "#dep";
```

## 在 ESM 中导入 CommonJS

import 一个 CommonJS 依赖，只能进行默认对象导入，而不能进行具名导入。

```js
// node_modules/colors/index.cjs
module.exports = {
  red: "red",
  blue: "blue",
};
// my-app.mjs
import colors from "colors";
// WON'T WORK: `import { red, blue } from "colors";`

// CAVEAT: We can't do named import, but can expand later.
const { red, blue } = colors;
```

由于这种简单性，库作者为了兼容库的 CJS 和 ESM 两种模式，他可能需要考虑 ESM 包装器模式（[在 Node.js 文档中建议](https://nodejs.org/api/packages.html#approach-1-use-an-es-module-wrapper)），该模式是以 CJS 模块规范编写代码，然后在 ESM 模块的出口文件中导入 CJS 模块，并包装成 ESM 模块导出给用户使用。

```js
// package.json
{
    "name": "my-pkg",
    "main": "./index.js",
    "exports": {
      ".": {
        "import": "./wrapper.mjs",
        "require": "./index.js"
      }
    }
  }

// node_modules/my-pkg/a.js
exports.module_name = 'a'

// node_modules/my-pkg/index.js
const {module_name} = require('./a')
exports.a_module_name = module_name

// node_modules/my-pkg/wrapper.mjs
import cjs_module from './index.js'
export const a_module_name = cjs_module.a_module_name

// use my-pkg
import { a_module_name } from "my-pkg";
console.log(a_module_name); // 'a'

const { a_module_name } = require("my-pkg");
console.log(a_module_name); // 'a'
```

## 在 CommonJS 中导入 ESM

先说个坏消息，在 CommonJS 中导入 ESM 是非常痛苦的。要将 ESM 文件导入 CommonJS，必须遵守以下所有条件：\
1.你必须在 Node.js 上 v12.17.0+（这适用于任何与 ESM 相关的）。\
2.[使用动态 import()调用](https://nodejs.org/api/esm.html#import-expressions)

```js
// esm.mjs
export const name = "polyfill";
// cjs.js
console.log(require("./esm.mjs")); // Error [ERR_REQUIRE_ESM]: require() of ES Module
import("./esm.mjs").then((r) => console.log(r)); // [Module: null prototype] { name: 'polyfill' }
```
