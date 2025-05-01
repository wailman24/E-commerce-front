import * as React from "react";
import { DataTable } from "../../components/data-table";
import { Button } from "../../components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { getsellerproducts, product } from "../../services/home/product";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../Context/AppContext";

export default function SimpleTableWithAddButton() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<product[]>([]);

  React.useEffect(() => {
    const fetchProds = async () => {
      try {
        //setLoading(true);
        const response = await getsellerproducts(token);
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
        //setLoading(false);
      }
    };

    fetchProds();
  }, [token]);

  const handleAdd = () => {
    /*  const newId = Math.max(...data.map((item) => item.id), 0) + 1;
    setData((prev) => [...prev, { id: newId, name: `New Product ${newId}`, price: 0, stock: 0, status: "Active", isvalide: "Yes" }]);
  */
  };

  const handleEdit = (id: number) => {
    console.log(`Edit clicked for id: ${id}`);
  };

  const handleDelete = (id: number) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const columns: ColumnDef<product>[] = [
    {
      id: "drag",
      header: () => null,
      //cell: ({ row }) => <span>::</span>,
    },
    {
      accessorKey: "name",
      header: "Product Name",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "isvalide",
      header: "Validity",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd} variant="outline" size="sm">
          <IconPlus className="mr-2" />
          Add Product
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
