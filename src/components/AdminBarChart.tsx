"use client"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  shocks: {
    label: "Shocks",
    color: "var(--chart-3)",
  },
  Engine: {
    label: "Engine",
    color: "var(--chart-4)",
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

const AdminBarChart = () => {
  return (
    <div>
      <h1 className="text-lg font-medium mb-6">Top Selling Categories</h1>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
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
        <Bar dataKey="Shocks" fill="var(--color-shocks)" radius={4} />
        <Bar dataKey="Engine" fill="var(--color-Engine)" radius={4} />
      </BarChart>
    </ChartContainer>
    </div>
  )
}

export default AdminBarChart
