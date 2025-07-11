import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
import { deleteseller, getpendingsellers, seller, updatesellerstatus } from "../../../services/home/seller";

export default function PendingSellers() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<seller[]>([]);
  //const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);

        const response = await getpendingsellers(token);
        if ("error" in response) {
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, [token]);

  const handleStatusChange = async (sellerId: number, newStatus: string) => {
    try {
      await updatesellerstatus(token, sellerId, newStatus);
      setData((prevData) => prevData.map((seller) => (seller.id === sellerId ? { ...seller, status: newStatus } : seller)));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this seller?");
    if (!confirmed) return;

    try {
      const response = await deleteseller(token!, id);
      if (!("error" in response)) {
        // Remove the deleted seller from local state
        setData((prev) => prev.filter((s) => s.id !== id));
      } else {
        console.error("Delete failed:", response.error);
      }
    } catch (error) {
      console.error("Failed to delete seller:", error);
    }
  };

  /*  const handleStatusChange = async (sellerId: number, newStatus: string) => {
    try {
      const result = await updatesellerstatus(token, sellerId, newStatus);

      if (result && "error" in result) {
        setError(result.error);
        console.log(error);
      } else {
        setData((prev) => prev.map((item) => (item.id === sellerId ? { ...item, status: newStatus } : item)));
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  }; */
  const columns: ColumnDef<seller>[] = [
    {
      accessorKey: "user",
      header: "Seller Name",
      cell: ({ row }) => row.original.user?.name,
    },
    {
      accessorKey: "adress",
      header: "Address",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "store",
      header: "Store",
    },
    {
      accessorKey: "paypal",
      header: "Paypal",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const seller = row.original;

        return (
          <Select value={seller.status} onValueChange={(value) => handleStatusChange(seller.id, value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        );
      },
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
                handleDelete(row.original.id);
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
