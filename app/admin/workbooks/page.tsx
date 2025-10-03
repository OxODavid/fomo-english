"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WorkbookForm } from "@/components/admin/workbook-form";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  FileText,
  DollarSign,
  Download,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Workbook {
  id: string;
  title_en: string;
  title_vi: string;
  description_en: string;
  description_vi?: string;
  price_usd?: number;
  price_vnd?: number;
  original_price_usd?: number;
  original_price_vnd?: number;
  level: string;
  category: string;
  pages: number;
  pdf_url?: string;
  cover_image_url?: string;
  is_free: boolean;
  is_active: boolean;
  created_at: string;
}

export default function AdminWorkbooksPage() {
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingWorkbook, setEditingWorkbook] = useState<Workbook | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkbooks();
  }, []);

  const fetchWorkbooks = async () => {
    try {
      console.log("🔍 Fetching admin workbooks...");
      const response = await apiClient.getAdminWorkbooks();
      console.log("✅ Workbooks received:", response);
      setWorkbooks(response.data || []);
    } catch (error: any) {
      console.error("❌ Failed to fetch workbooks:", error);
      toast({
        title: "Error",
        description: "Failed to load workbooks. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWorkbook = async (workbookId: string) => {
    if (!confirm("Are you sure you want to delete this workbook?")) return;

    try {
      await apiClient.deleteWorkbook(workbookId);
      setWorkbooks(workbooks.filter((workbook) => workbook.id !== workbookId));
      toast({
        title: "Success",
        description: "Workbook deleted successfully",
      });
    } catch (error: any) {
      console.error("Failed to delete workbook:", error);
      toast({
        title: "Error",
        description: "Failed to delete workbook",
        variant: "destructive",
      });
    }
  };

  const handleSaveWorkbook = async (workbookData: any) => {
    setIsSubmitting(true);
    try {
      if (editingWorkbook) {
        // Update existing workbook
        const updatedWorkbook = await apiClient.updateWorkbook(
          editingWorkbook.id,
          workbookData,
        );
        setWorkbooks(
          workbooks.map((workbook) =>
            workbook.id === editingWorkbook.id
              ? { ...workbook, ...updatedWorkbook }
              : workbook,
          ),
        );
        setEditingWorkbook(null);
        toast({
          title: "Success",
          description: "Workbook updated successfully",
        });
      } else {
        // Create new workbook
        const newWorkbook = await apiClient.createWorkbook(workbookData);
        setWorkbooks([newWorkbook, ...workbooks]);
        setIsCreateDialogOpen(false);
        toast({
          title: "Success",
          description: "Workbook created successfully",
        });
      }
    } catch (error: any) {
      console.error("Failed to save workbook:", error);
      toast({
        title: "Error",
        description: "Failed to save workbook",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredWorkbooks = workbooks.filter(
    (workbook) =>
      workbook.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workbook.title_vi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workbook.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatCurrency = (amount: number, currency: "USD" | "VND") => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    } else {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      case "all_levels":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "business":
        return "bg-blue-100 text-blue-800";
      case "technology":
        return "bg-purple-100 text-purple-800";
      case "healthcare":
        return "bg-green-100 text-green-800";
      case "ielts":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Workbook Management</h1>
          <p className="text-muted-foreground">
            Manage all workbooks in the platform
          </p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Workbook Management</h1>
            <p className="text-muted-foreground">
              Manage all workbooks in the platform
            </p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Workbook
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Workbook</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new workbook
                </DialogDescription>
              </DialogHeader>
              <WorkbookForm
                onSave={handleSaveWorkbook}
                onCancel={() => setIsCreateDialogOpen(false)}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Workbooks Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Workbooks ({filteredWorkbooks.length})</CardTitle>
          <CardDescription>
            Manage and monitor all workbooks in your platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workbook</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkbooks.map((workbook) => (
                  <TableRow key={workbook.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{workbook.title_en}</div>
                        <div className="text-sm text-muted-foreground">
                          {workbook.title_vi}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2">
                          {workbook.description_en}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getCategoryBadgeColor(workbook.category)}
                      >
                        {workbook.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getLevelBadgeColor(workbook.level)}>
                        {workbook.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {workbook.is_free ? (
                        <Badge variant="secondary">Free</Badge>
                      ) : (
                        <div className="space-y-1">
                          <div className="font-medium">
                            {formatCurrency(workbook.price_usd || 0, "USD")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(workbook.price_vnd || 0, "VND")}
                          </div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{workbook.pages}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={workbook.is_free ? "outline" : "default"}>
                        {workbook.is_free ? "Free" : "Premium"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={workbook.is_active ? "default" : "secondary"}
                      >
                        {workbook.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingWorkbook(workbook)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteWorkbook(workbook.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/workbook/${workbook.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {!workbook.is_free && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredWorkbooks.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No workbooks found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Get started by creating your first workbook"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Workbook
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Workbook Dialog */}
      {editingWorkbook && (
        <Dialog
          open={!!editingWorkbook}
          onOpenChange={() => setEditingWorkbook(null)}
        >
          <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Workbook</DialogTitle>
              <DialogDescription>Update workbook details</DialogDescription>
            </DialogHeader>
            <WorkbookForm
              workbook={editingWorkbook}
              onSave={handleSaveWorkbook}
              onCancel={() => setEditingWorkbook(null)}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
