"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  Star,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AnalyticsData {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    percentageChange: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
    topSelling: Array<{
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }>;
  };
  customers: {
    total: number;
    newThisMonth: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    pending: number;
  };
}

export default function AdminAnalytics() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    revenue: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      percentageChange: 0,
    },
    orders: {
      total: 0,
      pending: 0,
      completed: 0,
      cancelled: 0,
    },
    products: {
      total: 0,
      lowStock: 0,
      outOfStock: 0,
      topSelling: [],
    },
    customers: {
      total: 0,
      newThisMonth: 0,
    },
    reviews: {
      total: 0,
      averageRating: 0,
      pending: 0,
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch products
      const productsRes = await fetch("/api/admin/products");
      const products = productsRes.ok ? await productsRes.json() : [];

      // Fetch orders
      const ordersRes = await fetch("/api/admin/orders");
      const orders = ordersRes.ok ? await ordersRes.json() : [];

      // Fetch reviews
      const reviewsRes = await fetch("/api/admin/reviews");
      const reviews = reviewsRes.ok ? await reviewsRes.json() : [];

      // Calculate analytics
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      // Revenue calculations
      const totalRevenue = orders.reduce(
        (sum: number, o: any) => sum + Number(o.total),
        0
      );
      const thisMonthOrders = orders.filter(
        (o: any) => new Date(o.createdAt) >= thisMonthStart
      );
      const lastMonthOrders = orders.filter(
        (o: any) =>
          new Date(o.createdAt) >= lastMonthStart &&
          new Date(o.createdAt) <= lastMonthEnd
      );
      const thisMonthRevenue = thisMonthOrders.reduce(
        (sum: number, o: any) => sum + Number(o.total),
        0
      );
      const lastMonthRevenue = lastMonthOrders.reduce(
        (sum: number, o: any) => sum + Number(o.total),
        0
      );
      const revenueChange =
        lastMonthRevenue > 0
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          : 0;

      // Product stats
      const lowStock = products.filter(
        (p: any) => p.stock > 0 && p.stock <= 5
      ).length;
      const outOfStock = products.filter((p: any) => p.stock === 0).length;

      // Top selling products (mock data for now - would need order items in real implementation)
      const topSelling = products.slice(0, 5).map((p: any) => ({
        id: p.id,
        name: p.name,
        sales: Math.floor(Math.random() * 50) + 10,
        revenue: p.price * (Math.floor(Math.random() * 50) + 10),
      }));

      // Review stats
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
            reviews.length
          : 0;
      const pendingReviews = reviews.filter(
        (r: any) => r.status === "pending"
      ).length;

      setAnalytics({
        revenue: {
          total: totalRevenue,
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          percentageChange: revenueChange,
        },
        orders: {
          total: orders.length,
          pending: orders.filter((o: any) => o.status === "pending").length,
          completed: orders.filter((o: any) => o.status === "delivered").length,
          cancelled: orders.filter((o: any) => o.status === "cancelled").length,
        },
        products: {
          total: products.length,
          lowStock,
          outOfStock,
          topSelling: topSelling.sort(
            (a: any, b: any) => b.revenue - a.revenue
          ),
        },
        customers: {
          total: 0, // Would need customer count from DB
          newThisMonth: thisMonthOrders.length,
        },
        reviews: {
          total: reviews.length,
          averageRating: avgRating,
          pending: pendingReviews,
        },
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">
                  Analytics Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Business insights and performance metrics
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{Number(analytics.revenue.total).toFixed(2)}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {analytics.revenue.percentageChange >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <p
                        className={`text-xs ${
                          analytics.revenue.percentageChange >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Math.abs(analytics.revenue.percentageChange).toFixed(
                          1
                        )}
                        % from last month
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Orders
                    </CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.orders.total}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.orders.pending} pending
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Products
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.products.total}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analytics.products.lowStock} low stock
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Rating
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {analytics.reviews.averageRating.toFixed(1)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      From {analytics.reviews.total} reviews
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>This Month Performance</CardTitle>
                    <CardDescription>Current month statistics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Revenue</span>
                      <span className="text-lg font-bold">
                        €{analytics.revenue.thisMonth.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">New Orders</span>
                      <span className="text-lg font-bold">
                        {analytics.customers.newThisMonth}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">
                        Avg Order Value
                      </span>
                      <span className="text-lg font-bold">
                        €
                        {analytics.customers.newThisMonth > 0
                          ? (
                              analytics.revenue.thisMonth /
                              analytics.customers.newThisMonth
                            ).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Order Status Breakdown</CardTitle>
                    <CardDescription>
                      Current order distribution
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Completed</span>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 border-green-500/50 text-green-600"
                      >
                        {analytics.orders.completed}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pending</span>
                      <Badge
                        variant="outline"
                        className="bg-yellow-500/10 border-yellow-500/50 text-yellow-600"
                      >
                        {analytics.orders.pending}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cancelled</span>
                      <Badge
                        variant="outline"
                        className="bg-red-500/10 border-red-500/50 text-red-600"
                      >
                        {analytics.orders.cancelled}
                      </Badge>
                    </div>
                    {analytics.reviews.pending > 0 && (
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm">Pending Reviews</span>
                        <Badge
                          variant="outline"
                          className="bg-blue-500/10 border-blue-500/50 text-blue-600"
                        >
                          {analytics.reviews.pending}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{analytics.revenue.thisMonth.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Last Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      €{analytics.revenue.lastMonth.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card
                  className={
                    analytics.revenue.percentageChange >= 0
                      ? "border-green-500/50"
                      : "border-red-500/50"
                  }
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Change
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        analytics.revenue.percentageChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analytics.revenue.percentageChange >= 0 ? "+" : ""}
                      {analytics.revenue.percentageChange.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>
                    Best performing products by revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.products.topSelling.length > 0 ? (
                      analytics.products.topSelling.map((product, index) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {product.sales} sales
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-bold">
                            €{product.revenue.toFixed(2)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No sales data available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Total Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {analytics.products.total}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-yellow-500/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Low Stock
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-600">
                      {analytics.products.lowStock}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-red-500/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Out of Stock
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-600">
                      {analytics.products.outOfStock}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Inventory Health</CardTitle>
                  <CardDescription>Stock status overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">In Stock</span>
                        <span className="text-sm text-muted-foreground">
                          {analytics.products.total -
                            analytics.products.lowStock -
                            analytics.products.outOfStock}{" "}
                          products
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full transition-all"
                          style={{
                            width: `${
                              ((analytics.products.total -
                                analytics.products.lowStock -
                                analytics.products.outOfStock) /
                                analytics.products.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Low Stock</span>
                        <span className="text-sm text-muted-foreground">
                          {analytics.products.lowStock} products
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-yellow-500 h-3 rounded-full transition-all"
                          style={{
                            width: `${
                              (analytics.products.lowStock /
                                analytics.products.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">
                          Out of Stock
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {analytics.products.outOfStock} products
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-red-500 h-3 rounded-full transition-all"
                          style={{
                            width: `${
                              (analytics.products.outOfStock /
                                analytics.products.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
