/**
 * Custom Order Form - Refactored
 * Main component that orchestrates scratch and modify order forms
 *
 * This is a refactored version that breaks down a 732-line component into:
 * - ImageUpload component (reusable)
 * - ScratchOrderForm component
 * - ModifyOrderForm component
 * - Dialogs component (phone & success)
 */

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { isValidEmail } from "@/lib/helpers";
import { ScratchOrderForm } from "./custom-orders/scratch-order-form";
import { ModifyOrderForm } from "./custom-orders/modify-order-form";
import { PhoneDialog, SuccessDialog } from "./custom-orders/dialogs";

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
  // State for images
  const [scratchImages, setScratchImages] = useState<string[]>([]);
  const [modifyImages, setModifyImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [pendingPhone, setPendingPhone] = useState("");

  // Form state
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

  /**
   * Handle phone number blur - prompt to save to profile
   */
  const handlePhoneBlur = (phone: string) => {
    if (customer && !customer.phone && phone.trim().length >= 10) {
      setPendingPhone(phone);
      setShowPhoneDialog(true);
    }
  };

  /**
   * Save phone number to customer profile
   */
  const savePhoneToProfile = async () => {
    try {
      const response = await fetch("/api/customer/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: pendingPhone }),
      });

      if (response.ok) {
        toast.success("Phone number saved to your profile");
      }
    } catch (error) {
      console.error("Failed to save phone:", error);
    } finally {
      setShowPhoneDialog(false);
    }
  };

  /**
   * Submit scratch order
   */
  const handleScratchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
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
        body: JSON.stringify({
          ...scratchForm,
          images: scratchImages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessDialog(true);
        // Reset form
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

  /**
   * Submit modify order
   */
  const handleModifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!modifyForm.email || !isValidEmail(modifyForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!modifyForm.productId) {
      toast.error("Please select a product to modify");
      return;
    }

    if (!modifyForm.modifications?.trim()) {
      toast.error("Please describe your desired modifications");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/custom-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...modifyForm,
          images: modifyImages,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessDialog(true);
        // Reset form
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
            Build from Scratch
          </TabsTrigger>
          <TabsTrigger
            value="modify"
            className="rounded-full h-full text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            Modify Existing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scratch" className="mt-6">
          <ScratchOrderForm
            formData={scratchForm as any}
            images={scratchImages}
            loading={loading}
            disabled={!!customer?.email && !!customer?.phone}
            onFormChange={(data) => setScratchForm({ ...scratchForm, ...data })}
            onImagesChange={setScratchImages}
            onSubmit={handleScratchSubmit}
            onPhoneBlur={handlePhoneBlur}
          />
        </TabsContent>

        <TabsContent value="modify" className="mt-6">
          <ModifyOrderForm
            formData={modifyForm as any}
            images={modifyImages}
            products={products}
            loading={loading}
            disabled={!!customer?.email && !!customer?.phone}
            onFormChange={(data) => setModifyForm({ ...modifyForm, ...data })}
            onImagesChange={setModifyImages}
            onSubmit={handleModifySubmit}
            onPhoneBlur={handlePhoneBlur}
          />
        </TabsContent>
      </Tabs>

      {/* Phone Save Dialog */}
      <PhoneDialog
        open={showPhoneDialog}
        phone={pendingPhone}
        onPhoneChange={setPendingPhone}
        onConfirm={savePhoneToProfile}
        onCancel={() => setShowPhoneDialog(false)}
      />

      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />
    </div>
  );
}
