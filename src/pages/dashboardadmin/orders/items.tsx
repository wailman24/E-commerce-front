import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  //DropdownMenuContent,
  //DropdownMenuItem,
  //  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useParams } from "react-router-dom";

import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
//import { deleteuser, getallusers } from "../../../services/Auth/auth";
import { getallitems, item } from "../../../services/home/order";

export default function Items() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { id } = useParams(); // this is the order ID if it exists

  const { token } = appContext;
  const [data, setData] = React.useState<item[]>([]);
  // const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getallitems(token);
        console.log("Full items response:", response);

        if ("error" in response) {
          setData([]);
        } else {
          // If an ID is provided, filter items by order_id
          if (id) {
            const filtered = response.filter((item) => item.order_id === Number(id));
            setData(filtered);
          } else {
            setData(response);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchItems();
  }, [token, id]);

  const columns: ColumnDef<item>[] = [
    {
      accessorKey: "product",
      header: "Product Name",

      cell: ({ row }) => {
        const name: string = row.original.product?.name || "";
        const words = name.split(" ");
        const truncated = words.slice(0, 4).join(" ");
        return (
          <span title={name}>
            {truncated}
            {words.length > 4 ? "..." : ""}
          </span>
        );
      },
    },
    {
      accessorKey: "qte",
      header: "quantity",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-bold">{id ? `Items for Order #${id}` : "All Items"}</h2>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
