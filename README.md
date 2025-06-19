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

