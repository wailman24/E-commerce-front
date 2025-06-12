import { SectionCards } from "../../components/section-cards";
//import { AppSidebar } from "../../components/app-sidebar";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
//import { DataTable } from "../../components/data-table";

import { SiteHeader } from "../../components/site-header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
//import { ChartBars } from "../../components/chart-bars";
import { AppContext } from "../../Context/AppContext";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "../../components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { getsellerproducts, product } from "../../services/home/product";

//import data from "./data.json";

export default function Page() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = useState<product[]>([]);
  //const [error, setError] = React.useState<string | null>(null);
  useEffect(() => {
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
    },
    {
      accessorKey: "total_sold",
      header: "Sold",
    },
  ];
  return (
    <SidebarProvider>
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              {/* <ChartBars /> */}
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
