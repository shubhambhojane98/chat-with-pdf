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

interface CustomAlertProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
}

const Alert = ({ open, setOpen, onConfirm }: CustomAlertProps) => {
  const handleCancel = () => {
    setOpen(false);
    console.log("Subscription cancellation aborted.");
  };
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your subscription? You will lose
              access to all premium features, and any unused subscription time
              will be forfeited. This action cannot be undone.
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
