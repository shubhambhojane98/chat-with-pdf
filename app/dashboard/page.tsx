import Documents from "@/components/Documents";
import PlaceholderDocument from "@/components/PlaceholderDocument";
import React from "react";

export const dynamic = "force-dynamic";

const Dashboard = () => {
  return (
    <div className="h-full max-w-7xl mx-auto">
      <h1 className="text-3xl p-5 bg-gray-100 front-extralight text-indigo-600">
        My Documents
      </h1>
      <Documents />

      <PlaceholderDocument />
    </div>
  );
};

export default Dashboard;
