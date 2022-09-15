import { useState } from "react"
import { Icon, Table } from "adui"
import { Link } from "react-router-dom"
//@ts-ignore
import SyntaxHighlighter from "react-syntax-highlighter"
//@ts-ignore
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs"
import dataSource from "./dataSource.json"

function PageIndex() {
  return (
    <div>
      <header className="sticky top-0 z-1230 bg-white shadow-1">
        <div className="relative flex items-center justify-between mx-auto px-48 max-w-1800 h-92">
          <a
            className="absolute right-48 top-1/2 -translate-y-1/2"
            href="https://github.com/wxad/pixie"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16 0C7.16 0 0 7.16 0 16C0 23.08 4.58 29.06 10.94 31.18C11.74 31.32 12.04 30.84 12.04 30.42C12.04 30.04 12.02 28.78 12.02 27.44C8 28.18 6.96 26.46 6.64 25.56C6.46 25.1 5.68 23.68 5 23.3C4.44 23 3.64 22.26 4.98 22.24C6.24 22.22 7.14 23.4 7.44 23.88C8.88 26.3 11.18 25.62 12.1 25.2C12.24 24.16 12.66 23.46 13.12 23.06C9.56 22.66 5.84 21.28 5.84 15.16C5.84 13.42 6.46 11.98 7.48 10.86C7.32 10.46 6.76 8.82 7.64 6.62C7.64 6.62 8.98 6.2 12.04 8.26C13.32 7.9 14.68 7.72 16.04 7.72C17.4 7.72 18.76 7.9 20.04 8.26C23.1 6.18 24.44 6.62 24.44 6.62C25.32 8.82 24.76 10.46 24.6 10.86C25.62 11.98 26.24 13.4 26.24 15.16C26.24 21.3 22.5 22.66 18.94 23.06C19.52 23.56 20.02 24.52 20.02 26.02C20.02 28.16 20 29.88 20 30.42C20 30.84 20.3 31.34 21.1 31.18C24.2763 30.1077 27.0363 28.0664 28.9917 25.3432C30.947 22.6201 31.9991 19.3524 32 16C32 7.16 24.84 0 16 0Z"
                fill="rgba(0, 0, 0, 0.38)"
              />
            </svg>
          </a>
          <div>
            <h1
              style={{ fontFamily: "gilroybold" }}
              className="flex items-center font-bold text-34 text-black tracking-1"
            >
              <svg className="mr-4" width="34" height="34" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3 3v18h18V3H3zm16 2v14H5V5h14zM7 7h6v6H9v2H7V7zm8 6h-2v2h-2v2h2v-2h2v2h2v-2h-2v-2zm0 0h2v-2h-2v2zM9 9v2h2V9H9z"
                />
              </svg>
              Pixie
            </h1>
            <h2
              style={{ fontFamily: "gilroysemibold" }}
              className="pl-42 font-bold text-12 text-black text-opacity-50 tracking-1"
            >
              from WeChat Ads Design.
            </h2>
          </div>
        </div>
      </header>
      <div className="my-48 mx-auto px-48 max-w-1800 text-14 font-medium">
        Pixie 是一个小小的 demo。它是用来走查响应式设计的。
      </div>
      <div className="mx-auto max-w-1800">
        <div className="pt-28 px-48">
          <div className="flex items-center mb-16 text-20 font-bold">
            走查列表
          </div>
          <Table
            dataSource={dataSource}
            columns={[
              {
                dataIndex: "0",
                title: "序号",
                width: 50,
                render: (_, __, rowIndex) => rowIndex + 1,
              },
              {
                dataIndex: "name",
                title: "项目名称",
              },
              {
                dataIndex: "breakpoints",
                title: "项目断点",
                grow: true,
                render: ({ breakpoints }) => breakpoints.join(", "),
              },
              {
                dataIndex: "url",
                title: "项目地址",
              },
              {
                dataIndex: "进入走查",
                title: "进入走查",
                align: "center",
                render: ({ url, breakpoints }) => (
                  <Link
                    to={`/review?url=${url}&breakpoints=${breakpoints.join(
                      ","
                    )}`}
                  >
                    <Icon icon="arrow-forward" onClick={() => {}} />
                  </Link>
                ),
                width: 100,
              },
            ]}
          />
        </div>
        <div className="pt-28 px-48">
          <div className="flex items-center mb-16 text-20 font-bold">
            组件使用
            <span className="ml-4 inline-block p-6 font-normal text-14 leading-16 text-tp-700 bg-gray-50 rounded-4">
              hook
            </span>
          </div>
          <div className="mb-36 px-16 py-12 bg-gray-50 rounded-6 shadow-1-gray-200">
            <SyntaxHighlighter
              wrapLines
              customStyle={{ backgroundColor: "transparent" }}
              linenumberstyle={{ color: "#bab6b6" }}
              className="highlight"
              language="javascript"
              style={atomOneLight}
            >
              {`const { dom } = useDesignCheck({
  designs: {
    375: 'https://wxa.wxs.qq.com/wxad-design/yijie/case-test-3755.png',
    1024: 'https://wxa.wxs.qq.com/wxad-design/yijie/case-test-1024.png',
    1200: 'https://wxa.wxs.qq.com/wxad-design/yijie/case-test-1200.png',
    1440: 'https://wxa.wxs.qq.com/wxad-design/yijie/case-test-1440.jpg',
    1920: 'https://wxa.wxs.qq.com/wxad-design/yijie/case-test-19200.png'
  }
});`}
            </SyntaxHighlighter>
          </div>
          <div className="flex items-center mb-16 text-20 font-bold">
            DOM
            <span className="ml-4 inline-block p-6 font-normal text-14 leading-16 text-tp-700 bg-gray-50 rounded-4">
              JSX
            </span>
          </div>
          <div className="mb-36 px-16 py-12 bg-gray-50 rounded-6 shadow-1-gray-200">
            <SyntaxHighlighter
              style={atomOneLight}
              wrapLines
              customStyle={{ backgroundColor: "transparent" }}
              linenumberstyle={{ color: "#bab6b6" }}
              className="highlight"
              language="xml"
            >
              {`// 将 dom 插入到滚动容器中
<body>
  { dom }
</body>`}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
      <div className="mt-140 py-56 text-13 text-tp-600 bg-gray-50 shadow-1-t-gray-200">
        <svg
          className="block mx-auto mb-32"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="#07c160"
        >
          <path d="M3 3v18h18V3H3zm16 2v14H5V5h14zM7 7h6v6H9v2H7V7zm8 6h-2v2h-2v2h2v-2h2v2h2v-2h-2v-2zm0 0h2v-2h-2v2zM9 9v2h2V9H9z" />
        </svg>
        <div className="text-center mx-auto px-48 max-w-1800">
          <div className="flex justify-center">
            <div className="relative mr-1 w-30 h-30 bg-tp-400 rounded-b-full">
              <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gray-50 rounded-tl-full rounded-br-full" />
            </div>
            <div className="mr-1 relative w-30 h-30">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-tp-400 rounded-tr-full rounded-bl-full" />
              <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-tp-400 rounded-tl-full rounded-br-full" />
              <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-tp-400 rounded-tr-full rounded-bl-full" />
              <div className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-tp-400 rounded-tl-full rounded-br-full" />
            </div>
            <div className="w-30 h-30">
              <div className="mb-3 h-8 bg-tp-400" />
              <div className="mb-3 h-8 bg-tp-400" />
              <div className="h-8 bg-tp-400" />
            </div>
          </div>
          <div className="mt-8">aragakey@qq.com</div>
        </div>
      </div>
    </div>
  )
}

export default PageIndex
