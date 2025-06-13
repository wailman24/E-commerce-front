import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
import { getselleritems, item, updateitemstatus } from "../../../services/home/order";

export default function Orderseller() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<item[]>([]);
  const [selectedItem, setSelectedItem] = React.useState<item | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProds = async () => {
      try {
        setLoading(true);

        const response = await getselleritems(token);
        if ("error" in response) {
          setData([]);
        } else {
          setData(response);
          console.log(response);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, [token]);

  const handleStatusUpdate = async () => {
    try {
      if (!selectedItem) return;

      const result = await updateitemstatus(token, selectedItem.id, newStatus);

      if (result && "error" in result) {
        setError(result.error);
        console.log(error);
      } else {
        setData((prev) => prev.map((item) => (item.id === selectedItem.id ? { ...item, status: newStatus } : item)));

        setStatusDialogOpen(false);
        console.log("item:", selectedItem);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const columns: ColumnDef<item>[] = [
    {
      accessorKey: "product",
      header: "Product Name",
      cell: ({ row }) => row.original.product.name,
    },
    {
      accessorKey: "adress_delivery",
      header: "Delivery Address",
      cell: ({ row }) => row.original.adress_delivery || "N/A",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "qte",
      header: "Quantity",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setSelectedItem(row.original);
                setNewStatus(row.original.status!);
                setStatusDialogOpen(true);
              }}
            >
              Edit Status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <DataTable columns={columns} data={data} loading={loading} />

      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
          </DialogHeader>

          <Select value={newStatus} onValueChange={(val) => setNewStatus(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
