"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export default function OrderDetailsPage({
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
    params.then(setUnwrappedParams);
  }, [params]);

  useEffect(() => {
    if (!unwrappedParams) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${unwrappedParams.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details");
        router.push("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [unwrappedParams, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />;
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "shipped":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/orders")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-muted-foreground">{order.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.open(`/api/invoices/${order.id}`, "_blank")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            <Badge className={getStatusColor(order.status)} variant="outline">
              {getStatusIcon(order.status)}
              <span className="ml-2">{order.status.toUpperCase()}</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex gap-4">
                      {item.imageUrl && (
                        <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          €{Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          €{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>€{Number(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>€{Number(order.shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span>€{Number(order.tax).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>€{Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                {order.customerPhone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      order.paymentStatus === "paid" ? "default" : "secondary"
                    }
                    className="mt-1"
                  >
                    {order.paymentStatus.toUpperCase()}
                  </Badge>
                </div>
                {order.paymentMethod && (
                  <div>
                    <p className="text-sm text-muted-foreground">Method</p>
                    <p className="font-medium capitalize">
                      {order.paymentMethod}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Tracking Number
                  </p>
                  <p className="font-mono font-medium">
                    {order.trackingNumber}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-sm text-muted-foreground">Order Placed</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
