/**
 * Customer Dashboard - Refactored
 * Main customer dashboard page broken down into smaller components
 *
 * Original: 700+ lines
 * Refactored into:
 * - DashboardStats component (stats cards)
 * - OrdersList component (order history)
 * - WishlistSection component (wishlist items)
 * - OrderStatusBadge component (reusable status badge)
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, LogOut, Package, Heart, Settings } from "lucide-react";
import { toast } from "sonner";
import { DashboardStats } from "@/components/customer/dashboard-stats";
import { OrdersList } from "@/components/customer/orders-list";
import { WishlistSection } from "@/components/customer/wishlist-section";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const { items: wishlistItems, removeItem: removeFromWishlist } =
    useWishlist();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/customer/auth");
      if (!response.ok) {
        router.push("/customer/login");
        return;
      }
      const data = await response.json();
      setCustomer(data.customer);
      fetchOrders();
    } catch (error) {
      router.push("/customer/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/customer/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/customer/logout", { method: "POST" });
      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter orders by status
  const activeOrders = orders.filter(
    (o) => o.status !== ("cancelled" as any) && o.status !== "delivered"
  );
  const completedOrders = orders.filter((o) => o.status === "delivered");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold">My Account</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {customer?.name || "Customer"}!
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Account Stats */}
          <DashboardStats
            orders={orders}
            wishlistCount={wishlistItems.length}
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="active">
                      Active ({activeOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedOrders.length})
                    </TabsTrigger>
                    <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="active">
                    <OrdersList
                      orders={activeOrders}
                      emptyMessage="No active orders"
                    />
                  </TabsContent>

                  <TabsContent value="completed">
                    <OrdersList
                      orders={completedOrders}
                      emptyMessage="No completed orders"
                    />
                  </TabsContent>

                  <TabsContent value="all">
                    <OrdersList orders={orders} emptyMessage="No orders yet" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>
                  Items you've saved for later ({wishlistItems.length})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WishlistSection
                  items={wishlistItems}
                  onRemoveItem={removeFromWishlist}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {customer?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {customer?.name}
                  </p>
                </div>
                {customer?.phone && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                )}
                <Button variant="outline" className="mt-4">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
