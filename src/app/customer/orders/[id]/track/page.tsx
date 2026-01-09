"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
    Truck, 
    ArrowLeft, 
    Package, 
    CheckCircle, 
    Clock, 
    MapPin,
    Copy,
    ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface TrackingInfo {
    status: string;
    trackingNumber?: string;
    courierName?: string;
    trackingUrl?: string;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    items: any[];
}

export default function TrackOrderPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<TrackingInfo | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/customer/orders/${params.id}`);
                if (!res.ok) throw new Error("Order not found");
                const data = await res.json();
                setOrder(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load tracking info");
                router.push("/customer");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id, router]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!order) return null;

    const steps = [
        { status: "pending", label: "Order Placed", icon: Clock },
        { status: "processing", label: "Processing", icon: Package },
        { status: "shipped", label: "Shipped", icon: Truck },
        { status: "delivered", label: "Delivered", icon: CheckCircle },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/customer">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Link>
            </Button>

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Track Order</h1>
                    <p className="text-muted-foreground">Order ID: {params.id}</p>
                </div>

                {/* Status Progress */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative flex justify-between">
                            {/* Progress Bar Background */}
                            <div className="absolute top-5 left-0 w-full h-1 bg-muted -z-10" />
                            
                            {/* Active Progress */}
                            <div 
                                className="absolute top-5 left-0 h-1 bg-primary -z-10 transition-all duration-500"
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;

                                return (
                                    <div key={step.status} className="flex flex-col items-center bg-background px-2">
                                        <div className={`
                                            p-2 rounded-full border-2 transition-colors duration-300
                                            ${isActive ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground bg-background"}
                                        `}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className={`text-sm mt-2 font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tracking Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Shipping Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.courierName && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Courier</p>
                                    <p className="font-medium">{order.courierName}</p>
                                </div>
                            )}
                            
                            {order.trackingNumber ? (
                                <div>
                                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="bg-muted px-2 py-1 rounded font-mono">
                                            {order.trackingNumber}
                                        </code>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(order.trackingNumber!)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    {order.trackingUrl && (
                                        <Button className="w-full mt-4" asChild>
                                            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="mr-2 h-4 w-4" />
                                                Track on Courier Website
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 bg-muted/50 rounded-lg text-center">
                                    <p className="text-muted-foreground">Tracking information will be available once your order is shipped.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Delivery Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Delivery Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1">
                                <p className="font-medium">{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
