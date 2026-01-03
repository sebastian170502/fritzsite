"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Package,
  LogOut,
  Star,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import AdminReviewsPage from "./reviews/page";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  material: string;
  category: string;
  stock: number;
  images: string[];
}

interface DashboardStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/orders"),
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);

        // Calculate product stats
        const inStock = productsData.filter((p: Product) => p.stock > 5).length;
        const lowStock = productsData.filter(
          (p: Product) => p.stock > 0 && p.stock <= 5
        ).length;
        const outOfStock = productsData.filter(
          (p: Product) => p.stock === 0
        ).length;

        setStats((prev) => ({
          ...prev,
          totalProducts: productsData.length,
          inStock,
          lowStock,
          outOfStock,
        }));
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const pendingOrders = ordersData.filter(
          (o: any) => o.status === "pending" || o.status === "processing"
        ).length;
        const totalRevenue = ordersData.reduce(
          (sum: number, o: any) => sum + Number(o.total),
          0
        );
        const avgOrderValue =
          ordersData.length > 0 ? totalRevenue / ordersData.length : 0;

        setStats((prev) => ({
          ...prev,
          totalOrders: ordersData.length,
          pendingOrders,
          totalRevenue,
          averageOrderValue: avgOrderValue,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchDashboardData();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your e-commerce platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/customers">
                <Users className="h-4 w-4 mr-2" />
                Customers
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Overview
          </h2>
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
                  €{Number(stats.totalRevenue).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  From {stats.totalOrders} orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingOrders}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.inStock} in stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Order Value
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{Number(stats.averageOrderValue).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Per order</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Access
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link href="/admin/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold">Orders</h3>
                  <p className="text-xs text-gray-600 mt-1">Manage orders</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/customers">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold">Customers</h3>
                  <p className="text-xs text-gray-600 mt-1">View customers</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/reviews">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <h3 className="font-semibold">Reviews</h3>
                  <p className="text-xs text-gray-600 mt-1">Moderate reviews</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-red-600" />
                  <h3 className="font-semibold">Admin Users</h3>
                  <p className="text-xs text-gray-600 mt-1">Manage admins</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/logs">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold">Activity Logs</h3>
                  <p className="text-xs text-gray-600 mt-1">View activity</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/custom-orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 bg-primary/5">
                <CardContent className="pt-6 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Custom Orders</h3>
                  <p className="text-xs text-gray-600 mt-1">Manage quotes</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Inventory Alerts */}
        {(stats.lowStock > 0 || stats.outOfStock > 0) && (
          <Card className="mb-8 border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.lowStock > 0 && (
                <p className="text-sm">
                  <Badge
                    variant="outline"
                    className="mr-2 bg-yellow-500/10 border-yellow-500/50"
                  >
                    {stats.lowStock}
                  </Badge>
                  products are running low on stock (≤5 items)
                </p>
              )}
              {stats.outOfStock > 0 && (
                <p className="text-sm">
                  <Badge
                    variant="outline"
                    className="mr-2 bg-red-500/10 border-red-500/50"
                  >
                    {stats.outOfStock}
                  </Badge>
                  products are out of stock
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="products" className="gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Order Management
                    </CardTitle>
                    <CardDescription className="mt-1">
                      View and manage all customer orders in one place
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/admin/orders">
                      View All Orders
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold mt-1">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold mt-1 text-yellow-600">
                      {stats.pendingOrders}
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold mt-1 text-green-600">
                      {stats.totalOrders - stats.pendingOrders}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            {/* Product Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    In Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {stats.inStock}
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
                    {stats.lowStock}
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
                    {stats.outOfStock}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Products Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription className="mt-1">
                      Manage your product inventory
                    </CardDescription>
                  </div>
                  <Button onClick={() => router.push("/admin/products/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No products found. Add your first product!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left p-4 font-semibold">Name</th>
                          <th className="text-left p-4 font-semibold">
                            Category
                          </th>
                          <th className="text-left p-4 font-semibold">
                            Material
                          </th>
                          <th className="text-right p-4 font-semibold">
                            Price
                          </th>
                          <th className="text-right p-4 font-semibold">
                            Stock
                          </th>
                          <th className="text-right p-4 font-semibold">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-border hover:bg-muted/50"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                {product.images[0] && (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <span className="font-medium">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 capitalize">
                              {product.category.replace("-", " ")}
                            </td>
                            <td className="p-4 capitalize">
                              {product.material.replace("-", " ")}
                            </td>
                            <td className="p-4 text-right">
                              €{Number(product.price).toFixed(2)}
                            </td>
                            <td className="p-4 text-right">
                              <Badge
                                variant="outline"
                                className={
                                  product.stock === 0
                                    ? "bg-red-500/10 border-red-500/50 text-red-600"
                                    : product.stock < 5
                                    ? "bg-yellow-500/10 border-yellow-500/50 text-yellow-600"
                                    : "bg-green-500/10 border-green-500/50 text-green-600"
                                }
                              >
                                {product.stock}
                              </Badge>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  router.push(`/admin/products/${product.id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <AdminReviewsPage />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
