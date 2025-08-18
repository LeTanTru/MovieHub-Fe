- **params**: là promise, khai báo params: Promise<{key: value}>

- **generateStaticParams**: dùng để tạo SSG với dynamic route

- **enable**: enable trong TanStack Query cho phép fetch trước hay không

- **middleware**: dùng NextRequest, NextResponse

- **Tự động nhận diện type**: const define = <T>: (route: T) => route

- **Upload ảnh bằng fetch**: Không cần truyền header Content-Type multipart/form-data

- **Rendering Strategies**:
  **SSG**: user visits site, server response immediately, without extra work. Not suitable for Dynamic Content, live data, real time update.
  **SSR**: server generates the page every user makes a request, user gets most up-to-date content. Disadvantage is server must generate the page again and again for every single visitor.
  **ISR**: Hybrid strategy that combines the best of both works: Pre-building (SSG) and Fresh Content (SSR). Pre-generate the page just like SSG, but also define a time interval after which the page will re-generate it in the background.
  **CSR**: Entire JavaScript bundle is loaded in to the browser. So when a user navigate to a page, no new HTML fetched from the server. Once necessary, data is fetched and the browser builds the page using JS on the client side. So essential the cooking happens in the browser.

- **React Client Component & Server Component & RSC Payload**:
