'use client'
import { cn } from '@/libraries/utils'
import { init, registerTheme } from 'echarts'
import { useEffect, useRef, useState } from 'react'
import ChartConfig from '@/config/charts.json'
import { useTheme } from 'next-themes'
export interface IChartProps {
  data: IPayloadDataChart[]
  options?: any
  className?: string | string[]
  types?: 'nightingale' | 'referer' | 'donut' | 'haftDonut'
}

export interface IPayloadDataChart {
  value: number | string
  name: string
}

const DonutChart = ({ options, data, className, types = 'donut' }: IChartProps) => {
  const chartRef = useRef(null)
  const chartConfig = JSON.parse(JSON.stringify(ChartConfig))
  const [configTheme, setConfigTheme] = useState<{
    borderColor: string
    textColor: string
  }>({
    borderColor: '#161a1d',
    textColor: '#fffF'
  })
  const { theme } = useTheme()
  useEffect(() => {
    setConfigTheme({
      borderColor: theme === 'dark' ? '#161a1d' : '#fff',
      textColor: theme === 'dark' ? '#fff' : '#161a1d'
    })
  }, [theme])
  const chartOptions: {
    [key: string]: any
  } = {
    donut: {
      tooltip: { trigger: 'item' },
      legend: {
        bottom: '0%',
        left: 'center',
        textStyle: { color: configTheme.textColor },
        orient: 'horizontal',
        type: 'plain'
      },
      grid: {
        top: 20,
        bottom: 60,
        left: 20,
        right: 20,
        containLabel: true
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['30%', '65%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 10,
            borderColor: configTheme.borderColor,
            borderWidth: 5
          },
          label: {
            fontSize: '10',
            color: configTheme.textColor,
            position: 'outside',
            alignTo: 'none'
          },
          data
        }
      ]
    },
    nightingale: {
      legend: { top: 'bottom', textStyle: { color: configTheme.textColor } },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true }
        }
      },
      tooltip: { trigger: 'item' },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: [50, 150],
          center: ['50%', '40%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 10,
            borderColor: configTheme.borderColor
          },
          label: {
            fontSize: '10',
            color: configTheme.textColor
          },
          data
        }
      ]
    },
    referer: {
      tooltip: { trigger: 'item' },
      legend: {
        orient: 'vertical',
        left: 'bottom',
        textStyle: { color: configTheme.textColor }
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: '80%',
          data,
          label: {
            fontSize: '10',
            color: configTheme.textColor
          },
          emphasis: {
            itemStyle: {
              borderColor: configTheme.borderColor,
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    },
    haftDonut: {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '70%'],
          startAngle: 180,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10
          },
          endAngle: 360,
          data
        }
      ]
    }
  }

  useEffect(() => {
    registerTheme('macarons', chartConfig)
    const chartInstance = init(chartRef.current)
    chartInstance.setOption(chartOptions[types])
    const resizeChart = () => {
      chartInstance.resize()
    }
    window.addEventListener('resize', resizeChart)
    return () => {
      window.removeEventListener('resize', resizeChart)
      chartInstance.dispose()
    }
  }, [types, data, configTheme])

  return (
    <div className={cn(className)}>
      <div ref={chartRef} className='h-full w-full'></div>
    </div>
  )
}
export default DonutChart
