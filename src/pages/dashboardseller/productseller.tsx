import { useContext /* useEffect, useState */ } from "react";
import { DataTable } from "../../components/data-table";
import { AppContext } from "../../Context/AppContext";
import data from "./data.json";
//import { getsellerproducts, product } from "../../services/home/product";

export default function Productseller() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  //const { token } = appContext;

  /*   const [products, setProducts] = useState<product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVP = async () => {
      try {
        setLoading(true);
        const response = await getsellerproducts(token);
        if ("error" in response) {
          setError(response.error);
          setVProducts([]);
        } else {
          setVProducts(response);
          console.log(response);
          setError(null);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVP();
  }, [token]); */
  return (
    <div className="flex flex-col gap-4 p-4">
      <DataTable data={data} />
    </div>
  );
}
