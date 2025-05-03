//import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../components/ui/select";
//import { toast } from "../../../components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  category_id: z.string().min(1, "Category is required"),
  about: z.string().min(20, "Description must be at least 20 characters").max(2000),
  prix: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().min(0, "Stock must be a positive number"),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm() {
  const {
    register,
    //handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Static category list (replace with your real categories)
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Clothing" },
    { id: 3, name: "Home" },
  ];

  /*  const onSubmit = async (data: FormData) => {
    try {
      await axios.post("/api/products", data);
      toast({ title: "Success", description: "Product created successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
 */
  return (
    <form /* onSubmit={handleSubmit(onSubmit)} */ className="space-y-4 p-4">
      <div>
        <Label>Product Name</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label>Category</Label>
        <Select onValueChange={(val) => setValue("category_id", val)} defaultValue="">
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
      </div>

      <div>
        <Label>About</Label>
        <Textarea {...register("about")} />
        {errors.about && <p className="text-sm text-red-500">{errors.about.message}</p>}
      </div>

      <div>
        <Label>Price</Label>
        <Input type="number" step="0.01" {...register("prix")} />
        {errors.prix && <p className="text-sm text-red-500">{errors.prix.message}</p>}
      </div>

      <div>
        <Label>Stock</Label>
        <Input type="number" {...register("stock")} />
        {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
      </div>

      <Button type="submit">Create Product</Button>
    </form>
  );
}
