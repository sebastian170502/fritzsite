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
import {
  Activity,
  Search,
  Filter,
  ArrowLeft,
  User,
  Package,
  ShoppingCart,
  Star,
  Settings,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface ActivityLog {
  id: string;
  action: string;
  type: "product" | "order" | "review" | "setting" | "user";
  user: string;
  details: string;
  timestamp: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      action: "Created Product",
      type: "product",
      user: "admin",
      details: 'Created new product "Handmade Ceramic Vase"',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "2",
      action: "Updated Order Status",
      type: "order",
      user: "admin",
      details: "Changed order #ORD-001 status from pending to processing",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "3",
      action: "Approved Review",
      type: "review",
      user: "admin",
      details: "Approved review for product Wooden Bowl",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "4",
      action: "Updated Settings",
      type: "setting",
      user: "admin",
      details: "Changed shipping fee to $9.99",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "5",
      action: "Deleted Product",
      type: "product",
      user: "admin",
      details: 'Deleted product "Old Item"',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterType === "all" || log.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="h-4 w-4" />;
      case "order":
        return <ShoppingCart className="h-4 w-4" />;
      case "review":
        return <Star className="h-4 w-4" />;
      case "setting":
        return <Settings className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-blue-100 text-blue-700";
      case "order":
        return "bg-green-100 text-green-700";
      case "review":
        return "bg-yellow-100 text-yellow-700";
      case "setting":
        return "bg-purple-100 text-purple-700";
      case "user":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now.getTime() - then.getTime();

    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold">Activity Logs</h1>
              <p className="text-gray-600">
                Track all admin actions and system events
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search activity logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="h-10 px-3 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="product">Products</option>
                  <option value="order">Orders</option>
                  <option value="review">Reviews</option>
                  <option value="setting">Settings</option>
                  <option value="user">Users</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">
                {logs.filter((l) => l.type === "product").length}
              </div>
              <div className="text-xs text-gray-600">Products</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">
                {logs.filter((l) => l.type === "order").length}
              </div>
              <div className="text-xs text-gray-600">Orders</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">
                {logs.filter((l) => l.type === "review").length}
              </div>
              <div className="text-xs text-gray-600">Reviews</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">
                {logs.filter((l) => l.type === "setting").length}
              </div>
              <div className="text-xs text-gray-600">Settings</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold">
                {logs.filter((l) => l.type === "user").length}
              </div>
              <div className="text-xs text-gray-600">Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Logs List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              {filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""}{" "}
              found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`p-2 rounded-lg ${getTypeBadgeColor(
                          log.type
                        )}`}
                      >
                        {getTypeIcon(log.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{log.action}</h3>
                          <Badge className={getTypeBadgeColor(log.type)}>
                            {log.type}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">
                          {log.details}
                        </p>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{log.user}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{getTimeAgo(log.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No activity logs found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
