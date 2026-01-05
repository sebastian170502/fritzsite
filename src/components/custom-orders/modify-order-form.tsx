/**
 * Modify Order Form
 * Form for modifying existing products
 */

"use client";

import { FormEvent } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "./image-upload";

interface Product {
  id: string;
  name: string;
}

interface ModifyFormData {
  email: string;
  phone: string;
  productId?: string;
  modifications?: string;
  additionalNotes: string;
}

interface ModifyOrderFormProps {
  formData: ModifyFormData;
  images: string[];
  products: Product[];
  loading: boolean;
  disabled?: boolean;
  onFormChange: (data: Partial<ModifyFormData>) => void;
  onImagesChange: (images: string[]) => void;
  onSubmit: (e: FormEvent) => void;
  onPhoneBlur?: (phone: string) => void;
}

export function ModifyOrderForm({
  formData,
  images,
  products,
  loading,
  disabled = false,
  onFormChange,
  onImagesChange,
  onSubmit,
  onPhoneBlur,
}: ModifyOrderFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Modify Existing Product</CardTitle>
          <CardDescription>
            Select an existing product and describe your desired modifications.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="modify-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="modify-email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange({ email: e.target.value })}
                placeholder="your@email.com"
                required
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modify-phone">Phone</Label>
              <Input
                id="modify-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onFormChange({ phone: e.target.value })}
                onBlur={(e) => onPhoneBlur?.(e.target.value)}
                placeholder="+1 (555) 000-0000"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <Label htmlFor="modify-product">
              Select Product to Modify <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => onFormChange({ productId: value })}
              disabled={disabled}
            >
              <SelectTrigger id="modify-product">
                <SelectValue placeholder="Choose a product..." />
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
            <Label htmlFor="modify-modifications">
              Desired Modifications <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="modify-modifications"
              value={formData.modifications || ""}
              onChange={(e) => onFormChange({ modifications: e.target.value })}
              placeholder="Describe what you'd like changed (e.g., different handle material, blade length adjustment, custom engraving...)"
              rows={4}
              required
              disabled={disabled}
            />
          </div>

          {/* Reference Images */}
          <ImageUpload
            label="Reference Images (Optional)"
            images={images}
            onImagesChange={onImagesChange}
            maxImages={5}
          />

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="modify-notes">
              Additional Notes / Special Requests
            </Label>
            <Textarea
              id="modify-notes"
              value={formData.additionalNotes}
              onChange={(e) =>
                onFormChange({ additionalNotes: e.target.value })
              }
              placeholder="Any additional details or special requests..."
              rows={3}
              disabled={disabled}
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || disabled}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Modification Request"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
