import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatDateString } from "@/helper/formateDate";

interface CustomAlertProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  cancelDate?: string;
}

const Alert = ({ open, setOpen, onConfirm, cancelDate }: CustomAlertProps) => {
  const handleCancel = () => {
    setOpen(false);
    console.log("Subscription cancellation aborted.");
  };
  console.log(cancelDate);
  const date = formatDateString(cancelDate!);

  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? Your access to
              premium features will continue until {date}. After that, you will
              lose access to all premium features. This action cannot be undone.
              You can also cancel your subscription from your PayPal account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              No, keep it
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              Yes, cancel it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Alert;
