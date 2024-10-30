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
  types?: 'nightingale' | 'referer' | 'donut' | 'haftDonut' | 'prettier'
}

export interface IPayloadDataChart {
  value: number | string
  name: string
}
export interface IChartData {
  incomingTransactionTypeStats: IPayloadDataChart[]
  expenseTransactionTypeStats: IPayloadDataChart[]
  incomingTransactionAccountTypeStats: IPayloadDataChart[]
  expenseTransactionAccountTypeStats: IPayloadDataChart[]
  totalIncomeToday: number
  totalBalance: number
  totalExpenseToday: number
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
  const colors = ['#5470C6', '#91CC75', '#EE6666', '#fff']
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
    },
    prettier: {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      grid: {
        right: '20%'
      },
      toolbox: {
        //feature: {
        // dataView: { show: true, readOnly: false },
        // restore: { show: true },
        // saveAsImage: { show: true }
        // }
      },
      legend: {
        data: ['Evaporation', 'Precipitation', 'Temperature']
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          // prettier-ignore
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Evaporation',
          position: 'right',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[0]
            }
          },
          axisLabel: {
            formatter: '{value} ml'
          }
        },
        {
          type: 'value',
          name: 'Precipitation',
          position: 'right',
          alignTicks: true,
          offset: 80,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[1]
            }
          },
          axisLabel: {
            formatter: '{value} ml'
          }
        },
        {
          type: 'value',
          name: '温度',
          position: 'left',
          alignTicks: true,
          axisLine: {
            show: true,
            lineStyle: {
              color: colors[2]
            }
          },
          axisLabel: {
            formatter: '{value} °C'
          }
        }
      ],
      series: [
        {
          name: 'Evaporation',
          type: 'bar',
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        },
        {
          name: 'Precipitation',
          type: 'bar',
          yAxisIndex: 1,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        },
        {
          name: 'Temperature',
          type: 'line',
          yAxisIndex: 2,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
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
