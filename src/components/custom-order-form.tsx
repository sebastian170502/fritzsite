"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Link from "next/link";
import { isValidEmail } from "@/lib/helpers";

interface Product {
  id: string;
  name: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
}

interface CustomOrderFormProps {
  products: Product[];
  customer?: Customer | null;
}

interface FormData {
  email: string;
  phone: string;
  orderType: "scratch" | "modify";
  material?: string;
  bladeWidth?: string;
  bladeLength?: string;
  handleLength?: string;
  productId?: string;
  modifications?: string;
  additionalNotes: string;
}

export function CustomOrderForm({ products, customer }: CustomOrderFormProps) {
  const [scratchImages, setScratchImages] = useState<string[]>([]);
  const [modifyImages, setModifyImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Dialog State
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  const [scratchForm, setScratchForm] = useState<Partial<FormData>>({
    orderType: "scratch",
    email: customer?.email || "",
    phone: customer?.phone || "",
    additionalNotes: "",
  });
  
  const [modifyForm, setModifyForm] = useState<Partial<FormData>>({
    orderType: "modify",
    email: customer?.email || "",
    phone: customer?.phone || "",
    modifications: "",
    additionalNotes: "",
  });

  // Handle Phone Blur logic
  const handlePhoneBlur = (phone: string) => {
    // Only trigger if:
    // 1. User is logged in (customer exists)
    // 2. User does NOT have a phone saved in profile
    // 3. User entered a valid-ish phone number
    if (customer && !customer.phone && phone.length > 5) {
      setPendingPhone(phone);
      setShowPhoneDialog(true);
    }
  };

  const savePhoneToProfile = async () => {
    try {
      const response = await fetch("/api/customer/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: pendingPhone }),
      });

      if (response.ok) {
        toast.success("Phone number saved to profile!");
        // Update local state or trigger re-fetch if needed, 
        // but for now UI update is sufficient as form already has value
      } else {
        toast.error("Failed to save phone number");
      }
    } catch (error) {
      toast.error("Error saving phone number");
    } finally {
      setShowPhoneDialog(false);
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImages: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeImage = (
    index: number,
    images: string[],
    setImages: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleScratchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!scratchForm.email || !isValidEmail(scratchForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (
      !scratchForm.material ||
      !scratchForm.bladeWidth ||
      !scratchForm.bladeLength ||
      !scratchForm.handleLength
    ) {
      toast.error("Please fill in all dimensions and material");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scratchForm),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessDialog(true);
        setScratchForm({
          orderType: "scratch",
          email: customer?.email || "",
          phone: customer?.phone || "",
          additionalNotes: "",
        });
        setScratchImages([]);
      } else {
        toast.error(data.error || "Failed to submit order");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modifyForm.email || !isValidEmail(modifyForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!modifyForm.productId) {
      toast.error("Please select a product to modify");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modifyForm),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessDialog(true);
        setModifyForm({
          orderType: "modify",
          email: customer?.email || "",
          phone: customer?.phone || "",
          modifications: "",
          additionalNotes: "",
        });
        setModifyImages([]);
      } else {
        toast.error(data.error || "Failed to submit order");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Tabs defaultValue="scratch" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-secondary/30 rounded-full">
          <TabsTrigger
            value="scratch"
            className="rounded-full h-full text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Start from Scratch
          </TabsTrigger>
          <TabsTrigger
            value="modify"
            className="rounded-full h-full text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Modify from Shop
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: START FROM SCRATCH */}
        <TabsContent value="scratch">
          <form onSubmit={handleScratchSubmit}>
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle>Start Custom Order Request</CardTitle>
                <CardDescription>
                  Share details and specific wishes about your product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Material Selection */}
                <div className="space-y-2">
                  <Label htmlFor="material-new">Dominant Material *</Label>
                  <Select
                    value={scratchForm.material}
                    onValueChange={(value) =>
                      setScratchForm({ ...scratchForm, material: value })
                    }
                    required
                  >
                    <SelectTrigger id="material-new">
                      <SelectValue placeholder="Choose main material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carbon-steel">Carbon Steel</SelectItem>
                      <SelectItem value="stainless-steel">
                        Stainless Steel
                      </SelectItem>
                      <SelectItem value="wrought-iron">Wrought Iron</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dimensions */}
                <div className="space-y-4">
                  <Label>Estimated Dimensions</Label>

                  <div className="relative w-full h-48 bg-secondary/20 rounded-lg overflow-hidden border border-border flex items-center justify-center">
                    <Image
                      src="/dimensions-guide-v4.png"
                      alt="Dimensions Guide"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="handle-length"
                        className="text-xs text-muted-foreground uppercase tracking-wide"
                      >
                        1. Handle Length (cm) *
                      </Label>
                      <Select
                        value={scratchForm.handleLength}
                        onValueChange={(value) =>
                          setScratchForm({
                            ...scratchForm,
                            handleLength: value,
                          })
                        }
                        required
                      >
                        <SelectTrigger id="handle-length">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 6 }, (_, i) => i + 10).map(
                            (num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} cm
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="blade-length"
                        className="text-xs text-muted-foreground uppercase tracking-wide"
                      >
                        2. Blade Length (cm) *
                      </Label>
                      <Select
                        value={scratchForm.bladeLength}
                        onValueChange={(value) =>
                          setScratchForm({ ...scratchForm, bladeLength: value })
                        }
                        required
                      >
                        <SelectTrigger id="blade-length">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 26 }, (_, i) => i + 5).map(
                            (num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} cm
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="blade-width"
                        className="text-xs text-muted-foreground uppercase tracking-wide"
                      >
                        3. Blade Width (cm) *
                      </Label>
                      <Select
                        value={scratchForm.bladeWidth}
                        onValueChange={(value) =>
                          setScratchForm({ ...scratchForm, bladeWidth: value })
                        }
                        required
                      >
                        <SelectTrigger id="blade-width">
                          <SelectValue placeholder="Select width" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {Array.from({ length: 7 }, (_, i) => i + 1).map(
                            (num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} cm
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="notes-new">Product Description</Label>
                  <Textarea
                    id="notes-new"
                    value={scratchForm.additionalNotes}
                    onChange={(e) =>
                      setScratchForm({
                        ...scratchForm,
                        additionalNotes: e.target.value,
                      })
                    }
                    placeholder="Describe what you want (e.g. 'Hand-forged hammer with oak handle')"
                    className="min-h-[120px]"
                  />
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label htmlFor="file-new">Upload Reference Pictures</Label>
                  <Input
                    id="file-new"
                    type="file"
                    multiple
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => handleImageChange(e, setScratchImages)}
                  />

                  {scratchImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {scratchImages.map((src, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border border-border group"
                        >
                          <Image
                            src={src}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index,
                                scratchImages,
                                setScratchImages
                              )
                            }
                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-new">Email *</Label>
                    <Input
                      id="email-new"
                      type="email"
                      value={scratchForm.email}
                      onChange={(e) =>
                        setScratchForm({
                          ...scratchForm,
                          email: e.target.value,
                        })
                      }
                      placeholder="your@email.com"
                      required
                      disabled={!!customer?.email}
                      className={customer?.email ? "bg-muted text-muted-foreground" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-new">Phone</Label>
                    <Input
                      id="phone-new"
                      type="tel"
                      value={scratchForm.phone}
                      onChange={(e) =>
                        setScratchForm({
                          ...scratchForm,
                          phone: e.target.value,
                        })
                      }
                      onBlur={(e) => handlePhoneBlur(e.target.value)}
                      placeholder="+40 XXX XXX XXX"
                      disabled={!!customer?.phone}
                      className={customer?.phone ? "bg-muted text-muted-foreground" : ""}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full rounded-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Custom Order
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        {/* TAB 2: MODIFY EXISTING */}
        <TabsContent value="modify">
          <form onSubmit={handleModifySubmit}>
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle>Modify Existing Product</CardTitle>
                <CardDescription>
                  Select a product from our shop and describe modifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Selection */}
                <div className="space-y-2">
                  <Label htmlFor="product-select">Select Product *</Label>
                  <Select
                    value={modifyForm.productId}
                    onValueChange={(value) =>
                      setModifyForm({ ...modifyForm, productId: value })
                    }
                    required
                  >
                    <SelectTrigger id="product-select">
                      <SelectValue placeholder="Choose a product to modify" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Modifications */}
                <div className="space-y-2">
                  <Label htmlFor="modifications">Desired Modifications *</Label>
                  <Textarea
                    id="modifications"
                    value={modifyForm.modifications}
                    onChange={(e) =>
                      setModifyForm({
                        ...modifyForm,
                        modifications: e.target.value,
                      })
                    }
                    placeholder="Describe changes (e.g. 'Make handle 5cm longer, add custom engraving')"
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes-modify">Additional Notes</Label>
                  <Textarea
                    id="notes-modify"
                    value={modifyForm.additionalNotes}
                    onChange={(e) =>
                      setModifyForm({
                        ...modifyForm,
                        additionalNotes: e.target.value,
                      })
                    }
                    placeholder="Any other specifications or preferences"
                    className="min-h-[80px]"
                  />
                </div>

                {/* Images */}
                <div className="space-y-2">
                  <Label htmlFor="file-modify">Upload Reference Pictures</Label>
                  <Input
                    id="file-modify"
                    type="file"
                    multiple
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => handleImageChange(e, setModifyImages)}
                  />

                  {modifyImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {modifyImages.map((src, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden border border-border group"
                        >
                          <Image
                            src={src}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeImage(index, modifyImages, setModifyImages)
                            }
                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-modify">Email *</Label>
                    <Input
                      id="email-modify"
                      type="email"
                      value={modifyForm.email}
                      onChange={(e) =>
                        setModifyForm({ ...modifyForm, email: e.target.value })
                      }
                      placeholder="your@email.com"
                      required
                      disabled={!!customer?.email}
                      className={customer?.email ? "bg-muted text-muted-foreground" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-modify">Phone</Label>
                    <Input
                      id="phone-modify"
                      type="tel"
                      value={modifyForm.phone}
                      onChange={(e) =>
                        setModifyForm({ ...modifyForm, phone: e.target.value })
                      }
                      onBlur={(e) => handlePhoneBlur(e.target.value)}
                      placeholder="+40 XXX XXX XXX"
                      disabled={!!customer?.phone}
                      className={customer?.phone ? "bg-muted text-muted-foreground" : ""}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full rounded-full"
                  size="lg"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Custom Order
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
      
      {/* Phone Save Dialog */}
      <AlertDialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Phone Number?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to save this phone number to your profile for future use?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPhoneDialog(false)}>No, thanks</AlertDialogCancel>
            <AlertDialogAction onClick={savePhoneToProfile}>Yes, save it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <AlertDialogTitle className="text-center text-2xl">Custom Order Submitted!</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="text-center space-y-4 pt-2 text-base text-muted-foreground">
                <p>
                  We have received your request and will review it shortly. You will be contacted within 24 hours with a quote or clarification questions.
                </p>
                <div className="bg-secondary/20 p-4 rounded-lg text-sm border border-border/50">
                  <p className="font-medium mb-1 text-foreground">Need to add more details?</p>
                  <p>
                    If you have any other additional requirements for your custom order, please email us directly at:
                  </p>
                  <a href="mailto:fritzsforge@gmail.com" className="text-primary font-bold hover:underline mt-1 block">
                    fritzsforge@gmail.com
                  </a>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3">
            {customer && (
                <Button variant="outline" asChild className="w-full sm:w-auto min-w-[120px]">
                    <Link href="/customer">View My Orders</Link>
                </Button>
            )}
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)} className="w-full sm:w-auto min-w-[120px]">
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
