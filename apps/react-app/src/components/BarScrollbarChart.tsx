import { useEffect, useRef } from "react"
import { Bar } from "@antv/g2plot"
import "./BarScrollbarChart.css"

const visibleBarCount = 5
const categorySize = 52
const chartHeight = visibleBarCount * categorySize + 92

const chartData = Array.from({ length: 30 }, (_, index) => {
  const rank = index + 1
  const label = `指标 ${String(rank).padStart(2, "0")}`

  return {
    scrollKey: `row-${String(rank).padStart(2, "0")}`,
    label,
    value: 920 - index * 23 + ((index * 17) % 41),
  }
})

const labelByScrollKey = new Map(chartData.map((item) => [item.scrollKey, item.label]))

function BarScrollbarChart() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const chart = new Bar(containerRef.current, {
      data: chartData,
      xField: "value",
      yField: "scrollKey",
      height: chartHeight,
      autoFit: true,
      appendPadding: [12, 20, 12, 8],
      barWidthRatio: 0.62,
      maxBarWidth: 28,
      scrollbar: {
        type: "vertical",
        categorySize,
        width: 10,
        style: {
          trackColor: "#e8eef7",
          thumbColor: "#7b8da8",
          thumbHighlightColor: "#405572",
          lineCap: "round",
        },
      },
      meta: {
        value: {
          alias: "得分",
        },
        label: {
          alias: "指标",
        },
        scrollKey: {
          alias: "指标",
        },
      },
      xAxis: {
        grid: {
          line: {
            style: {
              stroke: "#d9e2ef",
              lineDash: [4, 4],
            },
          },
        },
        line: null,
      },
      yAxis: {
        tickLine: null,
        line: null,
        label: {
          formatter: (text) => labelByScrollKey.get(String(text)) ?? String(text),
          style: {
            fill: "#34435d",
            fontSize: 12,
          },
        },
      },
      label: {
        position: "right",
        style: {
          fill: "#24324a",
          fontSize: 12,
          fontWeight: 600,
        },
      },
      tooltip: {
        fields: ["label", "value"],
      },
      color: ({ scrollKey }) => {
        const index = Number.parseInt(String(scrollKey).slice(-2), 10)

        return index <= visibleBarCount ? "#3867ff" : "#7aa5ff"
      },
    })
    let isSyncingAxis = false
    let lastVisibleDomain = ""
    const syncVisibleAxisDomain = () => {
      if (isSyncingAxis || chart.chart.destroyed) {
        return
      }

      const scrollbar = chart.chart.getController("scrollbar")
      const ratio = scrollbar.getValue()
      const startIndex = Math.floor((chartData.length - visibleBarCount) * ratio)
      const visibleDomain = chartData
        .slice(startIndex, startIndex + visibleBarCount)
        .map((item) => item.scrollKey)
      const nextVisibleDomain = visibleDomain.join("|")

      if (nextVisibleDomain === lastVisibleDomain) {
        return
      }

      lastVisibleDomain = nextVisibleDomain
      isSyncingAxis = true
      chart.chart.scale("scrollKey", {
        type: "cat",
        values: visibleDomain,
      })
      chart.chart.render(true)
      isSyncingAxis = false
    }

    chart.chart.on("afterrender", syncVisibleAxisDomain)
    chart.render()

    return () => {
      chart.chart.off("afterrender", syncVisibleAxisDomain)
      chart.destroy()
    }
  }, [])

  return (
    <section className="bar-scrollbar-card">
      <header className="bar-scrollbar-card__header">
        <div>
          <p className="bar-scrollbar-card__eyebrow">G2Plot Bar</p>
          <h2 className="bar-scrollbar-card__title">30 条数据的官方滚动条条形图</h2>
        </div>
        <div className="bar-scrollbar-card__metric" aria-label="当前可视条数">
          <span>{visibleBarCount}</span>
          <small>/ 30 可视</small>
        </div>
      </header>
      <div className="bar-scrollbar-chart" ref={containerRef} style={{ height: chartHeight }} />
    </section>
  )
}

export default BarScrollbarChart
