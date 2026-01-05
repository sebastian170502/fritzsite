/**
 * Custom Order Dialogs
 * Reusable dialog components for custom order flows
 */

"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface PhoneDialogProps {
  open: boolean;
  phone: string;
  onPhoneChange: (phone: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PhoneDialog({
  open,
  phone,
  onPhoneChange,
  onConfirm,
  onCancel,
}: PhoneDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Save Phone Number?</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to save this phone number to your profile for future
            orders?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="confirm-phone">Phone Number</Label>
          <Input
            id="confirm-phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Skip</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Save to Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SuccessDialog({ open, onClose }: SuccessDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Order Request Submitted!</AlertDialogTitle>
          <AlertDialogDescription>
            Thank you for your custom order request. We&apos;ll review your
            specifications and contact you within 24-48 hours with a quote and
            estimated timeline.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Link href="/shop">Continue Shopping</Link>
          </AlertDialogAction>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
