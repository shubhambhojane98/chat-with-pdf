"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className=" grid grid-cols-3  mx-auto px-4">
        {/* Support Email */}
        <div className="mb-1 text-center">
          <p>
            Need Help? Contact us at:
            <a
              href="mailto:support@example.com"
              className="text-blue-400 hover:underline ml-1"
            >
              support@example.com
            </a>
          </p>
        </div>

        {/* Social Media Links */}
        <div className="mb-1 text-center">
          <p>Follow us on:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link href="https://x.com">
              <Image
                alt="X.com"
                height={30}
                width={30}
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-logo-icon.png"
              />
            </Link>
          </div>
        </div>

        {/* Additional Links using Next.js Link component */}
        <div className="text-center mb-1">
          <Link href="/terms" className="text-gray-400 hover:underline">
            Terms of Service
          </Link>
          {" | "}
          <Link href="/privacy" className="text-gray-400 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
