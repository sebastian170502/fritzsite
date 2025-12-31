"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Lock, ShieldCheck } from "lucide-react";

interface CustomOrder {
  id: string;
  orderId: string;
  price: number;
  currency: string;
  status: string;
  name: string;
  email: string;
  details: any;
  images: string[];
}

export default function CustomOrderCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<CustomOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Shipping details state
  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Romania", // Default
  });

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string);
    }
  }, [params.id]);

  const fetchOrder = async (id: string) => {
    try {
      // Create a public API or use existing admin API with protection? 
      // Ideally we need a public endpoint to fetch basic order details by friendly ID (orderId) or secure token.
      // For MVP, using a new public endpoint GET /api/custom-order/[id]
      const response = await fetch(`/api/custom-order/${id}`);
      if (response.ok) {
        const data = await response.json();
        setShipping(prev => ({ ...prev, name: data.name || "" }));
        setOrder(data);
      } else {
        toast.error("Order not found or not available for payment.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load order.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    
    // Validate shipping
    if (!shipping.address || !shipping.city || !shipping.postalCode) {
        toast.error("Please fill in all shipping fields");
        return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/checkout/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          shippingAddress: shipping,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Checkout failed");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to start checkout");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">The custom order you are looking for does not exist or has already been processed.</p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    );
  }

  if (order.status === 'paid' || order.status === 'fulfilled') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="bg-green-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Completed</h1>
            <p className="text-muted-foreground mb-6">This order has already been paid for. Thank you!</p>
            <Button onClick={() => router.push("/")}>Return to Shop</Button>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center">
             <Button variant="ghost" className="mr-4" onClick={() => router.push('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shop
             </Button>
             <h1 className="text-2xl font-bold">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                        <CardDescription>Custom Order #{order.orderId}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="aspect-video relative bg-muted rounded-md overflow-hidden">
                             {/* Use first image or placeholder */}
                             {order.images && order.images.length > 0 ? (
                                <img src={order.images[0]} alt="Custom Order" className="w-full h-full object-cover" />
                             ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">No Preview Available</div>
                             )}
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Item Type</span>
                                <span className="font-medium capitalize">{order.details.orderType?.replace('_', ' ') || 'Custom Item'}</span>
                             </div>
                             {order.details.material && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Material</span>
                                    <span className="font-medium capitalize">{order.details.material}</span>
                                </div>
                             )}
                             <Separator className="my-2" />
                             <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>{order.price} {order.currency}</span>
                             </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/30 text-xs text-muted-foreground p-4">
                        * Production will begin immediately after payment confirmation.
                    </CardFooter>
                </Card>
            </div>

            {/* Checkout Form */}
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Details</CardTitle>
                        <CardDescription>Where should we send your custom piece?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input 
                                    id="name" 
                                    required 
                                    value={shipping.name}
                                    onChange={(e) => setShipping({...shipping, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input 
                                    id="address" 
                                    placeholder="Street, Number, Building..." 
                                    required 
                                    value={shipping.address}
                                    onChange={(e) => setShipping({...shipping, address: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input 
                                        id="city" 
                                        required 
                                        value={shipping.city}
                                        onChange={(e) => setShipping({...shipping, city: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input 
                                        id="postalCode" 
                                        required 
                                        value={shipping.postalCode}
                                        onChange={(e) => setShipping({...shipping, postalCode: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input 
                                    id="country" 
                                    disabled 
                                    value={shipping.country}
                                />
                            </div>

                            <Button type="submit" className="w-full mt-6" size="lg" disabled={processing}>
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Pay {order.price} {order.currency}
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground mt-2">
                                Secured by Stripe. Your payment information is formatted secure.
                            </p>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
