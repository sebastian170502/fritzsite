/**
 * Scratch Order Form
 * Form for creating custom orders from scratch
 */

"use client";

import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

interface ScratchFormData {
  email: string;
  phone: string;
  material?: string;
  bladeWidth?: string;
  bladeLength?: string;
  handleLength?: string;
  additionalNotes: string;
}

interface ScratchOrderFormProps {
  formData: ScratchFormData;
  images: string[];
  loading: boolean;
  disabled?: boolean;
  onFormChange: (data: Partial<ScratchFormData>) => void;
  onImagesChange: (images: string[]) => void;
  onSubmit: (e: FormEvent) => void;
  onPhoneBlur?: (phone: string) => void;
}

export function ScratchOrderForm({
  formData,
  images,
  loading,
  disabled = false,
  onFormChange,
  onImagesChange,
  onSubmit,
  onPhoneBlur,
}: ScratchOrderFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Build from Scratch</CardTitle>
          <CardDescription>
            Design a completely custom tool tailored to your specifications.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scratch-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scratch-email"
                type="email"
                value={formData.email}
                onChange={(e) => onFormChange({ email: e.target.value })}
                placeholder="your@email.com"
                required
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scratch-phone">Phone</Label>
              <Input
                id="scratch-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onFormChange({ phone: e.target.value })}
                onBlur={(e) => onPhoneBlur?.(e.target.value)}
                placeholder="+1 (555) 000-0000"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Tool Specifications</h3>

            <div className="space-y-2">
              <Label htmlFor="scratch-material">
                Material <span className="text-red-500">*</span>
              </Label>
              <Input
                id="scratch-material"
                value={formData.material || ""}
                onChange={(e) => onFormChange({ material: e.target.value })}
                placeholder="e.g., Carbon Steel, Stainless Steel"
                required
                disabled={disabled}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scratch-blade-width">
                  Blade Width <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="scratch-blade-width"
                  value={formData.bladeWidth || ""}
                  onChange={(e) => onFormChange({ bladeWidth: e.target.value })}
                  placeholder="e.g., 2 inches"
                  required
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scratch-blade-length">
                  Blade Length <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="scratch-blade-length"
                  value={formData.bladeLength || ""}
                  onChange={(e) =>
                    onFormChange({ bladeLength: e.target.value })
                  }
                  placeholder="e.g., 8 inches"
                  required
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scratch-handle-length">
                  Handle Length <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="scratch-handle-length"
                  value={formData.handleLength || ""}
                  onChange={(e) =>
                    onFormChange({ handleLength: e.target.value })
                  }
                  placeholder="e.g., 4 inches"
                  required
                  disabled={disabled}
                />
              </div>
            </div>
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
            <Label htmlFor="scratch-notes">
              Additional Notes / Special Requests
            </Label>
            <Textarea
              id="scratch-notes"
              value={formData.additionalNotes}
              onChange={(e) =>
                onFormChange({ additionalNotes: e.target.value })
              }
              placeholder="Any additional details or special requests..."
              rows={4}
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
              "Submit Custom Order Request"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
