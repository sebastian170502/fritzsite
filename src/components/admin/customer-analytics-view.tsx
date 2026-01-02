"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Calendar,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CustomerAnalytics {
  customer: {
    email: string;
    firstName?: string;
    lastName?: string;
  };
  metrics: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lifetimeValue: number;
    firstOrderDate: string;
    lastOrderDate: string;
    daysSinceLastOrder: number;
  };
  rfm: {
    recency: number;
    frequency: number;
    monetary: number;
    score: number;
    segment: string;
  };
  categoryPreferences: Array<{
    category: string;
    count: number;
    totalSpent: number;
  }>;
  orderHistory: Array<{
    date: string;
    total: number;
    itemCount: number;
  }>;
}

const COLORS = ["#E65100", "#FF6F00", "#FF8F00", "#FFA000", "#FFB300"];

export function CustomerAnalyticsView({
  customerEmail,
}: {
  customerEmail: string;
}) {
  const [analytics, setAnalytics] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerAnalytics();
  }, [customerEmail]);

  const fetchCustomerAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/customers/${encodeURIComponent(customerEmail)}/analytics`
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error fetching customer analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          No analytics data available for this customer.
        </CardContent>
      </Card>
    );
  }

  const { customer, metrics, rfm, categoryPreferences, orderHistory } =
    analytics;

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "VIP":
        return "default";
      case "Loyal":
        return "secondary";
      case "At Risk":
        return "destructive";
      case "New":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle>
                  {customer.firstName} {customer.lastName}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={getSegmentColor(rfm.segment) as any}
              className="text-lg px-4 py-2"
            >
              {rfm.segment}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lifetime Value</p>
                <p className="text-2xl font-bold mt-1">
                  €{metrics.lifetimeValue.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{metrics.totalOrders}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold mt-1">
                  €{metrics.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Days Since Last Order</p>
                <p className="text-2xl font-bold mt-1">
                  {metrics.daysSinceLastOrder}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RFM Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>RFM Analysis</CardTitle>
          <CardDescription>
            Recency, Frequency, Monetary scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Recency Score</p>
              <p className="text-3xl font-bold text-orange-600">
                {rfm.recency}/5
              </p>
              <p className="text-xs text-gray-500 mt-1">
                How recently they bought
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Frequency Score</p>
              <p className="text-3xl font-bold text-orange-600">
                {rfm.frequency}/5
              </p>
              <p className="text-xs text-gray-500 mt-1">How often they buy</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Monetary Score</p>
              <p className="text-3xl font-bold text-orange-600">
                {rfm.monetary}/5
              </p>
              <p className="text-xs text-gray-500 mt-1">How much they spend</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
            <p className="text-sm text-gray-700">
              Overall RFM Score:{" "}
              <span className="font-bold text-lg">{rfm.score}/15</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Purchase History</TabsTrigger>
          <TabsTrigger value="categories">Category Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Order History Timeline</CardTitle>
              <CardDescription>Purchase trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={orderHistory}>
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
                    formatter={(value) => [
                      `€${Number(value).toFixed(2)}`,
                      "Order Total",
                    ]}
                    labelStyle={{ color: "#000" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#E65100"
                    strokeWidth={2}
                    dot={{ fill: "#E65100", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Preferences</CardTitle>
              <CardDescription>
                Most purchased product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryPreferences}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) =>
                        `${props.category} (${props.count})`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {categoryPreferences.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-3">
                  {categoryPreferences.map((cat, index) => (
                    <div
                      key={cat.category}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <div>
                          <p className="font-semibold">{cat.category}</p>
                          <p className="text-xs text-gray-600">
                            {cat.count} orders
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">€{cat.totalSpent.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
