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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Shield,
  Plus,
  Trash2,
  UserCog,
  Mail,
  Calendar,
  ArrowLeft,
  Edit,
} from "lucide-react";
import Link from "next/link";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "admin" | "moderator" | "viewer";
  createdAt: string;
  lastLogin?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: "1",
      username: "admin",
      email: "admin@fritzshop.com",
      role: "admin",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "moderator" | "viewer",
  });

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const user: AdminUser = {
      id: Date.now().toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: new Date().toISOString(),
    };

    setUsers([...users, user]);
    setNewUser({ username: "", email: "", password: "", role: "viewer" });
    setShowAddForm(false);
    toast.success("Admin user added successfully");
  };

  const handleDeleteUser = (id: string) => {
    if (users.length === 1) {
      toast.error("Cannot delete the last admin user");
      return;
    }

    if (!confirm("Are you sure you want to delete this admin user?")) return;

    setUsers(users.filter((user) => user.id !== id));
    toast.success("Admin user deleted successfully");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "moderator":
        return "bg-blue-100 text-blue-700";
      case "viewer":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold">Admin Users</h1>
                <p className="text-gray-600">
                  Manage admin access and permissions
                </p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin User
            </Button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Admin User</CardTitle>
              <CardDescription>
                Create a new admin account with specific permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    placeholder="admin_username"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="Enter secure password"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value as
                          | "admin"
                          | "moderator"
                          | "viewer",
                      })
                    }
                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                  >
                    <option value="viewer">Viewer (Read Only)</option>
                    <option value="moderator">Moderator (Edit Products)</option>
                    <option value="admin">Admin (Full Access)</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleAddUser} className="flex-1">
                  Add User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Users ({users.length})</CardTitle>
            <CardDescription>
              Manage access levels and permissions for admin users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <UserCog className="h-6 w-6 text-white" />
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {user.username}
                          </h3>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              Joined:{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {user.lastLogin && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Last login:{" "}
                                {new Date(user.lastLogin).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={users.length === 1}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Roles Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <Badge className="bg-red-100 text-red-700">Admin</Badge>
              <div>
                <p className="font-medium">Full Access</p>
                <p className="text-sm text-gray-600">
                  Can manage all aspects including products, orders, reviews,
                  settings, and admin users
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge className="bg-blue-100 text-blue-700">Moderator</Badge>
              <div>
                <p className="font-medium">Edit Products & Orders</p>
                <p className="text-sm text-gray-600">
                  Can edit products, manage orders, and moderate reviews, but
                  cannot access settings or admin users
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Badge className="bg-gray-100 text-gray-700">Viewer</Badge>
              <div>
                <p className="font-medium">Read Only</p>
                <p className="text-sm text-gray-600">
                  Can view analytics, products, orders, and reviews but cannot
                  make any changes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
