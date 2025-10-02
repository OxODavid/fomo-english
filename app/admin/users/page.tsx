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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Search,
  RefreshCw,
  Users,
  BookOpen,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  points: number;
  preferred_language: string;
  created_at: string;
  course_purchases: any[];
  workbook_purchases: any[];
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<UsersResponse["meta"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const { toast } = useToast();

  const fetchUsers = async (page = 1, search = "") => {
    try {
      setIsLoading(true);
      const params = {
        page,
        limit: 20,
        ...(search && { search }),
      };
      const data: UsersResponse = await apiClient.getAllUsers(params);
      setUsers(data.data);
      setMeta(data.meta);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserCourses = async (userId: string) => {
    try {
      setIsLoadingCourses(true);
      const courses = await apiClient.getUserCourseAccess(userId);
      setUserCourses(courses);
    } catch (error: any) {
      console.error("Failed to fetch user courses:", error);
      toast({
        title: "Error",
        description: "Failed to load user courses",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchQuery);
  }, [currentPage]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    await fetchUserCourses(user.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    }
    return `$${amount.toLocaleString()}`;
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">Admin</Badge>;
      case "user":
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getLanguageBadge = (lang: string) => {
    switch (lang) {
      case "en":
        return <Badge variant="outline">🇺🇸 English</Badge>;
      case "vi":
        return <Badge variant="outline">🇻🇳 Vietnamese</Badge>;
      default:
        return <Badge variant="outline">{lang}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage platform users and their access
        </p>
      </div>

      {/* Search and Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                onClick={() => fetchUsers(currentPage, searchQuery)}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{meta?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({meta?.total || 0})</CardTitle>
          <CardDescription>
            All registered users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.name?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{user.phone || "N/A"}</p>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{user.points}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 text-blue-500 mr-1" />
                            <span>{user.course_purchases?.length || 0}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getLanguageBadge(user.preferred_language)}
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {formatDate(user.created_at)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUserClick(user)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogDescription>
                                  View user information and course access
                                </DialogDescription>
                              </DialogHeader>

                              {selectedUser && (
                                <div className="space-y-6">
                                  {/* User Info */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Name
                                      </Label>
                                      <p className="text-lg">
                                        {selectedUser.name}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Email
                                      </Label>
                                      <p>{selectedUser.email}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Phone
                                      </Label>
                                      <p>{selectedUser.phone || "N/A"}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Role
                                      </Label>
                                      <div className="mt-1">
                                        {getRoleBadge(selectedUser.role)}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Points
                                      </Label>
                                      <div className="flex items-center mt-1">
                                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                        <span className="font-medium text-lg">
                                          {selectedUser.points}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Language
                                      </Label>
                                      <div className="mt-1">
                                        {getLanguageBadge(
                                          selectedUser.preferred_language,
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Joined
                                      </Label>
                                      <p>
                                        {formatDate(selectedUser.created_at)}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Course Purchases
                                      </Label>
                                      <p className="text-lg font-medium">
                                        {selectedUser.course_purchases
                                          ?.length || 0}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Course Access */}
                                  <div className="border-t pt-6">
                                    <h4 className="font-medium mb-4 flex items-center">
                                      <BookOpen className="w-5 h-5 mr-2" />
                                      Course Access
                                    </h4>

                                    {isLoadingCourses ? (
                                      <div className="flex items-center justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                      </div>
                                    ) : userCourses.length === 0 ? (
                                      <p className="text-muted-foreground py-4">
                                        No courses purchased
                                      </p>
                                    ) : (
                                      <div className="space-y-3">
                                        {userCourses.map((purchase) => (
                                          <div
                                            key={purchase.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                          >
                                            <div className="flex-1">
                                              <p className="font-medium">
                                                {purchase.course?.title_en}
                                              </p>
                                              <p className="text-sm text-muted-foreground">
                                                Purchased:{" "}
                                                {formatDate(
                                                  purchase.purchase_date,
                                                )}
                                              </p>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-medium">
                                                {formatCurrency(
                                                  purchase.payment_amount,
                                                  purchase.payment_currency,
                                                )}
                                              </p>
                                              <Badge
                                                variant={
                                                  purchase.payment_status ===
                                                  "completed"
                                                    ? "default"
                                                    : "secondary"
                                                }
                                                className="text-xs"
                                              >
                                                {purchase.payment_status}
                                              </Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total} users
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={meta.page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(meta.totalPages, prev + 1),
                        )
                      }
                      disabled={meta.page >= meta.totalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
