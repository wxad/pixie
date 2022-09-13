// @ts-nocheck
import react from "@vitejs/plugin-react"
import { aduiIconPlugin, aduiImportPlugin } from "adui/rollup-plugin-adui.js"
import { defineConfig } from "vite"
import Unocss from "unocss/vite"
import type { CSSValues, Rule } from "@unocss/core"
import { presetUno, presetAttributify } from "unocss"
import {
  directionSize,
  handler as h,
  xyzMap,
  variantMatcher,
} from "@unocss/preset-mini/utils"

const CONTROL_BYPASS_PSEUDO_CLASS = "$$no-pseudo"

const transformGpu = {
  transform:
    "translate3d(var(--un-translate-x), var(--un-translate-y), var(--un-translate-z)) rotate(var(--un-rotate)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y))",
  [CONTROL_BYPASS_PSEUDO_CLASS]: "",
}

const transformCpu = {
  transform:
    "translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y))",
  [CONTROL_BYPASS_PSEUDO_CLASS]: "",
}

const transformBase = {
  "--un-rotate": 0,
  "--un-scale-x": 1,
  "--un-scale-y": 1,
  "--un-scale-z": 1,
  "--un-skew-x": 0,
  "--un-skew-y": 0,
  "--un-translate-x": 0,
  "--un-translate-y": 0,
  "--un-translate-z": 0,
  ...transformCpu,
}

function handleTranslate([, d, b]: string[]): CSSValues | undefined {
  const v = h.bracket.fraction.auto.px(b)
  if (v != null) {
    return [
      transformBase,
      [...xyzMap[d].map((i): [string, string] => [`--un-translate${i}`, v])],
    ]
  }
}

function handleScale([, d, b]: string[]): CSSValues | undefined {
  const v = h.bracket.fraction.percent(b)
  if (v != null) {
    return [
      transformBase,
      [...xyzMap[d].map((i): [string, string] => [`--un-scale${i}`, v])],
    ]
  }
}

function handleRotateWithUnit([, b]: string[]): CSSValues | undefined {
  const v = h.bracket.number(b)
  if (v != null) {
    return [transformBase, { "--un-rotate": `${v}deg` }]
  }
}

function handleRotate([, b]: string[]): CSSValues | undefined {
  const v = h.bracket(b)
  if (v != null) {
    return [transformBase, { "--un-rotate": v }]
  }
}

function handleSkewWithUnit([, d, b]: string[]): CSSValues | undefined {
  const v = h.bracket.number(b)
  if (v != null) {
    return [transformBase, { [`--un-skew-${d}`]: `${v}deg` }]
  }
}

function handleSkew([, d, b]: string[]): CSSValues | undefined {
  const v = h.bracket(b)
  if (v != null) {
    return [transformBase, { [`--un-skew-${d}`]: v }]
  }
}

const colors = {
  transparent: "transparent",
  current: "currentColor",
  black: "#000",
  white: "#fff",
  green: "#07c160",
  orange: "#eda20c",
  blue: "#2b7bd6",
  red: "#d9514c",
  gray: {
    0: "#ffffff",
    50: "#fafafa",
    100: "#f2f2f2",
    200: "#ebebeb",
    300: "#e6e6e6",
    400: "#e0e0e0",
    500: "#d6d6d6",
    600: "#c7c7c7",
    700: "#a3a3a3",
    800: "#6b6b6b",
    900: "#1f1f1f",
  },
  tp: {
    0: "rgba(0, 0, 0, 0)",
    50: "rgba(0, 0, 0, 0.02)",
    100: "rgba(0, 0, 0, 0.06)",
    200: "rgba(0, 0, 0, 0.08)",
    300: "rgba(0, 0, 0, 0.1)",
    400: "rgba(0, 0, 0, 0.12)",
    500: "rgba(0, 0, 0, 0.16)",
    600: "rgba(0, 0, 0, 0.22)",
    700: "rgba(0, 0, 0, 0.36)",
    800: "rgba(0, 0, 0, 0.58)",
    900: "rgba(0, 0, 0, 0.88)",
  },
}

/**
 * 对 t r b l 四个方向单面的 1px shadow
 */
