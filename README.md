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

## Partial Prerendering 部分预处理

- 不依赖数据：静态的static
- 依赖经常更改的数据：动态的dynamic

部分预渲染上下文中的holes 漏洞是什么？
- 动态内容将异步加载的位置

使用方法：
1. 启用 Partial Prerendering (部分预处理)
```js
// next.config.ts
import type { NextConfig } from 'next';
 
const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental'
  }
};
 
export default nextConfig;
```

2. 只要在`静态文件中配置`,剩下的动态部分用 `Suspend` 分装，next.js就会知道路由哪些部分是动态和静态
```js
// app\dashboard\layout.tsx
export const experimental_ppr = true;
```

## use client 指令

在 Next.js 中，`use client` 指令用于指定某个组件应作为客户端组件（Client Component）运行。
默认情况下，Next.js 中的组件都是服务端组件（Server Component）。
客户端组件允许使用诸如 `useState`、`useEffect` 等 React 钩子，以及事件处理函数如 `onClick`


## 添加搜索和分页

### 钩子函数

- `useSearchParams`- 允许您访问当前 URL 的参数。例如，此 `URL /dashboard/invoices?page=1&query=pending` 的搜索参数将如下所示：`{page： '1'， query： 'pending'}`。
- `usePathname` - 允许您读取当前 URL 的路径名。例如，对于路由 `/dashboard/invoices`，usePathname 将返回 `/dashboard/invoices`。
- `useRouter` - 以编程方式在客户端组件内的路由之间启用导航。您可以使用多种方法 。

- `URLSearchParams` 是一个 Web API，它提供用于作 URL 查询参数的实用工具方法。您可以使用它来获取参数字符串，而不是创建复杂的字符串文本，例如 `?page=1&query=a`。

### 去抖动
去抖动的工作原理：
1. Trigger Event：当应该去抖动的事件（如搜索框中的击键）发
2. Wait等待 ：如果在计时器过期之前发生了新事件，则重置计时器。
3. Execution执行 ：如果计时器到达倒计时结束，则执行 debounced 函数。

- 或者使用一个名为 `use-debounce` 的库。

```js
// pnpm i use-debounce
import { useDebouncedCallback } from 'use-debounce';

// 在函数是使用
const handlerSearch = useDebouncedCallback(() => {
  // 执行事件等等...
},300)
```

## 更改数据

- 可以使用 Zod，这是一个 TypeScript 优先的验证库，

使用
```ts
 
import { z } from 'zod';
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // amount 字段专门设置为从字符串强制 （更改） 为数字，同时还验证其类型。
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });

```
然后，您可以将 `formData` 传递给 `CreateInvoice` 以验证类型：
```ts
// ...
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
}
```

### 重新验证和重定向
```js
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

revalidatePath('/dashboard/invoices'); // 更新数据库后，将重新验证 /dashboard/invoices 路径，并从服务器获取新数据。
redirect('/dashboard/invoices'); // 重定向回 /dashboard/invoices 页面。
```

## 错误处理

- 可以使用 `error.tsx` 处理
- 也可以使用 `not-found.tsx` 处理
- notFound 将优先于 error.tsx

### error 使用
```ts
// 任意页面中
// 抛出了错误，就会触发error.tsx
  throw new Error('');
```

```tsx
// error.tsx
'use client'

import { useEffect } from "react"

export default function Error({
  error,
  reset,
} : {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 可选地将错误记录到错误报告服务
    console.error(error)
  }, [error]);

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}
```

### notFound 使用：
```tsx
import Link from "next/link";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested invoice.</p>
      <Link
        href="/dashboard/invoices"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        Go Back
      </Link>
    </main>
  );
}
```

```ts
// page.tsx
import { notFound } from 'next/navigation';

// 需要再使用的页面中引入，并调用处理
// 错误处理
if(!invoice) {
  notFound();
}
```
