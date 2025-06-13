import * as React from "react";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

//import { useNavigate } from "react-router-dom";
import { MoreVerticalIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { AppContext } from "../../../Context/AppContext";
import { feedback } from "../../../services/Auth/auth";
import { getallfbks } from "../../../services/Auth/auth";

export default function AllFbks() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Products must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<feedback[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editFb, setEditFb] = React.useState<feedback | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFbks = async () => {
      try {
        setLoading(true);

        const response = await getallfbks(token);
        if ("error" in response) {
          setData([]);
        } else {
          setData(response);
        }
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFbks();
  }, [token]);

  const handleAbout = (fb: feedback) => {
    setEditFb(fb);
    setShowForm(true);
  };

  const columns: ColumnDef<feedback>[] = [
    {
      accessorKey: "email",
      header: "E-mail",
    },
    {
      accessorKey: "message",
      header: "Message",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 text-muted-foreground cursor-pointer">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAbout(row.original)}>View</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <DataTable columns={columns} data={data} loading={loading} />

      {showForm && editFb && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={editFb.email ?? ""} readOnly className="bg-muted cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Input id="message" value={editFb.message ?? ""} readOnly className="bg-muted cursor-not-allowed" />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="ghost">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
