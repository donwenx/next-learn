## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

```js
// 下载依赖
pnpm i 

// 启动程序
pnpm dev
```

## 静态渲染
- 使用静态渲染时，数据获取和渲染在构建时（部署时）或重新验证数据时在服务器上进行

- 好处：更快访问网站、减少服务器负担、SEO

- 静态渲染对于`没有数据`或`用户之间共享`的 UI 非常有用，例如静态博客文章或产品页面。它可能不太适合具有定期更新的个性化数据的仪表板。

## 动态渲染

- 使用动态渲染时，在请求时 （当用户访问页面时）为每个用户渲染服务器上的内容

- 好处：实时数据、特定于用户的内容（提供个性化内容，例如控制面板、用户配置文件）、请求时间信息（cookie或url搜索参数）

## 什么是流 streaming

- 流式处理是一种数据传输技术，它允许您将路由分解为更小的 “块”，并在它们准备就绪时逐步将它们从服务器流式传输到客户端。
- 并发渲染UI块，减少渲染时间

两种实现方法：
1. 在页面级别，使用 loading.tsx 文件（为您创建 <Suspense>）。
2. 在组件级别，使用 <Suspense> 进行更精细的控制。

## Suspense 组件

- 中文名可以理解为暂停or悬停 
- 那它暂停了什么？ 进行异步网络请求，然后再拿到请求后的数据进行渲染是很常见的需求，但这不可避免的需要先渲染一次没有数据的页面，数据返回后再去重新渲染。so , 我们想要暂停的就是第一次的无数据渲染。
- 通常我们在没有使用`Suspense` 时一般采用下面这种写法, 通过一个`isLoading`状态来显示加载中或数据。这样代码是不会有任何问题，但我们需要手动去维护一个`isLoading` 状态的值。

```tsx
return (
  <Suspense fallback={<Spinner />}>
    <MyComponent />
  </Suspense>
);
```
- 通过将`数据提取向下移动到需要它的组件`(<MyComponent />)，您可以创建更精细的 `Suspense` 边界。这允许您流式传输特定组件并防止 UI 阻塞。

- 你需要一整个页面加载，就用`loading.tsx`做整个骨架屏效果
- 如果`个别组件加载很慢`，可以每一个都封装成流，用`Suspense组件分装`, 创建交错效果
