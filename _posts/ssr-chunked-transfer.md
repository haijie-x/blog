---
title: "SSR Chunked Transfer"
excerpt: "SSR服务端渲染优化之分块/流式传输"
date: "2023-02-27T00:00:00.000Z"
---

## 背景

先让我们来回顾一下浏览器渲染的流程之一：服务器返回浏览器客户端一个 html 格式的 response 时，客户端会做什么事情？这个问题答案看似简单，但如果细问，可能会难倒大片同学。

简单的回答就是：浏览器收到 html 开始解析，遇到 css 时，并行构建 cssom 树、dom 树，遇到 js 脚本时，看是否带有 defer、async 属性，如果没有，则执行 js 脚本，阻塞解析，如果有，则继续解析.....

现在我们引出一个新的问题，此时服务端响应或者浏览器接收的 html 是完整的嘛，如果一个 html 请求 content-length 很长，我们是不是可以做出一些优化呢？即接收到一小块 html，就开始解析渲染，然后重复此步骤，直至完整的 html 渲染完成。

答案：我们可以做到，并且可以因此来实现服务端渲染的性能优化，让我们来看看为什么？

当用户打开网页时，收到的 HTML 的第一个 TCP 块都是 14kb。这是由于 TCP 慢启动算法为平衡传输速度所导致的，小的 HTML 文件可帮助浏览器在接收到第一个块时就能开始解析。确切地说，在前 14kb 中包含足够的数据将使页面的渲染速度更快，这就是我们所说的首页 14KB 原则。

> 在  [TCP 慢启动](https://developer.mozilla.org/zh-CN/docs/Glossary/TCP_slow_start)  中，在收到初始包之后，服务器会将下一个数据包的大小加倍到大约 28KB。后续的数据包依次是前一个包大小的二倍直到达到预定的阈值，或者遇到拥塞。而一旦浏览器在收到数据的第一块，便可以开始解析收到的信息了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3156b667b84e4406ab97ae1a810736fc~tplv-k3u1fbpfcp-watermark.image?)

## 目标

在做 ssr 渲染时，服务器同构处理组件，将处理结果以流的形式 pipe 给服务器的输出，而不是等全部组件处理完毕后将字符串作为结果输出，这样我们就实现了分块（流失）传输。

## 实现

这边我们搭建最简单的 http 服务，来模拟一个 html 请求，同时 sleep 模拟一些数据异步请求，阻塞传输。

```js
const http = require("http");
const { Readable } = require("stream");
const url = require("url");

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);
  if (pathname === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    // 设置分块传输（基于http1.1协议）
    res.setHeader("Transfer-Encoding", "chunked");
    const readable = new Readable.from([
      "<html><body><div>First segment</div>",
      "<div>Second segment</div>",
      sleep(2000).then(() => {
        return "<div>third segment</div>";
      }),
      "<div>fourth segment</div></body></html>",
    ]);
    readable.pipe(res);
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("okay");
});

server.listen(8080);
```

## 效果

![ezgif.com-video-to-gif.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7af7ae9b85d479fa114a638583ec958~tplv-k3u1fbpfcp-watermark.image?)

## 拓展

React 18 向开发者提供了 `renderToPipeableStream` API。通过 流传输 以及 `Suspense + Lazyload` ，大幅度解决了 服务端、客户端同构模式下的 ssr 的问题 —— TTI 时间过慢。

特点如下：

- 服务端分块传输，浏览器对于 HTML 的解析、渲染更快开始，FP/FCP 更快。
- 浏览器 hydration 阶段无需等待所有组件的 JS bundle 加载完成，再进行 hydration。这意味着对于已渲染模块可以进行相关的事件绑定，提升 TTI 时间，其余区域可以等 bundle 加载完后，再进行渲染、激活事件。
