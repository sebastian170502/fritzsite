"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, DollarSign, ShoppingCart, Package } from "lucide-react";

interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
  products: number;
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down";
}

function MetricCard({ title, value, change, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p
              className={`text-xs mt-1 ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {change} from last period
            </p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsCharts() {
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/analytics/timeseries?days=${dateRange}`
      );
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculate summary metrics
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const totalProducts = data.reduce((sum, d) => sum + d.products, 0);

  const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0;
  const avgOrders = data.length > 0 ? totalOrders / data.length : 0;

  // Calculate trends (compare first half vs second half)
  const midpoint = Math.floor(data.length / 2);
  const firstHalfRevenue = data
    .slice(0, midpoint)
    .reduce((sum, d) => sum + d.revenue, 0);
  const secondHalfRevenue = data
    .slice(midpoint)
    .reduce((sum, d) => sum + d.revenue, 0);
  const revenueTrend = secondHalfRevenue > firstHalfRevenue ? "up" : "down";
  const revenueChange =
    firstHalfRevenue > 0
      ? `${Math.abs(
          ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100
        ).toFixed(1)}%`
      : "0%";

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Overview</h2>
        <Select
          value={dateRange}
          onValueChange={(value: "7" | "30" | "90") => setDateRange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`€${totalRevenue.toFixed(2)}`}
          change={revenueChange}
          trend={revenueTrend}
          icon={<DollarSign className="h-6 w-6 text-orange-600" />}
        />
        <MetricCard
          title="Total Orders"
          value={totalOrders.toString()}
          change={`Avg: ${avgOrders.toFixed(1)}/day`}
          trend="up"
          icon={<ShoppingCart className="h-6 w-6 text-orange-600" />}
        />
        <MetricCard
          title="Products Sold"
          value={totalProducts.toString()}
          change={`Across ${totalOrders} orders`}
          trend="up"
          icon={<Package className="h-6 w-6 text-orange-600" />}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products Sold</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>
                Daily revenue for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `€${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `€${Number(value).toFixed(2)}`,
                      "Revenue",
                    ]}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#E65100"
                    fill="#E65100"
                    fillOpacity={0.3}
                    name="Revenue (€)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
              <CardDescription>Number of orders per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [value, "Orders"]}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="orders"
                    fill="#E65100"
                    name="Orders"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products Sold Over Time</CardTitle>
              <CardDescription>Total products sold per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) => [value, "Products"]}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="products"
                    stroke="#E65100"
                    strokeWidth={2}
                    name="Products Sold"
                    dot={{ fill: "#E65100", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
