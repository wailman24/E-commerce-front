import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { BarChart2, Package, ShoppingCart, DollarSign } from "lucide-react";

const DashboardHome = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-lg font-semibold">28</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-lg font-semibold">132</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <DollarSign className="w-6 h-6 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-lg font-semibold">$5,240</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <BarChart2 className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Performance</p>
              <p className="text-lg font-semibold">+18%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Later: add recent orders and chart */}
    </div>
  );
};

export default DashboardHome;
