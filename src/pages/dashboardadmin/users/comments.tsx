import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVerticalIcon, ChevronsLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronsRightIcon } from "lucide-react";

import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

import { AppContext } from "../../../Context/AppContext";
import { deletereview, getallreviews, review } from "../../../services/home/reviews";

export default function Comments() {
  const appContext = React.useContext(AppContext);
  if (!appContext) throw new Error("Comments must be used within an AppProvider");

  const { token } = appContext;
  const [data, setData] = React.useState<review[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [editFb, setEditFb] = React.useState<review | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    const fetchFbks = async () => {
      try {
        setLoading(true);
        const response = await getallreviews(token, page);
        if ("error" in response) {
          setData([]);
        } else {
          setData(response.data);
          setTotalPages((response.meta as { last_page: number }).last_page);
        }
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFbks();
  }, [token, page]);

  const handleAbout = (fb: review) => {
    setEditFb(fb);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deletereview(token, id);
      if (result && "error" in result) {
        console.log(result.error);
      } else {
        console.log("Delete successful", result);
        setData((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: ColumnDef<review>[] = [
    {
      accessorKey: "user.name",
      header: "User Name",
    },
    {
      accessorKey: "comment",
      header: "Comment",
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id!)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <DataTable columns={columns} data={data} loading={loading} disablePagination />

      {/* Styled pagination controls matching DataTable */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          Showing page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden h-8 w-8 p-0 lg:flex" onClick={() => setPage(1)} disabled={page === 1}>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="size-8" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="px-2 text-sm">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            className="size-8"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="hidden size-8 lg:flex" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View dialog */}
      {showForm && editFb && (
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Feedback Details</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="email">User</Label>
                <Input id="email" value={editFb.user?.name ?? ""} readOnly className="bg-muted cursor-not-allowed" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Comment</Label>
                <Input id="message" value={editFb.comment ?? ""} readOnly className="bg-muted cursor-not-allowed" />
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
