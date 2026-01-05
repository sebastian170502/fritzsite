"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Loader2,
  Truck,
  Package,
  MapPin,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

interface Order {
  id: string;
  orderNumber: string;
  trackingNumber?: string;
  courierName?: string;
  trackingUrl?: string;
  status: string;
  createdAt: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    name: string;
    quantity: number;
    imageUrl?: string;
  }[];
}

export default function TrackOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    params.then(setUnwrappedParams).catch((error) => {
      console.error("Error unwrapping params:", error);
      toast.error("Failed to load tracking info");
      router.push("/customer");
    });
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch("/api/customer/orders");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const orders = await response.json();
        const matchingOrder = orders.find(
          (o: Order) => o.id === unwrappedParams.id
        );

        if (!matchingOrder) throw new Error("Order not found");
        setOrder(matchingOrder);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load tracking info");
        router.push("/customer");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [unwrappedParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Track Your Order</h1>
            <p className="text-muted-foreground">Order #{order.orderNumber}</p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Delivery Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium text-lg capitalize">{order.status}</p>
                <p className="text-sm text-muted-foreground">
                  {order.courierName
                    ? `Shipped via ${order.courierName}`
                    : "Courier info pending"}
                </p>
              </div>
              <Badge
                variant={order.status === "delivered" ? "default" : "secondary"}
                className="text-sm px-3 py-1 capitalize"
              >
                {order.status}
              </Badge>
            </div>

            {order.trackingNumber ? (
              <div className="space-y-4">
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-muted-foreground">
                    Tracking Number
                  </label>
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-card">
                    <span className="font-mono text-lg flex-1">
                      {order.trackingNumber}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          order.trackingNumber || ""
                        );
                        toast.success("Copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {order.trackingUrl && (
                  <Button className="w-full" asChild>
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Track on {order.courierName || "Courier Site"}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                {!order.trackingUrl && (
                  <p className="text-xs text-muted-foreground text-center">
                    Please check the courier's website to track your package.
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6 space-y-2">
                <Package className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
                <p className="font-medium">Tracking number not available yet</p>
                <p className="text-sm text-muted-foreground">
                  We will update this information as soon as your order ships.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Shipping Address Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Destination
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm leading-relaxed">
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
