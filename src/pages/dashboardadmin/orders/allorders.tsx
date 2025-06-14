import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  //DropdownMenuItem,
  //  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useNavigate } from "react-router-dom";
import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
//import { deleteuser, getallusers } from "../../../services/Auth/auth";
import { getallorders, order } from "../../../services/home/order";

export default function AllOrders() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<order[]>([]);
  // const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProds = async () => {
      try {
        setLoading(true);

        const response = await getallorders(token);
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
    fetchProds();
  }, [token]);
  const navigate = useNavigate();

  const handleAbout = async (id: number) => {
    console.log("order with ID:", id);
    navigate(`/Admin/dashboard/items-sold/${id}`);
  };

  const columns: ColumnDef<order>[] = [
    {
      accessorKey: "user",
      header: "User Name",
      cell: ({ row }) => row.original.user?.name,
    },
    {
      accessorKey: "address_delivery",
      header: "Delivery Address",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "total",
      header: "Total",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: order } }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Button variant="ghost" className="w-full justify-start" onClick={() => handleAbout(row.original.id!)}>
              View
            </Button>
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
