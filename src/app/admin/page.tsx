"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, LogOut, Star } from "lucide-react";
import { toast } from "sonner";
import AdminReviewsPage from "./reviews/page";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  material: string;
  category: string;
  stock: number;
  images: string[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (response.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Product deleted successfully");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <h1 className="text-2xl font-heading font-bold">Admin Dashboard</h1>
          </div>

          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-3xl font-bold">{products.length}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground">In Stock</p>
                <p className="text-3xl font-bold">
                  {products.filter((p) => p.stock > 0).length}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-3xl font-bold">
                  {products.filter((p) => p.stock === 0).length}
                </p>
              </div>
            </div>
            {/* Products Section */}
            <div className="bg-card border border-border rounded-lg">
              <div className="p-6 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-heading font-bold">Products</h2>
                <Button onClick={() => router.push("/admin/products/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading products...
                </div>
              ) : products.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No products found. Add your first product!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 font-semibold">Name</th>
                        <th className="text-left p-4 font-semibold">
                          Category
                        </th>
                        <th className="text-left p-4 font-semibold">
                          Material
                        </th>
                        <th className="text-right p-4 font-semibold">Price</th>
                        <th className="text-right p-4 font-semibold">Stock</th>
                        <th className="text-right p-4 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <span className="font-medium">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 capitalize">
                            {product.category.replace("-", " ")}
                          </td>
                          <td className="p-4 capitalize">
                            {product.material.replace("-", " ")}
                          </td>
                          <td className="p-4 text-right">
                            {new Intl.NumberFormat("ro-RO", {
                              style: "currency",
                              currency: "RON",
                            }).format(product.price)}
                          </td>
                          <td className="p-4 text-right">
                            <span
                              className={
                                product.stock === 0
                                  ? "text-destructive font-semibold"
                                  : product.stock < 5
                                  ? "text-yellow-500 font-semibold"
                                  : ""
                              }
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                router.push(`/admin/products/${product.id}`)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>{" "}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <AdminReviewsPage />
          </TabsContent>
        </Tabs>{" "}
      </main>
    </div>
  );
}
