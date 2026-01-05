/**
 * Orders List Component
 * Displays customer orders with status and details
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OrderStatusBadge } from "./order-status-badge";
import { ChevronRight } from "lucide-react";

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

interface OrdersListProps {
  orders: Order[];
  emptyMessage?: string;
}

export function OrdersList({
  orders,
  emptyMessage = "No orders yet",
}: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
        <Button asChild className="mt-4">
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  {new Date(order.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p>
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}{" "}
                  • €{Number(order.total).toFixed(2)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {order.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-secondary px-2 py-1 rounded"
                  >
                    {item.quantity}x {item.name}
                  </span>
                ))}
              </div>
            </div>

            <Button asChild variant="ghost" size="sm" className="ml-4">
              <Link href={`/customer/orders/${order.id}`}>
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
