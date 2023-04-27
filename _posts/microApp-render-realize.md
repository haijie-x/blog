---
title: "Micro Front-End - MicroApp render realize"
excerpt: "MicroApp微前端框架渲染挂载实现（WebComponent新特性）"
coverImage: "/assets/blog/microApp-render-realize/cover.jpg"
date: "2022-10-16T16:00:00.000Z"
---

关于微前端的不同解决方案总结，可以结合下我之前的文章 ->
[👾 浅谈微前端解决方案](https://juejin.cn/post/7149531106105098277?share_token=77b5ab8b-e8ba-4538-b983-ad0dd981ef44)

### WebComponent 介绍：

我们可以通过使用新特性 CustomElement 自定义一个 html 标签，来表示一个原生组件，以此来代替如今框架中 React、vue 中的组件。

### 如何使用？

```js
class microApp extends HTMLElement {
  constructor() {
    super();
  }
}
```

```js
window.customElements.define("micro-app", microApp);
```

这样我们在模板中就可以使用了！

```js
<micro-app></micro-app>
```

**有意思的是，这个原生组件与我们框架中的组件一样，有着自己的生命周期钩子。**

**connectedCallback：当组件被插入到文档中触发，有利于我们进行代码初始化。**

**disconnectedCallback：当组件从文档中被移除时触发，有利于我们进行代码清除。**

**attributeChangedCallback(attrName, oldVal, newVal)：当组件中设置的响应式数据发生变更时触发，结合 observedAttributes 属性一起使用。**

**adoptedCallback：当组件被插入到一个新的文档中触发。**

`参考MDN中Document.adoptNode的API介绍。`

> # Document.adoptNode()
>
> 从其他的 document 文档中获取一个节点。该节点以及它的子树上的所有节点都会从原文档删除 (如果有这个节点的话), 并且它的`ownerDocument`属性会变成当前的 document 文档。之后你可以把这个节点插入到当前文档中。

#### 步入本文主题：实现一个迷你版的 microApp。

### microApp 核心要点：巧妙利用 CustomElement，使用 htmlEntry+各种隔离机制实现子应用挂载、运行与卸载。

###

首先我们思考，为什么微前端和 webcomponent 扯上了关系？

**图出自 microApp 官网**
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e0201dfb54d4cf69dc8c4e82a5ec985~tplv-k3u1fbpfcp-watermark.image?)

可以看到，我们利用了 webcomponent 原生组件特性，来充当一个基座应用与子应用的媒介，因为其具有天然的原生支持，可以直接被注册在基座之中，通信也变得十分轻松，天然的生命周期钩子使得它可以进行子应用不同状态的流转操作。

**本文主要实现的是对于子应用的挂载渲染操作，自然使用到的便是 webcomponent 的 connectedCallback 钩子。**

下面来看具体如何实现，这边我们使用 html 编写基座，vue3 编写子应用。

基座代码如下：

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>微前端解决方案 -WebComponent</title>
</head>
<script src="./index.mjs" type="module"></script>
<body>
    <div>微前端解决方案 -WebComponent</div>
    <div>
      // active-url 表示子应用激活url
      <micro-app active-url="http://127.0.0.1:8002/"></micro-app>
    </div>
</body>
</html>
```

子应用代码如下：

main.js

```js
import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

createApp(App).use(ElementPlus).mount("#app");
```

webpack.config.js

```js
module.exports = {
  devServer: {
    port: 8002,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
```

microApp 组件代码：

```js
import { fetchHtml, executeScript } from "./fetch.mjs";

class microApp extends HTMLElement {
  // 子应用激活url
  get activeUrl() {
    return this.getAttribute("active-url");
  }
  // 需要被监听的属性放在这里定义
  static get observedAttributes() {
    // return ['name']
  }
  get container() {
    return this.shadowRoot;
  }
  constructor() {
    super();
  }
  // 生命周期钩子： component被插入dom中触发
  async connectedCallback() {
    // 注意:getAttribute只能在这时候拿到
    // this.activeUrl = this.getAttribute("active-url");
    const temp = await this.load();
    this.bootstrap(temp);
    Promise.resolve().then(() => {
      this.mount();
    });
  }
  // 加载资源
  async load() {
    const temp = await fetchHtml(this.activeUrl);
    return temp;
  }
  // 初始化子应用
  bootstrap(temp) {
    // 创建文档片段插入组件中
    const template = document.createElement("template");
    template.innerHTML = temp;
    const fra = document.createDocumentFragment();
    fra.appendChild(template.content.cloneNode(true));
    this.appendChild(fra);
  }
  // 挂载子应用
  mount() {
    // 执行相关script
    executeScript(document);
  }
}
window.customElements.define("micro-app", microApp);
```

工具函数：

```js
// 保存script脚本
const sourceSet = new Set();

// 封装请求资源
async function fetchResource(url) {
  const res = await fetch(url);
  // res.text 也是一个promise
  return res.text();
}

// 请求html文件
export async function fetchHtml(url) {
  let template = await fetchResource(url);
  return resolveScript(template, url);
}

// 对html源码进行处理
export function resolveScript(template, activeUrl) {
  return template
    .replace(/<head[^>]*>[\s\S]*?<\/head>/i, (match) => {
      return match
        .replace(/<head/i, "<micro-app-head")
        .replace(/<\/head>/i, "</micro-app-head>");
    })
    .replace(/<body[^>]*>[\s\S]*?<\/body>/i, (match) => {
      return match
        .replace(/<body/i, "<micro-app-body")
        .replace(/<\/body>/i, "</micro-app-body>");
    })
    .replace(/src="(.*?)"/g, (_, text) => {
      sourceSet.add(`${activeUrl}${text}`);
      return `src="${activeUrl}${text}"`;
    })
    .replace(/href="(.*?)"/g, (_, text) => {
      return `href="${activeUrl}${text}"`;
    });
}

// 包装所有script脚本
function getExternalScript() {
  return Promise.all(Array.from(sourceSet).map((url) => fetchResource(url)));
}

// 执行脚本
export async function executeScript(document) {
  const scripts = await getExternalScript();
  scripts.forEach((code) => {
    (function (document) {
      eval(code);
    })(document);
  });
}
```

最终效果如下：
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c171a675b1e497fb956fdcca60fcbf6~tplv-k3u1fbpfcp-watermark.image?)
