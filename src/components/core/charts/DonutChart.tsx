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
  const chartOptions: {
    [key: string]: any
  } = {
    donut: {
      tooltip: { trigger: 'item' },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: { color: configTheme.textColor, fontFamily: 'latin' },
        orient: 'horizontal',
        type: 'scroll',
        color: configTheme.textColor,
        pageIcons: {
          horizontal: [
            'path://M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM14 16L10 12L14 8',
            'path://M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10 8L14 12L10 16'
          ]
        },
        pageIconColor: configTheme.textColor,
        pageIconSize: 16,
        pageIconInactiveColor: 'rgba(255, 255, 255, 0.3)',
        pageTextStyle: {
          color: configTheme.textColor
        }
      },
      series: [
        {
          type: 'pie',
          radius: ['35%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'transparent',
            borderWidth: 5,
            padding: 12
          },
          label: {
            fontSize: '10',
            color: configTheme.textColor,
            position: 'outside',
            alignTo: 'none',
            fontFamily: 'latin'
          },
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'transparent'
            }
          },
          blur: {
            itemStyle: {
              opacity: 0.3
            }
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
          radius: [50, 140],
          center: ['50%', '45%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 10,
            borderColor: 'transparent',
            padding: 12
          },
          label: {
            fontSize: '10',
            color: configTheme.textColor
          },
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'transparent'
            }
          },
          blur: {
            itemStyle: {
              opacity: 0.3
            }
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
          radius: ['35%', '70%'],
          center: ['50%', '45%'],
          data,
          label: {
            fontSize: '10',
            color: configTheme.textColor
          },
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'transparent'
            }
          },
          blur: {
            itemStyle: {
              opacity: 0.3
            }
          },
          padAngle: 2,
          itemStyle: {
            borderColor: 'transparent',
            padding: 12
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
          radius: ['40%', '75%'],
          center: ['50%', '65%'],
          startAngle: 180,
          padAngle: 2,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'transparent',
            padding: 12
          },
          endAngle: 360,
          emphasis: {
            focus: 'series',
            scale: true,
            scaleSize: 10,
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'transparent'
            }
          },
          blur: {
            itemStyle: {
              opacity: 0.3
            }
          },
          data
        }
      ]
    }
  }

  useEffect(() => {
    registerTheme('macarons', chartConfig)
    const chartInstance = init(chartRef.current)

    const defaultOption = chartOptions[types]
    defaultOption.series[0].emphasis = {
      focus: 'series',
      scale: true,
      scaleSize: 10,
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        borderColor: 'transparent'
      }
    }

    chartInstance.setOption(defaultOption)

    chartInstance.on('mouseout', function (params: any) {
      if (params.componentType === 'series') {
        const currentOption = chartInstance.getOption() as { series: { data: any[] }[] }
        const series = currentOption.series[0]

        series.data = series.data.map((item: any) => ({
          ...item,
          emphasis: {
            scale: true,
            scaleSize: 10
          }
        }))

        chartInstance.setOption({
          series: [series]
        })
      }
    })

    chartInstance.on('click', function (params: any) {
      console.log('Clicked data:', {
        name: params.data.name,
        value: params.data.value,
        dataIndex: params.dataIndex,
        seriesIndex: params.seriesIndex,
        seriesName: params.seriesName
      })
    })

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