const shadows = {}
;["1", "2"].forEach((length) => {
  const prefix = `${length}-`
  Object.keys(colors).forEach((key) => {
    const value = colors[key]
    if (typeof value === "string") {
      shadows[`${prefix}${key}`] = `0 0 0 ${length}px ${value}`
      shadows[`${prefix}inset-${key}`] = `0 0 0 ${length}px ${value} inset`
      shadows[`${prefix}t-${key}`] = `0 -${length}px 0 ${value}`
      shadows[`${prefix}t-inset-${key}`] = `0 ${length}px 0 ${value} inset`
      shadows[`${prefix}b-${key}`] = `0 ${length}px 0 ${value}`
      shadows[`${prefix}b-inset-${key}`] = `0 -${length}px 0 ${value} inset`
      shadows[`${prefix}r-${key}`] = `${length}px 0 0 ${value}`
      shadows[`${prefix}r-inset-${key}`] = `-${length}px 0 0 ${value} inset`
      shadows[`${prefix}l-${key}`] = `-${length}px 0 0 ${value}`
      shadows[`${prefix}l-inset-${key}`] = `${length}px 0 0 ${value} inset`
      shadows[
        `${prefix}x-${key}`
      ] = `-${length}px 0 0 ${value}, ${length}px 0 0 ${value}`
      shadows[
        `${prefix}x-inset-${key}`
      ] = `-${length}px 0 0 ${value} inset, ${length}px 0 0 ${value} inset`
      shadows[
        `${prefix}y-${key}`
      ] = `0 -${length}px 0 ${value}, 0 ${length}px 0 ${value}`
      shadows[
        `${prefix}y-inset-${key}`
      ] = `0 -${length}px 0 ${value} inset, 0 ${length}px 0 ${value} inset`
    } else {
      Object.keys(value).forEach((valKey) => {
        shadows[
          `${prefix}${key}-${valKey}`
        ] = `0 0 0 ${length}px ${value[valKey]}`
        shadows[
          `${prefix}inset-${key}-${valKey}`
        ] = `0 0 0 ${length}px ${value[valKey]} inset`
        shadows[
          `${prefix}t-${key}-${valKey}`
        ] = `0 -${length}px 0 ${value[valKey]}`
        shadows[
          `${prefix}t-inset-${key}-${valKey}`
        ] = `0 ${length}px 0 ${value[valKey]} inset`
        shadows[
          `${prefix}b-${key}-${valKey}`
        ] = `0 ${length}px 0 ${value[valKey]}`
        shadows[
          `${prefix}b-inset-${key}-${valKey}`
        ] = `0 -${length}px 0 ${value[valKey]} inset`
        shadows[
          `${prefix}r-${key}-${valKey}`
        ] = `${length}px 0 0 ${value[valKey]}`
        shadows[
          `${prefix}r-inset-${key}-${valKey}`
        ] = `-${length}px 0 0 ${value[valKey]} inset`
        shadows[
          `${prefix}l-${key}-${valKey}`
        ] = `-${length}px 0 0 ${value[valKey]}`
        shadows[
          `${prefix}l-inset-${key}-${valKey}`
        ] = `${length}px 0 0 ${value[valKey]} inset`
        shadows[
          `${prefix}x-${key}-${valKey}`
        ] = `-${length}px 0 0 ${value[valKey]}, ${length}px 0 0 ${value[valKey]}`
        shadows[
          `${prefix}x-inset-${key}-${valKey}`
        ] = `-${length}px 0 0 ${value[valKey]} inset, ${length}px 0 0 ${value[valKey]} inset`
        shadows[
          `${prefix}y-${key}-${valKey}`
        ] = `0 -${length}px 0 ${value[valKey]}, 0 ${length}px 0 ${value[valKey]}`
        shadows[
          `${prefix}y-inset-${key}-${valKey}`
        ] = `0 -${length}px 0 ${value[valKey]} inset, 0 ${length}px 0 ${value[valKey]} inset`
      })
    }
  })
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    aduiImportPlugin(),
    // aduiIconPlugin({})
    Unocss({
      presets: [presetUno()],
      theme: {
        colors,
        boxShadow: {
          none: "none",
          0: "0 0 0 1px rgba(223, 223, 223, 0.45)",
          1: "0 0 0 1px rgba(223, 223, 223, 0.5), 0 3px 6px 0 rgba(0, 0, 0, 0.04)",
          2: "0 0 0 1px rgba(219, 219, 219, 0.55),0 3px 5px 0 rgba(0, 0, 0, 0.05), 0 6px 15px 0 rgba(0, 0, 0, 0.05)",
          3: "0 0 0 1px rgba(219, 219, 219, 0.7), 0 8px 20px 0 rgba(0, 0, 0, 0.08), 0 4px 10px 0 rgba(0, 0, 0, 0.07)",
          4: "0 0 0 1px rgba(107, 107, 107, 0.15), 0 10px 36px 0 rgba(0, 0, 0, 0.1), 0 6px 15px 0 rgba(0, 0, 0, 0.07)",
          ...shadows,
          caseCard:
            "0px 4px 10px 0px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, .03)",
          caseCardHover:
            "0 8px 16px 0 rgba(0, 0, 0, .05), 0 0 0 1px rgba(0, 0, 0, .03)",
          caseSelect: "0 8px 16px 0 rgba(0, 0, 0, .05)",
          caseTag: "0 4px 30px 0 rgb(0 0 0 / 3%)",
          commonCard:
            "0 0 0 1px rgba(0, 0, 0, 0.06), 0 8px 20px 0 rgba(0, 0, 0, .02)",
          commonActiveCard:
            "0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 10px 0 rgba(0, 0, 0, .04)",
          commonHoverCard:
            "0 0 0 1px rgba(0, 0, 0, 0.05), 0 8px 20px 0 rgba(0, 0, 0, .02)",
          industrySelect:
            "0px 0px 0px 1px rgba(0, 0, 0, 0.03), 0px 4px 10px 0px rgba(0, 0, 0, 0.02)",
          industrySelectHover:
            "0px 0px 0px 1px rgba(0, 0, 0, 0.03), 0px 8px 16px 0px rgba(0, 0, 0, 0.05)",
          industrySelectActive:
            "0px 0px 0px 1px rgba(0, 0, 0, 0.03), 0px 8px 16px 0px rgba(0, 0, 0, 0.05)",
          selectHover: "0 3px 3px 0 rgba(0,0,0,.03), 0 0 0 1px var(--gray-500)",
        },
        breakpoints: {
          400: "400px",
          500: "500px",
          568: "568px",
          700: "700px",
          768: "768px",
          900: "900px",
          960: "960px",
          1024: "1024px",
          1200: "1200px",
          1280: "1280px",
          1440: "1440px",
          1600: "1600px",
          1920: "1920px",
        },
      },
      rules: [
        [
          /^(?:flex-|grid-)?gap-(x-|y-)?([^-]+)$/,
          ([, d = "", s]) => {
            const v = h.bracket.auto.px(s)
            if (v != null) {
              const direction = {
                "": "",
                "x-": "column-",
                "y-": "row-",
              }[d]

              return {
                [`grid-${direction}gap`]: v,
                [`${direction}gap`]: v,
              }
            }
          },
        ],
        ["grid-flow-col", { "grid-auto-flow": "column" }],
        ["grid-flow-row", { "grid-auto-flow": "row" }],
        [/^top-(\d+)$/, ([, d]) => ({ top: `${d}px` })],
        [/^right-(\d+)$/, ([, d]) => ({ right: `${d}px` })],
        [/^bottom-(\d+)$/, ([, d]) => ({ bottom: `${d}px` })],
        [/^left-(\d+)$/, ([, d]) => ({ left: `${d}px` })],
        [
          /^space-?([xy])-?(-?.+)$/,
          (match) => {
            const [, direction, size] = match
            if (size === "reverse")
              return { [`--un-space-${direction}-reverse`]: 1 }

            const results =
              directionSize("margin")(match) &&
              directionSize("margin")(match).map((item) => {
                const value =
                  item[0].endsWith("right") || item[0].endsWith("bottom")
                    ? `calc(${size}px * var(--un-space-${direction}-reverse))`
                    : `calc(${size}px * calc(1 - var(--un-space-${direction}-reverse)))`
                return [item[0], value] as typeof item
              })
            if (results) {
              return [[`--un-space-${direction}-reverse`, 0], ...results]
            }
          },
        ],
        [/^m-(\d+)$/, ([, d]) => ({ margin: `${d}px` })],
        [
          /^mx-(\d+)$/,
          ([, d]) => ({ "margin-left": `${d}px`, "margin-right": `${d}px` }),
        ],
        [/^ml-(\d+)$/, ([, d]) => ({ "margin-left": `${d}px` })],
        [/^mr-(\d+)$/, ([, d]) => ({ "margin-right": `${d}px` })],
        [
          /^my-(\d+)$/,
          ([, d]) => ({ "margin-top": `${d}px`, "margin-bottom": `${d}px` }),
        ],
        [/^mt-(\d+)$/, ([, d]) => ({ "margin-top": `${d}px` })],
        [/^mb-(\d+)$/, ([, d]) => ({ "margin-bottom": `${d}px` })],
        [/^p-(\d+)$/, ([, d]) => ({ padding: `${d}px` })],
        [
          /^px-(\d+)$/,
          ([, d]) => ({ "padding-left": `${d}px`, "padding-right": `${d}px` }),
        ],
        [/^pl-(\d+)$/, ([, d]) => ({ "padding-left": `${d}px` })],
        [/^pr-(\d+)$/, ([, d]) => ({ "padding-right": `${d}px` })],
        [
          /^py-(\d+)$/,
          ([, d]) => ({ "padding-top": `${d}px`, "padding-bottom": `${d}px` }),
        ],
        [/^pt-(\d+)$/, ([, d]) => ({ "padding-top": `${d}px` })],
        [/^pb-(\d+)$/, ([, d]) => ({ "padding-bottom": `${d}px` })],
        [/^w-(\d+)$/, ([, d]) => ({ width: `${d}px` })],
        [/^h-(\d+)$/, ([, d]) => ({ height: `${d}px` })],
        [/^max-w-(\d+)$/, ([, d]) => ({ "max-width": `${d}px` })],
        [/^max-h-(\d+)$/, ([, d]) => ({ "max-height": `${d}px` })],
        [/^min-w-(\d+)$/, ([, d]) => ({ "min-width": `${d}px` })],
        [/^min-h-(\d+)$/, ([, d]) => ({ "min-height": `${d}px` })],
        [/^text-(\d+)$/, ([, d]) => ({ "font-size": `${d}px` })],
        [/^tracking-(\d+)$/, ([, d]) => ({ "letter-spacing": `${d}px` })],
        [/^leading-(\d+)$/, ([, d]) => ({ "line-height": `${d}px` })],
        [/^rounded-(\d+)$/, ([, d]) => ({ "border-radius": `${d}px` })],
        [
          /^rounded-t-(\d+)$/,
          ([, d]) => ({
            "border-top-left-radius": `${d}px`,
            "border-top-right-radius": `${d}px`,
          }),
        ],
        [
          /^rounded-b-(\d+)$/,
          ([, d]) => ({
            "border-bottom-left-radius": `${d}px`,
            "border-bottom-right-radius": `${d}px`,
          }),
        ],
        ["transform", transformBase],
        [/^translate()-(.+)$/, handleTranslate],
        [/^translate-([xyz])-(.+)$/, handleTranslate],
        [/^scale()-(.+)$/, handleScale],
        [/^scale-([xyz])-(.+)$/, handleScale],
        [/^rotate-(.+)$/, handleRotate],
        [/^rotate-((?!\[)[^-]+?)(?:deg)?$/, handleRotateWithUnit],
        [/^skew-([xy])-(.+)$/, handleSkew],
        [/^skew-([xy])-((?!\[)[^-]+?)(?:deg)?$/, handleSkewWithUnit],
        ["transform-gpu", transformGpu],
        ["transform-cpu", transformCpu],
        [
          "ease-athletic",
          { "transition-timing-function": "cubic-bezier(0.87, 0, 0.13, 1)" },
        ],
        ["font-gilroy-semibold", { "font-family": "gilroysemibold" }],
        ["font-gilroy-bold", { "font-family": "gilroybold" }],
      ],
      shortcuts: [
        {
          "absolute-full": "absolute top-0 left-0 w-full h-full",
        },
      ],
      variants: [
        (v) => {
          const desktop = variantMatcher("desktop")(v)
          if (desktop) {
            return {
              ...desktop,
              parent: "@media (any-hover: hover)",
            }
          }
          const mobile = variantMatcher("mobile")(v)
          if (mobile) {
            return {
              ...mobile,
              parent: "@media (any-hover: none)",
            }
          }
        },
      ],
    }),
  ],
  server: {
    hmr: {
      protocol: "ws",
      host: "localhost",
    },
  },
})
