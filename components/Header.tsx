import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { FilePlus } from "lucide-react";
import UpgradeButton from "./UpgradeButton";

const Header = () => {
  return (
    <div className="flex justify-between bg-white shadow-sm p-5 border-b">
      <Link href="/dashboard" className="text-2xl">
        PDF <span className="text-indigo-600">Dialouge</span>
      </Link>
      <SignedIn>
        <div className="flex items-center space-x-2">
          <Button asChild variant="link" className="hidden md:flex">
            <Link href="/dashboard/upgrade">Pricing</Link>
          </Button>

          {/* <Button asChild variant="link" className="hidden md:flex">
            <Link href="/dashboard/subscriptionsPortal">
              Manage Subscription
            </Link>
          </Button> */}

          <Button asChild variant="outline">
            <Link href="/dashboard">My Documents</Link>
          </Button>

          <Button asChild variant="outline" className="border-indigo-600">
            <Link href="/dashboard/upload">
              <FilePlus className="text-indigo-600" />
            </Link>
          </Button>

          <UpgradeButton />
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
};

export default Header;
