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
import { deleteproduct, product, updateproduct, getnotvalidproductforseller } from "../../../services/home/product";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
//import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../../../components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../components/ui/dialog"; // adjust the import path based on your setup

import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { category, getcategories } from "../../../services/home/category";
import { Label } from "../../../components/ui/label";
import { addimage, deleteimage } from "../../../services/home/image";
import { useNavigate } from "react-router-dom";

export default function NotvalidProductseller() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<product[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<product | null>(null);
  const [categories, setCategories] = React.useState<category[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [showImages, setShowImages] = React.useState(false);
  const [singleImage, setSingleImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [askNextImage, setAskNextImage] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProds = async () => {
      try {
        setLoading(true);
        const response = await getnotvalidproductforseller(token);
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

    fetchProds();
  }, [token]);

  React.useEffect(() => {
    const fetchcatg = async () => {
      try {
        const response = await getcategories(token);
        if ("error" in response) {
          setError(response.error);
          console.log(response.error);
          setCategories([]);
        } else {
          setCategories(response);
          console.log(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchcatg();
  }, [token]);

  const navigate = useNavigate();
  const handleAdd = () => {
    navigate(`/product/add`);
  };

  const handleEdit = (id: number) => {
    const selectedProduct = data.find((prod) => prod.id === id);
    if (selectedProduct) {
      setEditProduct(selectedProduct);
      setShowForm(true);
      console.log("befor click: ", selectedProduct);
    }
  };

  const handleupdate = async () => {
    try {
      if (!editProduct) return;

      const result = await updateproduct(token, editProduct);

      if ("error" in result) {
        setError(result.error);
      } else {
        // update local data state
        setData((prev) => prev.map((item) => (item.id === editProduct.id ? result : item)));
        console.log("editProduct:", editProduct);

        // close the form
        //setEditProduct(null);
        setShowForm(false);
        setShowImages(true);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteproduct(token, id);

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

  const handleSingleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSingleImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    setAskNextImage(true);

    try {
      console.log(singleImage);
      const result = await addimage(token, editProduct!.id, singleImage!);

      if ("error" in result) {
        setError(result.error); // Set error message
        console.log(error);
      } else {
        //setSuccess(true);
        console.log("Register image successful", result);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const resetImageUpload = () => {
    setSingleImage(null);
    setPreview(null);
    setAskNextImage(false);
  };

  const handleDeleteImage = async (imageId: number) => {
    console.log(imageId);
    try {
      console.log(singleImage);
      const result = await deleteimage(token, imageId);

      if (result && "error" in result) {
        setError(result.error); // Set error message
        console.log(error);
      } else {
        //setSuccess(true);
        console.log("deleted image successful", result);
        setEditProduct((prev) =>
          prev
            ? {
                ...prev,
                images: prev.images?.filter((img) => img.id !== imageId) || [],
              }
            : null
        );
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
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
      <DataTable columns={columns} data={data} loading={loading} />
      {showForm && (
        <Dialog open={showForm} onOpenChange={(open) => setShowForm(open)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={editProduct?.name || ""}
                  onChange={(e) => setEditProduct((prev) => prev && { ...prev, name: e.target.value })}
                />
              </div>

              {/* About */}
              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  value={editProduct?.about || ""}
                  onChange={(e) => setEditProduct((prev) => prev && { ...prev, about: e.target.value })}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={editProduct?.prix || ""}
                  onChange={(e) => setEditProduct((prev) => prev && { ...prev, prix: parseFloat(e.target.value) })}
                />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
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
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={handleupdate}>Save</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {showImages && (
        <Dialog open={showImages} onOpenChange={(open) => setShowImages(open)}>
          <DialogContent className="space-y-4 p-6 max-w-sm">
            <h2 className="text-lg font-semibold">Upload Product Image</h2>

            {/* Show Existing Images with Delete */}
            {editProduct ? (
              <div className="flex flex-wrap gap-2">
                {editProduct.images?.length ? (
                  editProduct.images.map((img) => (
                    <div key={img.id} className="relative w-24 h-24 border rounded overflow-hidden">
                      <img src={`http://127.0.0.1:8000/storage/${img.image_url}`} alt="Product" className="w-full h-full object-cover" />
                      <Button
                        size="icon"
                        variant="destructive"
                        className="absolute top-1 right-1 size-5"
                        onClick={() => handleDeleteImage(img.id!)}
                      >
                        ×
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>No images available.</p>
                )}
              </div>
            ) : (
              <p>Loading...</p>
            )}

            {/* Add New Image */}
            {!askNextImage ? (
              <>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleSingleImageChange}
                  disabled={askNextImage} // Prevent file selection after upload
                />
                {preview && <img src={preview} alt="preview" className="h-24 w-24 object-cover rounded border mt-2" />}
                <Button disabled={!singleImage} className="w-full" onClick={handleUploadImage}>
                  Upload Image
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                <p>✅ Image uploaded. Do you want to add another?</p>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setShowImages(false)}>
                    No
                  </Button>
                  <Button onClick={resetImageUpload}>Yes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
