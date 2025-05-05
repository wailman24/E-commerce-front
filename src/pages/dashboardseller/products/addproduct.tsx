//import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../../../components/ui/select";
import React,{ useContext, useEffect, useState } from "react";
import { addproduct, product } from "../../../services/home/product";
import { AppContext } from "../../../Context/AppContext";
import { category, getcategories } from "../../../services/home/category";
import { addimage } from "../../../services/home/image";
//import { toast } from "../../../components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required").max(255),
  category_id: z.string().min(1, "Category is required"),
  about: z.string().min(20, "Description must be at least 20 characters").max(2000),
  prix: z.coerce.number().min(0, "Price must be a positive number"),
  stock: z.coerce.number().min(0, "Stock must be a positive number"),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductAddForm() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const [showImages, setShowImages] = useState(false);
  const [singleImage, setSingleImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [askNextImage, setAskNextImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<category[]>([]);
  const [product, setProduct] = useState<product>();
  useEffect(() => {
    const fetchcatg = async () => {
      try {
        // setLoading(true);
        const response = await getcategories(token);
        if ("error" in response) {
          setError(response.error);
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
  }, [token]);

  const handleFormSubmit = async (data: FormData) => {
    //e.preventDefault();
    setShowImages(true);

    const prod: product = {
      name: data.name,
      category_id: parseInt(data.category_id),
      about: data.about,
      prix: data.prix,
      stock: data.stock,
      id: 0,
    };
    try {
      console.log(prod);
      const result = await addproduct(token, prod);

      if ("error" in result) {
        setError(result.error); // Set error message
        console.log(error);
      } else {
        //setSuccess(true);
        console.log("Register product successful", result);
        setProduct(result);
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
      const result = await addimage(token, product!.id, singleImage!);

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full max-w-lg space-y-6 rounded-lg bg-white p-6 shadow-md">
        <div>
          <Label className="mb-1 block">Product Name</Label>
          <Input className="mt-1" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label className="mb-1 block">Category</Label>
          <Select onValueChange={(val) => setValue("category_id", val)} defaultValue="">
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter((cat) => cat.category_id === null) // parent categories
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

          {errors.category_id && <p className="text-sm text-red-500">{errors.category_id.message}</p>}
        </div>

        <div>
          <Label className="mb-1 block">About</Label>
          <Textarea className="mt-1" {...register("about")} />
          {errors.about && <p className="text-sm text-red-500">{errors.about.message}</p>}
        </div>

        <div>
          <Label className="mb-1 block">Price</Label>
          <Input type="number" step="0.01" className="mt-1" {...register("prix")} />
          {errors.prix && <p className="text-sm text-red-500">{errors.prix.message}</p>}
        </div>

        <div>
          <Label className="mb-1 block">Stock</Label>
          <Input type="number" className="mt-1" {...register("stock")} />
          {errors.stock && <p className="text-sm text-red-500">{errors.stock.message}</p>}
        </div>

        <Button type="submit" className="w-full">
          Create Product
        </Button>

        {showImages && (
          <Dialog open={showImages} onOpenChange={setShowImages}>
            <DialogContent className="space-y-4 p-6 max-w-sm">
              <h2 className="text-lg font-semibold">Upload Product Image</h2>

              {!askNextImage ? (
                <>
                  <Input type="file" accept="image/*" onChange={handleSingleImageChange} />
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
      </form>
    </div>
  );
}
