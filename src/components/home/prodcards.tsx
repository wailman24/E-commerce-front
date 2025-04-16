import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "../../components/ui/button";
import { product } from "../../services/home/product";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";

export default function Prodcards({ id, name, images, prix, total_sold }: product) {
  return (
    <>
      <div key={id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden text-left">
        {/* Product Image with Actions */}
        <div className="relative w-full h-40">
          {images?.[0]?.image_url && (
            <img src={`http://127.0.0.1:8000/storage/${images[0].image_url}`} alt={name} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
              <Heart className="w-4 h-4 text-gray-700" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white rounded-full shadow w-8 h-8">
              <Eye className="w-4 h-4 text-gray-700" />
            </Button>
          </div>
        </div>

        {/* Product Details */}
        <div className="p-3 space-y-1">
          <p className="font-medium text-sm truncate">{name}</p>

          {/* Rating */}
          <div className="flex text-yellow-500 text-sm">{"★".repeat(0).padEnd(5, "☆")}</div>

          {/* Pricing */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{prix} DZD</span>
          </div>

          {/* Sold Count */}
          <p className="text-green-600 text-xs">{total_sold || 0} sold</p>

          {/* Add to Cart Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full mt-2 text-sm flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add to Cart</SheetTitle>
                <SheetDescription>Select quantity and confirm.</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Product
                  </Label>
                  <Input id="name" value={name} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="qty" className="text-right">
                    Quantity
                  </Label>
                  <Input id="qty" type="number" min={1} defaultValue={1} className="col-span-3" />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Confirm</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
