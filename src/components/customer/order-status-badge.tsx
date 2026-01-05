/**
 * Order Status Badge
 * Color-coded status badge for orders
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { Clock, Package, Truck, CheckCircle2 } from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
    icon: CheckCircle2,
  },
};

export function OrderStatusBadge({
  status,
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge className={`${config.color} border-0`}>
      {showIcon && <Icon className="mr-1 h-3 w-3" />}
      {config.label}
    </Badge>
  );
}

export function getStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    pending: "text-yellow-500",
    processing: "text-blue-500",
    shipped: "text-purple-500",
    delivered: "text-green-500",
  };
  return colors[status];
}
