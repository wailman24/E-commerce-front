import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import { getsellerproducts, product } from "../../../services/home/product";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../../../components/ui/drawer";
import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { category, getcategories } from "../../../services/home/category";
import { Label } from "../../../components/ui/label";

export default function SimpleTableWithAddButton() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<product[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<product | null>(null);
  const [categories, setCategories] = React.useState<category[]>([]);
  const [error, setError] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    const fetchcatg = async () => {
      try {
        // setLoading(true);
        const response = await getcategories(token);
        if ("error" in response) {
          setError(response.error);
          console.log(error);
          setCategories([]);
        } else {
          setCategories(response);
          console.log(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        //setLoading(false);
      }
    };

    fetchcatg();
  }, [error, token]);

  const handleAdd = () => {
    /*  const newId = Math.max(...data.map((item) => item.id), 0) + 1;
    setData((prev) => [...prev, { id: newId, name: `New Product ${newId}`, price: 0, stock: 0, status: "Active", isvalide: "Yes" }]);
  */
  };

  const handleEdit = (id: number) => {
    const selectedProduct = data.find((prod) => prod.id === id);
    if (selectedProduct) {
      setEditProduct(selectedProduct);
      setShowForm(true);
    }
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
            <DropdownMenuItem onClick={() => handleEdit(row.original.id!)}>Edit </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id!)}>Delete</DropdownMenuItem>
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
      {showForm && (
        <Drawer open={editProduct !== null} onOpenChange={() => setEditProduct(null)}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit Product</DrawerTitle>
            </DrawerHeader>

            <div className="grid gap-4 p-4">
              {/* Product Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name
                </label>
                <Input
                  id="name"
                  value={editProduct?.name || ""}
                  onChange={(e) => setEditProduct((prev) => prev && { ...prev, name: e.target.value })}
                />
              </div>

              {/* About */}
              <div className="space-y-2">
                <label htmlFor="about" className="text-sm font-medium">
                  About
                </label>
                <Textarea
                  id="about"
                  value={editProduct?.about || ""}
                  onChange={(e) => setEditProduct((prev) => prev && { ...prev, about: e.target.value })}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  value={editProduct?.prix || ""}
                  onChange={(e) => setEditProduct((prev) => prev && { ...prev, prix: parseFloat(e.target.value) })}
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock
                </label>
                <Input
                  id="stock"
                  type="number"
                  value={editProduct?.stock || ""}
                  onChange={(e) => setEditProduct((prev) => prev && { ...prev, stock: parseInt(e.target.value) })}
                />
              </div>

              {/* Category */}
              <Label htmlFor="category" className="mb-1 block">
                Category
              </Label>
              <Select
                value={String(editProduct?.category_id ?? "")}
                onValueChange={(value) => setEditProduct((prev) => prev && { ...prev, category_id: Number(value) })}
              >
                <SelectTrigger id="category" className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((cat) => cat.category_id === null)
                    .map((parent) => {
                      const children = categories.filter((child) => child.category_id === parent.id);
                      return (
                        <div key={parent.id} className="px-2 py-1">
                          <div className="text-sm font-semibold text-muted-foreground mb-1">{parent.name}</div>
                          {children.map((child) => (
                            <SelectItem key={child.id} value={String(child.id)}>
                              {child.name}
                            </SelectItem>
                          ))}
                        </div>
                      );
                    })}
                </SelectContent>
              </Select>

              {/* Image (optional, if needed) */}
              {/* <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">Image</label>
              {editProduct?.images && <img src={editProduct.images!} className="h-20 w-20 object-cover mb-2" />}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setEditProduct((prev) => prev ? { ...prev, image: url, newImageFile: file } : null);
                  }
                }}
              />
            </div> */}
            </div>

            <DrawerFooter>
              <Button onClick={handleEdit}>Save</Button>
              <DrawerClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
