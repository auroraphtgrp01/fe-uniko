'use client'
import { cn } from '@/libraries/utils'
import { init } from 'echarts'
import { useEffect, useRef } from 'react'

export interface IChartProps {
  data: IPayloadDataChart[]
  options?: any
  className?: string | string[]
  types?: 'nightingale' | 'referer' | 'donut'
}

export interface IPayloadDataChart {
  value: number
  name: string
}

const DonutChart = ({ options, data, className, types = 'donut' }: IChartProps) => {
  const chartRef = useRef(null)

  useEffect(() => {
    const chartInstance = init(chartRef.current)
    const chartOptions = {
      donut: {
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['20%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 5
            },
            label: {
              fontSize: '10'
            },
            data
          }
        ]
      },
      nightingale: {
        legend: { top: 'bottom' },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        tooltip: { trigger: 'item' },
        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 150],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 10
            },
            data
          }
        ]
      },
      referer: {
        tooltip: { trigger: 'item' },
        legend: {
          orient: 'vertical',
          left: 'bottom'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '80%',
            data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
    }
    chartInstance.setOption(chartOptions[types])
    return () => {
      chartInstance.dispose()
    }
  }, [types, data])

  return (
    <div className={cn(className)}>
      <div ref={chartRef} className='h-full w-full'></div>
    </div>
  )
}
export default DonutChart
