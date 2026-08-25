"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell } from "recharts";

const monitors = [
  { name: "api.example.com", status: "up", uptime: 99.98, latency: 42 },
  { name: "app.example.com", status: "up", uptime: 99.91, latency: 78 },
  { name: "auth.example.com", status: "down", uptime: 97.43, latency: 0 },
  { name: "cdn.example.com", status: "up", uptime: 99.99, latency: 18 },
  { name: "billing.example.com", status: "degraded", uptime: 98.12, latency: 340 },
];

const activeIncidents = 2;

const uptimeData = monitors.map((m) => ({
  name: m.name.replace(".example.com", ""),
  uptime: m.uptime,
}));

const latencyData = [
  { time: "1m", latency: 38 },
  { time: "2m", latency: 42 },
  { time: "3m", latency: 35 },
  { time: "4m", latency: 50 },
  { time: "5m", latency: 44 },
  { time: "6m", latency: 39 },
  { time: "7m", latency: 41 },
  { time: "8m", latency: 78 },
  { time: "9m", latency: 45 },
  { time: "10m", latency: 42 },
];

const statusData = [
  { name: "Up", value: monitors.filter((m) => m.status === "up").length },
  { name: "Down", value: monitors.filter((m) => m.status === "down").length },
  { name: "Degraded", value: monitors.filter((m) => m.status === "degraded").length },
];

const statusColors = ["hsl(var(--chart-1))", "hsl(var(--chart-5))", "hsl(var(--chart-3))"];

const uptimeConfig = {
  uptime: {
    label: "Uptime %",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

const latencyConfig = {
  latency: {
    label: "Latency (ms)",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

const statusConfig = {
  value: {
    label: "Count",
  },
  Up: {
    label: "Up",
    color: "var(--color-chart-1)",
  },
  Down: {
    label: "Down",
    color: "var(--color-chart-5)",
  },
  Degraded: {
    label: "Degraded",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

const totalUp = monitors.filter((m) => m.status === "up").length;
const avgUptime = (
  monitors.reduce((a, m) => a + m.uptime, 0) / monitors.length
).toFixed(2);
const avgLatency = Math.round(
  monitors
    .filter((m) => m.latency > 0)
    .reduce((a, m) => a + m.latency, 0) /
    monitors.filter((m) => m.latency > 0).length
);

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Monitors Up</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalUp}/{monitors.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgUptime}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgLatency}ms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{activeIncidents}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Uptime by Monitor</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={uptimeConfig} className="h-[200px] w-full">
              <BarChart data={uptimeData}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="uptime" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={statusConfig} className="h-[200px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={statusColors[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Response Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={latencyConfig} className="h-[200px] w-full">
            <LineChart data={latencyData}>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
