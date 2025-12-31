"use client";

import { useWishlist } from "@/hooks/use-wishlist";
import { X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Package,
  User,
  Heart,
  LogOut,
  Settings,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  Truck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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
  
  // Wishlist hook
  const { items: wishlistItems, removeItem: removeFromWishlist } = useWishlist();

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

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "processing":
        return "text-blue-500";
      case "shipped":
        return "text-purple-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All time orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Spent
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €
                  {orders
                    .reduce((sum, o) => sum + Number(o.total), 0)
                    .toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lifetime value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    orders.filter(
                      (o) => o.status === "pending" || o.status === "processing"
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {orders.filter((o) => o.status === "delivered").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed orders
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track all your orders
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/shop">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-4 bg-muted/50 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No orders yet
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Start exploring our collection of handcrafted items and
                      place your first order!
                    </p>
                    <Button asChild size="lg">
                      <Link href="/shop">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-2">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">
                                  Order #{order.orderNumber}
                                </CardTitle>
                                <Badge
                                  variant="outline"
                                  className={`capitalize ${
                                    order.status === "delivered"
                                      ? "bg-green-500/10 border-green-500/50 text-green-600"
                                      : order.status === "shipped"
                                      ? "bg-blue-500/10 border-blue-500/50 text-blue-600"
                                      : order.status === "processing"
                                      ? "bg-purple-500/10 border-purple-500/50 text-purple-600"
                                      : "bg-yellow-500/10 border-yellow-500/50 text-yellow-600"
                                  }`}
                                >
                                  {order.status === "delivered" && (
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                  )}
                                  {order.status === "shipped" && (
                                    <Truck className="mr-1 h-3 w-3" />
                                  )}
                                  {order.status === "processing" && (
                                    <Package className="mr-1 h-3 w-3" />
                                  )}
                                  {order.status === "pending" && (
                                    <Clock className="mr-1 h-3 w-3" />
                                  )}
                                  {order.status}
                                </Badge>
                              </div>
                              <CardDescription>
                                Placed on{" "}
                                {new Date(order.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </CardDescription>
                            </div>
                            <div className="text-left md:text-right">
                              <p className="text-sm text-muted-foreground">
                                Total Amount
                              </p>
                              <p className="text-2xl font-bold">
                                €{Number(order.total).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3 mb-4">
                            <p className="text-sm font-medium">
                              Items ({order.items.length})
                            </p>
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center py-2 border-b last:border-0"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity} × €
                                    {Number(item.price).toFixed(2)}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  €{(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/customer/orders/${order.id}`}>
                              View Full Details
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Full Name
                    </label>
                    <p className="text-base pl-6">
                      {customer?.name || "Not set"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email Address
                    </label>
                    <p className="text-base pl-6">
                      {customer?.email || "Not set"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number
                    </label>
                    <p className="text-base pl-6">
                      {customer?.phone || "Not set"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Address
                    </label>
                    <p className="text-base pl-6">
                      {customer?.address || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button>
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
                <CardDescription>
                  Your shopping activity overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total Orders
                    </p>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {orders.filter((o) => o.status === "delivered").length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Delivered
                    </p>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {orders.filter((o) => o.status === "shipped").length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      In Transit
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {
                        orders.filter(
                          (o) =>
                            o.status === "pending" || o.status === "processing"
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Processing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>
                  Products you&apos;ve saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="p-4 bg-red-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <Heart className="h-10 w-10 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Save your favorite items by clicking the heart icon on
                      product pages
                    </p>
                    <Button asChild size="lg">
                      <Link href="/shop">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Explore Products
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="group relative bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        {/* Remove Button */}
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            removeFromWishlist(item.id);
                            toast.success("Removed from wishlist");
                          }}
                          className="absolute top-2 right-2 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>

                        {/* Image Link */}
                        <Link href={`/shop/${item.slug}`} className="block relative aspect-square bg-secondary/10">
                           <Image
                             src={item.imageUrl}
                             alt={item.name}
                             fill
                             className="object-cover"
                           />
                        </Link>
                        
                        {/* Info */}
                        <div className="p-4">
                          <Link href={`/shop/${item.slug}`} className="block">
                            <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{item.name}</h3>
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                             <p className="font-bold">€{item.price.toFixed(2)}</p>
                             <Button size="sm" variant="outline" asChild>
                               <Link href={`/shop/${item.slug}`}>View</Link>
                             </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Manage how you receive notifications about your orders
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">Order updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about order confirmations and updates
                        </p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">Shipping notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive tracking updates and delivery notifications
                        </p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" className="rounded h-4 w-4" />
                      <div>
                        <p className="font-medium">Marketing emails</p>
                        <p className="text-sm text-muted-foreground">
                          Get updates about new products and special offers
                        </p>
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded h-4 w-4"
                      />
                      <div>
                        <p className="font-medium">Product reviews</p>
                        <p className="text-sm text-muted-foreground">
                          Reminders to review your purchased products
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
                <div className="pt-4 border-t">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Download My Data
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <Button variant="destructive">Delete My Account</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
