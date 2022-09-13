import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Icon, Tooltip } from "adui"
import { useSpring, animated, to } from "@react-spring/web"
import { useDrag, useMove } from "@use-gesture/react"
import useWindowResize from "./use-window-resize"

const getUrlParams = (): { [key: string]: string } => {
  const search = location.search.slice(1)
  const arr = search.split("&")
  const result = {} as any
  let temp = [] as string[]

  for (let i = 0, l = arr.length; i < l; i++) {
    temp = arr[i].split("=")
    result[temp[0]] = decodeURIComponent(temp[1])
  }
  return result
}

function Review() {
  const { hash } = location
  const urlIndex = hash.indexOf("url=")
  const widthsIndex = hash.indexOf("breakpoints=")
  const url = hash.slice(urlIndex + 4, widthsIndex - 1)
  const widths = hash
    .slice(widthsIndex + 12)
    .split(",")
    .map((o) => Number(o))

  const [currentWidth, setcurrentWidth] = useState(widths[0])
  const latestCurrentWidth = useRef(currentWidth)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [{ currentHeight }, api] = useSpring(() => ({
    currentHeight: 700,
  }))

  const bindDrag = useDrag(
    ({ movement: [, my], initial: [, iy], active, event }) => {
      event.preventDefault()
      api({
        currentHeight: Math.max(
          Math.min(my + iy - 40, window.innerHeight - 40),
          375
        ),
        immediate: active,
      })
    }
  )

  useWindowResize(() => {
    setTimeout(() => {
      if (!widths.includes(latestCurrentWidth.current)) {
        setcurrentWidth(window.innerWidth)
      }
    }, 0)
  })

  useEffect(() => {
    latestCurrentWidth.current = currentWidth
    if (currentWidth === window.innerWidth) {
      api({
        currentHeight: window.innerHeight - 40,
        immediate: true,
      })
    } else {
      api({
        currentHeight: currentWidth < 700 ? 700 : (window.innerHeight * 3) / 4,
        immediate: true,
      })
    }

    if (currentWidth > window.innerWidth) {
      if (wrapperRef.current) {
        // @ts-ignore
        // wrapperRef.current.style.zoom = `${window.innerWidth / currentWidth}`
      }
    }
  }, [currentWidth])

  return (
    <div className="pt-40 w-screen h-screen bg-gray-900 select-none">
      <div className="absolute top-0 left-0 flex items-center justify-between px-20 w-full h-40 bg-#35363A">
        <div className="flex items-center">
          <div className="flex items-center">
            <Link to="/">
              <svg
                className="block mr-20"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#86888A"
              >
                <path d="M3 3v18h18V3H3zm16 2v14H5V5h14zM7 7h6v6H9v2H7V7zm8 6h-2v2h-2v2h2v-2h2v2h2v-2h-2v-2zm0 0h2v-2h-2v2zM9 9v2h2V9H9z" />
              </svg>
            </Link>
            {widths.map((s) => (
              <div
                key={s}
                className={`flex items-center justify-center px-8 h-40 cursor-pointer transition-all border-r-1 border-solid border-r-#282828 ${
                  currentWidth === s
                    ? "text-white bg-green font-gilroy-bold"
                    : "text-#86888A hover:text-white hover:bg-white hover:bg-opacity-5 font-gilroy-semibold"
                }`}
                onClick={() =>
                  setcurrentWidth(s === currentWidth ? window.innerWidth : s)
                }
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <Icon
            icon="play-circle-outlined"
            className="mr-8"
            size={20}
            onClick={() => {}}
          />
          <Icon
            icon="refresh"
            size={20}
            onClick={() => {
              // iframeRef.current!.contentWindow!.location.reload()
              // get iframe's window document body
              const iframe = iframeRef.current
              const iframeWindow = iframe!.contentWindow
              const iframeDocument = iframeWindow!.document
              const iframeBody = iframeDocument.body
              console.log("yijie", iframeWindow, iframeDocument, iframeBody)
            }}
          />
        </div>
      </div>
      <animated.div
        className="relative mx-auto"
        style={{
          width: currentWidth,
          height: currentHeight,
        }}
        ref={wrapperRef}
      >
        <iframe
          ref={iframeRef}
          id="content"
          name="content"
          frameBorder="0"
          src="https://wxa.wxs.qq.com/wxad-design/wxad/22-09-13/index.html#/best-moments"
          className="relative w-full h-full border-none bg-white z-10"
        />
        {currentWidth !== window.innerWidth && (
          <div
            className="absolute -bottom-20 left-0 w-full h-20 opacity-30 color-#fff hover:opacity-70 touch-none"
            style={{
              cursor: "ns-resize",
            }}
            {...bindDrag()}
          >
            <i className="absolute top-full left-1/2 w-32 h-6 -mt-6 -ml-16 bg-current" />
          </div>
        )}
      </animated.div>
    </div>
  )
}

export default Review
