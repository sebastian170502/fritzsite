"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingCart,
  DollarSign,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const orders = await response.json();

        // Aggregate customer data from orders
        const customerMap = new Map<string, Customer>();

        orders.forEach((order: any) => {
          const email = order.customerEmail;

          if (customerMap.has(email)) {
            const customer = customerMap.get(email)!;
            customer.totalOrders += 1;
            customer.totalSpent += Number(order.total);

            // Update last order date if this order is more recent
            if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
              customer.lastOrderDate = order.createdAt;
            }
          } else {
            customerMap.set(email, {
              id: order.id,
              name: order.customerName,
              email: order.customerEmail,
              phone: order.customerPhone,
              totalOrders: 1,
              totalSpent: Number(order.total),
              lastOrderDate: order.createdAt,
              createdAt: order.createdAt,
            });
          }
        });

        setCustomers(Array.from(customerMap.values()));
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort by total spent (descending)
  const sortedCustomers = [...filteredCustomers].sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  const stats = {
    totalCustomers: customers.length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageOrderValue:
      customers.length > 0
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) /
          customers.reduce((sum, c) => sum + c.totalOrders, 0)
        : 0,
    repeatCustomers: customers.filter((c) => c.totalOrders > 1).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold">Customer Management</h1>
                <p className="text-gray-600">
                  View and manage all customer information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {stats.totalCustomers}
                </span>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ${stats.totalRevenue.toFixed(2)}
                </span>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ${stats.averageOrderValue.toFixed(2)}
                </span>
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Repeat Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {stats.repeatCustomers}
                </span>
                <Badge variant="secondary">
                  {customers.length > 0
                    ? Math.round(
                        (stats.repeatCustomers / customers.length) * 100
                      )
                    : 0}
                  %
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>
              {sortedCustomers.length} customer
              {sortedCustomers.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedCustomers.map((customer) => (
                <div
                  key={customer.email}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {customer.name}
                        </h3>
                        {customer.totalOrders > 1 && (
                          <Badge variant="secondary">Repeat Customer</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{customer.email}</span>
                        </div>

                        {customer.phone && (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{customer.phone}</span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-gray-600">
                          <ShoppingCart className="h-4 w-4" />
                          <span>
                            {customer.totalOrders} order
                            {customer.totalOrders !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Last order:{" "}
                            {new Date(
                              customer.lastOrderDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        ${customer.totalSpent.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Total Spent</div>
                    </div>
                  </div>
                </div>
              ))}

              {sortedCustomers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No customers found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
