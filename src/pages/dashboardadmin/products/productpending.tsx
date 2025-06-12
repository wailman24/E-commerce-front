import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
//import { IconPlus } from "@tabler/icons-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { deleteproductAdmin, getnotvalidproductforadmin, product, updateproductstatus } from "../../../services/home/product";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
//import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../../../components/ui/drawer";
import { useNavigate } from "react-router-dom";

export default function ProductPending() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<product[]>([]);
  //const [showForm, setShowForm] = React.useState(false);
  //const [editProduct, setEditProduct] = React.useState<product | null>(null);

  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProds = async () => {
      try {
        //setLoading(true);
        const response = await getnotvalidproductforadmin(token);
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

  const handleStatusChange = async (productId: number, newStatus: boolean) => {
    try {
      console.log("Updating product", productId, "to", newStatus); // ✅ for debugging
      await updateproductstatus(token, productId, newStatus);
      setData((prevData) => prevData.map((product) => (product.id === productId ? { ...product, is_valid: newStatus } : product)));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteproductAdmin(token, id);

      if (result && "error" in result) {
        setError(result.error); // Set error message
        console.log(error);
      } else {
        //setSuccess(true);
        console.log("delete product successful", result);
        setData((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const handleView = (id: number) => {
    const selectedProduct = data.find((prod) => prod.id === id);
    if (selectedProduct) {
      navigate(`/product/about/${id}`);
      console.log("befor click: ", selectedProduct);
    }
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
      cell: ({ row }) => {
        const name: string = row.original.name || "";
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
      accessorKey: "prix",
      header: "Price",
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "is_valid",
      header: "Status",
      cell: ({ row }) => {
        const isValid = Boolean(row.original.is_valid);

        return (
          <Select value={isValid ? "valid" : "invalid"} onValueChange={(value) => handleStatusChange(row.original.id, value === "valid")}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="valid">Valide</SelectItem>
              <SelectItem value="invalid">Not valide</SelectItem>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "total_sold",
      header: "Sold",
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
            <DropdownMenuItem onClick={() => handleView(row.original.id!)}>View </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id!)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-end"></div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
