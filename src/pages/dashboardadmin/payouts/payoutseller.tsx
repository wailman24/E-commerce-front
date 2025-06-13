import * as React from "react";
import { AppContext } from "../../../Context/AppContext";
//import { toast } from "../../../components/ui/use-toast";
import { Button } from "../../../components/ui/button";

import { getPendingPayouts, paySeller, SellerPayout } from "../../../services/home/payment";
import { DataTable } from "../../../components/data-table"; // your reusable datatable
import { ColumnDef } from "@tanstack/react-table";

export default function SellerPayouts() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Must be used within AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<SellerPayout[]>([]);
  // const [loading, setLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getPendingPayouts(token!);
        if ("error" in response) {
          //setError(response.error);
          setData([]);
        } else {
          setData(response);
          console.log("payouts ", response);
          //setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handlePayout = async (sellerId: number) => {
    const confirm = window.confirm("Confirm payout to this seller?");
    if (!confirm) return;

    try {
      const result = await paySeller(token!, sellerId);

      if (!result) {
        console.error("Payout API returned null");
        return;
      }

      if (result && "error" in result) {
        console.error(result.error);
        // toast({ title: result.error, variant: "destructive" });
        return;
      }

      // Refetch the latest seller payout data
      const updated = await getPendingPayouts(token!);
      if (updated && !("error" in updated)) {
        setData(updated);
      } else {
        console.error(updated.error);
        // toast({ title: updated.error, variant: "destructive" });
      }

      // toast({ title: "Payout successful" });
    } catch (error) {
      console.error("Payout failed:", error);
      // toast({ title: "Payout failed", variant: "destructive" });
    }
  };

  const columns: ColumnDef<SellerPayout>[] = [
    {
      accessorKey: "seller_name",
      header: "Seller name",
    },
    {
      accessorKey: "seller_email",
      header: "Seller Email",
    },
    {
      accessorKey: "paid_amount",
      header: "Paid Amount (DA)",
    },
    {
      accessorKey: "unpaid_amount",
      header: "Unpaid Amount (DA)",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" className="cursor-pointer" onClick={() => handlePayout(row.original.seller_id)}>
          Pay
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Pending Seller Payouts</h2>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
