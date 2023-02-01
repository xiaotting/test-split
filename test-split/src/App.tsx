import { Suspense } from "react";
import { About } from "./pages/About";

const isDemo = process.env.PRODUCT_ENV === "DEMO";

import "./App.less";

function App() {
  return (
    // 修复路由跳转多次异常 添加 Suspense 包裹
    <Suspense fallback={<div> loading</div>}>
      <About></About>
    </Suspense>
  );
}

export default App;
