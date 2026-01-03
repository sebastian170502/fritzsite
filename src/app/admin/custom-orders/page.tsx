"use client";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Package,
  ArrowLeft,
  DollarSign,
  CheckCircle,
  XCircle,
  Mail,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import Link from "next/link";

interface CustomOrder {
  id: string;
  orderId: string;
  email: string;
  name: string;
  details: any;
  images: string[];
  status: string;
  price?: number;
  createdAt: string;
}

export default function AdminCustomOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/custom-orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        toast.error("Failed to load custom orders");
      }
    } catch (error) {
      console.error("Failed to fetch custom orders:", error);
      toast.error("Failed to load custom orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async () => {
    if (!quotePrice || isNaN(Number(quotePrice)) || Number(quotePrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!selectedOrder) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          price: Number(quotePrice),
        }),
      });

      if (response.ok) {
        toast.success("Quote sent successfully!");
        setIsQuoteDialogOpen(false);
        fetchOrders(); // Refresh list
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to send quote");
      }
    } catch (error) {
      console.error("Quote error:", error);
      toast.error("Failed to send quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_quote":
        return <Badge variant="secondary">Pending Quote</Badge>;
      case "awaiting_payment":
        return <Badge className="bg-yellow-600">Awaiting Payment</Badge>;
      case "paid":
        return <Badge className="bg-green-600">Paid</Badge>;
      case "fulfilled":
        return <Badge variant="outline">Fulfilled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Custom Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage custom requests and quotes
          </p>
        </div>
        <Button asChild variant="outline">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Link>
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No custom order requests yet.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                        <CardTitle className="text-lg">#{order.orderId}</CardTitle>
                        {getStatusBadge(order.status)}
                    </div>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleDateString()} • {order.name || "Guest"} ({order.email})
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {/* Action Buttons */}
                    {order.status === "pending_quote" && (
                        <Dialog open={isQuoteDialogOpen && selectedOrder?.id === order.id} onOpenChange={(open: boolean) => {
                            if (open) setSelectedOrder(order);
                            else {
                                setIsQuoteDialogOpen(false);
                                setSelectedOrder(null);
                            }
                        }}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <DollarSign className="mr-2 h-4 w-4" />
                                Send Quote
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Send Quote for #{order.orderId}</DialogTitle>
                                <DialogDescription>
                                    Set the price for this custom order. The customer will receive an email with a payment link.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label htmlFor="price">Price (RON)</Label>
                                <div className="relative mt-2">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground">RON</span>
                                    <Input
                                        id="price"
                                        type="number"
                                        className="pl-12"
                                        placeholder="0.00"
                                        value={quotePrice}
                                        onChange={(e) => setQuotePrice(e.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsQuoteDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSendQuote} disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Quote"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                        </Dialog>
                    )}
                    {order.status === "awaiting_payment" && (
                        <div className="flex items-center text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                            <Mail className="mr-2 h-4 w-4" />
                            Quote Sent: {order.price} RON
                        </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Details Column */}
                    <div>
                        <h4 className="font-semibold mb-3">Specifications</h4>
                        <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-3 py-1 border-b border-border/50">
                                <span className="text-muted-foreground">Type:</span>
                                <span className="col-span-2 font-medium capitalize">{order.details.orderType}</span>
                            </div>
                            {order.details.material && (
                                <div className="grid grid-cols-3 py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Material:</span>
                                    <span className="col-span-2 capitalize">{order.details.material}</span>
                                </div>
                            )}
                            {(order.details.bladeLength || order.details.bladeWidth || order.details.handleLength) && (
                                <div className="grid grid-cols-3 py-1 border-b border-border/50">
                                    <span className="text-muted-foreground">Dimensions:</span>
                                    <div className="col-span-2">
                                        {order.details.bladeLength && <div>Blade Length: {order.details.bladeLength}</div>}
                                        {order.details.bladeWidth && <div>Blade Width: {order.details.bladeWidth}</div>}
                                        {order.details.handleLength && <div>Handle Length: {order.details.handleLength}</div>}
                                    </div>
                                </div>
                            )}
                            {order.details.description && (
                                <div className="pt-2">
                                    <span className="text-muted-foreground block mb-1">Description:</span>
                                    <div className="p-3 bg-secondary/20 rounded-md text-sm whitespace-pre-wrap">
                                        {order.details.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Images Column */}
                    <div>
                        <h4 className="font-semibold mb-3">Reference Images</h4>
                        {order.images && order.images.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {order.images.map((img, idx) => (
                                    <a key={idx} href={img} target="_blank" rel="noopener noreferrer" className="block relative aspect-square bg-muted rounded-md overflow-hidden border hover:opacity-90 transition-opacity">
                                        <img src={img} alt={`Reference ${idx + 1}`} className="w-full h-full object-cover" />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 bg-muted/20 rounded-md border border-dashed">
                                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">No images attached</span>
                            </div>
                        )}
                    </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
