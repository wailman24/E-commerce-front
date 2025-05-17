import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

//import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../components/ui/select";

import { AppContext } from "../../../Context/AppContext";
import { addcategory, category, getcategories } from "../../../services/home/category";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required").max(255),
  category_id: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CategoryAddForm() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("AppContext is required");
  const { token } = appContext;

  const [categories, setCategories] = useState<category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getcategories(token);
        if ("error" in response) {
          setError(response.error);
          setCategories([]);
        } else {
          setCategories(response);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      }
    };

    fetchCategories();
  }, [token]);

  const onSubmit = async (data: FormData) => {
    const cat: category = {
      id: 0,
      name: data.name,
      ...(data.category_id ? { category_id: parseInt(data.category_id) } : {}),
    };
    try {
      const result = await addcategory(token, cat);

      if (result && "error" in result) {
        setError(result.error);
      } else {
        setSuccess(true);
        reset();
        setError(null);
        setCategories((prev) => [...prev, result]);
        console.log("Category created:", result);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold">Add New Category</h2>

        <div>
          <Label className="mb-1 block">Category Name</Label>
          <Input className="mt-1" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label className="mb-1 block">Parent Category (optional)</Label>
          <Select onValueChange={(val) => setValue("category_id", val)} defaultValue="">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a parent category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((cat) => cat.category_id === null)
                .map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Category added successfully ✅</p>}

        <Button type="submit" className="w-full">
          Create Category
        </Button>
      </form>
    </div>
  );
}
