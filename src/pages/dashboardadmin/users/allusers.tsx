import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
//import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useNavigate } from "react-router-dom";

import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
import { user } from "../../../pages/auth/signup";
import { deleteuser, getallusers } from "../../../services/Auth/auth";

export default function AllUsers() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<user[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProds = async () => {
      try {
        setLoading(true);
        const response = await getallusers(token);
        if ("error" in response) {
          setError(response.error);
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        setError("Failed to fetch users." + error);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, [token]);

  const handleAbout = (id: number) => {
    console.log("Navigating to user with ID:", id);
    navigate(`/user/about/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteuser(token, id);

      if (result && "error" in result) {
        setError(result.error); // Set error message
        console.log(error);
      } else {
        //setSuccess(true);
        console.log("delete user successful", result);
        setData((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

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
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAbout(row.original.id!)}>About</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id!)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  );
}
