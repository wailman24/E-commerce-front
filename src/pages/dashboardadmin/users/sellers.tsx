import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
//import { user } from "../../../pages/auth/signup";
//import { getallusers } from "../../../services/Auth/auth";
import { getallseller, seller } from "../../../services/home/seller";

export default function Sellers() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<seller[]>([]);
  //const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    const fetchProds = async () => {
      try {
        const response = await getallseller(token);
        if ("error" in response) {
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchProds();
  }, [token]);

  const handleAbout = async (id: number) => {
    console.log("user with ID:", id);
    // Handle the action for the selected user here
  };
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
                handleAbout(row.original.id);
              }}
            >
              About
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
