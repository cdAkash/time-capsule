"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ThankYouModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Thank You!</DialogTitle>
          <DialogDescription className="text-center">
            Your time capsule has been created successfully. We'll deliver it on the date you specified.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-center">
          <p className="text-muted-foreground">
            Thank You for using our service.
          </p>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

