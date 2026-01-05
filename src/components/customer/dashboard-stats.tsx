/**
 * Customer Dashboard Stats Cards
 * Reusable stat cards for customer dashboard overview
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  DollarSign,
  Clock,
  Heart,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

interface Order {
  id: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
}

interface DashboardStatsProps {
  orders: Order[];
  wishlistCount: number;
}

export function DashboardStats({ orders, wishlistCount }: DashboardStatsProps) {
  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing"
  ).length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orders.length}</div>
          <p className="text-xs text-muted-foreground mt-1">All time orders</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalSpent.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Lifetime value</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">In progress</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{wishlistCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Saved items</p>
        </CardContent>
      </Card>
    </div>
  );
}
