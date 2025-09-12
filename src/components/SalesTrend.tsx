"use client"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart,  CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  shocks: {
    label: "Shocks",
    color: "var(--chart-2)",
  },
  Engine: {
    label: "Engine",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

const chartData = [
    { month: "January", Shocks: 186, Engine: 80 },
    { month: "February", Shocks: 305, Engine: 200 },
    { month: "March", Shocks: 237, Engine: 120 },
    { month: "April", Shocks: 73, Engine: 190 },
    { month: "May", Shocks: 209, Engine: 130 },
    { month: "June", Shocks: 214, Engine: 140 },
  ]

const SalesTrend = () => {
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Sales Trend</h1>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart accessibilityLayer data={chartData}>
      <CartesianGrid vertical={false} />
      <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
     <YAxis
      tickLine={false}
      tickMargin={10}
      axisLine={false}
    />
     <ChartTooltip content={<ChartTooltipContent />} />
     <ChartLegend />
     <Area
              dataKey="Shocks"
              type="linear"
              fill="var(--color-shocks)"
              fillOpacity={0.4}
              stroke="var(--color-shocks)"
            /> 
    <Area
              dataKey="Engine"
              type="linear"
              fill="var(--color-Engine)"
              fillOpacity={0.4}
              stroke="var(--color-Engine)"
            />  
      </AreaChart>
    </ChartContainer>
    </div>
  )
}

export default SalesTrend
