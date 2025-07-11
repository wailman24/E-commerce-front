import { SectionCards } from "../../components/section-cards";
//import { AppSidebar } from "../../components/app-sidebar";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
//import { DataTable } from "../../components/data-table";

import { SiteHeader } from "../../components/site-header";
import { SidebarInset, SidebarProvider } from "../../components/ui/sidebar";
//import { ChartBars } from "../../components/chart-bars";
import { AppContext } from "../../Context/AppContext";
import { useContext, useEffect, useState } from "react";
import { user } from "../auth/signup";
import { getallusers } from "../../services/Auth/auth";
import { DataTable } from "../../components/data-table";
import { ColumnDef } from "@tanstack/react-table";

//import data from "./data.json";

export default function AdminPage() {
  const appContext = useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = useState<user[]>([]);
  const [loading, setLoading] = useState(true);

  //const [error, setError] = React.useState<string | null>(null);
  useEffect(() => {
    const fetchProds = async () => {
      try {
        setLoading(true);

        const response = await getallusers(token);
        if ("error" in response) {
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, [token]);

  const columns: ColumnDef<user>[] = [
    {
      accessorKey: "name",
      header: "User Name",
      //cell: ({ row }) => row.original.product.name,
    },
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      accessorKey: "role",
      header: "Role",
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
              <DataTable columns={columns} data={data} loading={loading} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
