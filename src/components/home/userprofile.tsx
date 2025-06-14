import React from "react";
import { user } from "../../pages/auth/signup";
import { seller } from "../../services/home/seller";

type Props = {
  user: user;
  seller?: seller;
};

const UserProfileDetails: React.FC<Props> = ({ user, seller }) => {
  console.log("UserProfileDetails component loaded with user:", user); // debug

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Seller Info (if available) */}
      {seller && (
        <div className="border p-6 rounded-lg shadow-md bg-white">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Seller Information</h3>
          <div className="flex items-center gap-4 mb-4">
            <img src={`http://127.0.0.1:8000/storage/${seller?.logo}`} alt="Main" className="w-20 h-20 rounded object-cover border" />{" "}
            <div>
              <p>
                <span className="font-medium">Store:</span> {seller.store}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {seller.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {seller.adress}
              </p>
              <p>
                <span className="font-medium">Status:</span> {seller.status}
              </p>
              <p>
                <span className="font-medium">PayPal:</span> {seller.paypal}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Info (always shown) */}
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">User Information</h3>
        <div className="flex items-center gap-4 mb-4">
          <img src={"/default-user.png"} alt="User" className="w-20 h-20 rounded-full object-cover border" />
          <div>
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Role:</span> {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDetails;
