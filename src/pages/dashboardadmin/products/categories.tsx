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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";

import { AppContext } from "../../../Context/AppContext";
import { category, getcategories, deletecategory, updatecategory } from "../../../services/home/category";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Categories must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<category[]>([]);
  const [categories, setCategories] = React.useState<category[]>([]);
  const [editCategory, setEditCategory] = React.useState<category | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  const [errors, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const response = await getcategories(token);
        if ("error" in response) {
          setError(response.error);
          // console.log(errors);
          setData([]);
          setCategories([]);
        } else {
          setData(response);
          setCategories(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to fetch categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token]);
  const navigate = useNavigate();
  const handleAdd = () => {
    navigate(`/Admin/dashboard/addcategories`);
  };
  const handleEdit = (id: number) => {
    const selected = data.find((cat) => cat.id === id);
    if (selected) {
      setEditCategory(selected);
      setShowForm(true);
    }
  };

  const handleUpdate = async () => {
    if (!editCategory) return;

    try {
      const result = await updatecategory(token, editCategory);

      if ("error" in result) {
        setError(result.error);
      } else {
        setData((prev) => prev.map((item) => (item.id === editCategory.id ? result : item)));
        setShowForm(false);
        setEditCategory(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deletecategory(token, id);
      if (result && "error" in result) {
        setError(result.error);
        console.log(errors);
      } else {
        setData((prev) => prev.filter((cat) => cat.id !== id));
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Category Name",
    },
    {
      id: "parent_category",
      header: "Parent Category",
      cell: ({ row }: { row: { original: category } }) => {
        const parent = categories.find((cat) => cat.id === row.original.category_id);
        return <span>{parent ? parent.name : "—"}</span>;
      },
    },
    {
      accessorKey: "product_count",
      header: "Products",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: { original: category } }) => (
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
          Add Category
        </Button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} />

      {showForm && editCategory && (
        <Dialog open={showForm} onOpenChange={(open) => setShowForm(open)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editCategory.name}
                  onChange={(e) => setEditCategory((prev) => prev && { ...prev, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parent">Parent Category</Label>
                <Select
                  value={editCategory?.category_id ? String(editCategory.category_id) : "none"}
                  onValueChange={(value) =>
                    setEditCategory(
                      (prev) =>
                        prev && {
                          ...prev,
                          category_id: value === "none" ? undefined : parseInt(value),
                        }
                    )
                  }
                >
                  <SelectTrigger id="parent">
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {categories
                      .filter((cat) => cat.id !== editCategory?.id)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button onClick={handleUpdate}>Save</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
