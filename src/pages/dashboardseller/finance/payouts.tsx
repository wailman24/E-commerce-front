import * as React from "react";
import { AppContext } from "../../../Context/AppContext";
//import { toast } from "../../../components/ui/use-toast";
//import { Button } from "../../../components/ui/button";

import { getsellerpayout } from "../../../services/home/payment";
import type { Payouts } from "../../../services/home/payment";
import { DataTable } from "../../../components/data-table"; // your reusable datatable
import { ColumnDef } from "@tanstack/react-table";

export default function Payouts() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Must be used within AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<Payouts[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getsellerpayout(token!);
        if ("error" in response) {
          //setError(response.error);
          setData([]);
        } else {
          setData(response);
          console.log(response);
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

  const columns: ColumnDef<Payouts>[] = [
    {
      accessorKey: "paid_at",
      header: "Paid At",
    },
    {
      accessorKey: "seller_email",
      header: "Seller Email",
    },
    {
      accessorKey: "batch_id",
      header: "Batch ID",
    },
    {
      accessorKey: "amount_paid",
      header: "Paid Amount (DA)",
    },
    /*  {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button size="sm" className="cursor-pointer" onClick={() => handlePayout(row.original.id)}>
          Pay
        </Button>
      ),
    }, */
  ];

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Pending Seller Payouts</h2>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
