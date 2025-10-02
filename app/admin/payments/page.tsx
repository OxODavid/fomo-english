"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
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
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  X,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface PaymentRequest {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  full_name: string;
  phone: string;
  item_type: string;
  item_id: string;
  amount: number;
  currency: string;
  payment_status: "pending" | "verified" | "completed" | "failed";
  notes: string;
  created_at: string;
  admin_notes?: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentRequest | null>(
    null,
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState({
    status: "completed" as "completed" | "failed",
    admin_notes: "",
    bank_transfer_content: "",
  });

  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const status = searchParams.get("status");
    if (
      status &&
      ["pending", "verified", "completed", "failed"].includes(status)
    ) {
      setStatusFilter(status);
    }
  }, [searchParams]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const status = statusFilter === "all" ? undefined : (statusFilter as any);
      const data = await apiClient.getAllPaymentRequests(status);
      setPayments(data);
    } catch (error: any) {
      console.error("Failed to fetch payments:", error);
      toast({
        title: "Error",
        description: "Failed to load payment requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleVerifyPayment = async () => {
    if (!selectedPayment) return;

    try {
      setIsVerifying(true);
      await apiClient.verifyPayment({
        payment_request_id: selectedPayment.id,
        ...verificationData,
      });

      toast({
        title: "Success",
        description: `Payment ${
          verificationData.status === "completed" ? "approved" : "rejected"
        } successfully`,
      });

      // Refresh payments list
      await fetchPayments();

      // Close dialog
      setSelectedPayment(null);
      setVerificationData({
        status: "completed",
        admin_notes: "",
        bank_transfer_content: "",
      });
    } catch (error: any) {
      console.error("Failed to verify payment:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to verify payment",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="text-yellow-600 border-yellow-600"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "verified":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <AlertCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.phone.includes(searchQuery);

    return matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment Management</h1>
        <p className="text-muted-foreground">
          Review and approve payment requests
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, email, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={fetchPayments} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Requests ({filteredPayments.length})</CardTitle>
          <CardDescription>
            Manage course purchase payment requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No payment requests found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {payment.phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.item_type}
                        </p>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(payment.payment_status)}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          {formatDate(payment.created_at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPayment(payment)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>
                                  Payment Request Details
                                </DialogTitle>
                                <DialogDescription>
                                  Review and verify this payment request
                                </DialogDescription>
                              </DialogHeader>

                              {selectedPayment && (
                                <div className="space-y-6">
                                  {/* Payment Info */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        User
                                      </Label>
                                      <p>{selectedPayment.user.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPayment.user.email}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Contact Info
                                      </Label>
                                      <p>{selectedPayment.full_name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedPayment.phone}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Amount
                                      </Label>
                                      <p className="text-lg font-bold">
                                        {formatCurrency(
                                          selectedPayment.amount,
                                          selectedPayment.currency,
                                        )}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Status
                                      </Label>
                                      <div className="mt-1">
                                        {getStatusBadge(
                                          selectedPayment.payment_status,
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Date
                                      </Label>
                                      <p>
                                        {formatDate(selectedPayment.created_at)}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Item Type
                                      </Label>
                                      <p className="capitalize">
                                        {selectedPayment.item_type}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Notes */}
                                  {selectedPayment.notes && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Customer Notes
                                      </Label>
                                      <p className="mt-1 p-3 bg-gray-50 rounded-md">
                                        {selectedPayment.notes}
                                      </p>
                                    </div>
                                  )}

                                  {selectedPayment.admin_notes && (
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Admin Notes
                                      </Label>
                                      <p className="mt-1 p-3 bg-blue-50 rounded-md">
                                        {selectedPayment.admin_notes}
                                      </p>
                                    </div>
                                  )}

                                  {/* Verification Form */}
                                  {selectedPayment.payment_status ===
                                    "pending" && (
                                    <div className="border-t pt-6">
                                      <h4 className="font-medium mb-4">
                                        Verify Payment
                                      </h4>
                                      <div className="space-y-4">
                                        <div>
                                          <Label htmlFor="verification-status">
                                            Action
                                          </Label>
                                          <Select
                                            value={verificationData.status}
                                            onValueChange={(
                                              value: "completed" | "failed",
                                            ) =>
                                              setVerificationData((prev) => ({
                                                ...prev,
                                                status: value,
                                              }))
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="completed">
                                                Approve Payment
                                              </SelectItem>
                                              <SelectItem value="failed">
                                                Reject Payment
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div>
                                          <Label htmlFor="bank-transfer">
                                            Bank Transfer Content
                                          </Label>
                                          <Input
                                            id="bank-transfer"
                                            placeholder="e.g., FOMO ENGLISH COURSE PAYMENT"
                                            value={
                                              verificationData.bank_transfer_content
                                            }
                                            onChange={(e) =>
                                              setVerificationData((prev) => ({
                                                ...prev,
                                                bank_transfer_content:
                                                  e.target.value,
                                              }))
                                            }
                                          />
                                        </div>

                                        <div>
                                          <Label htmlFor="admin-notes">
                                            Admin Notes
                                          </Label>
                                          <Textarea
                                            id="admin-notes"
                                            placeholder="Add verification notes..."
                                            value={verificationData.admin_notes}
                                            onChange={(e) =>
                                              setVerificationData((prev) => ({
                                                ...prev,
                                                admin_notes: e.target.value,
                                              }))
                                            }
                                          />
                                        </div>

                                        <div className="flex space-x-2">
                                          <Button
                                            onClick={handleVerifyPayment}
                                            disabled={isVerifying}
                                            className={
                                              verificationData.status ===
                                              "completed"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-red-600 hover:bg-red-700"
                                            }
                                          >
                                            {isVerifying ? (
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            ) : verificationData.status ===
                                              "completed" ? (
                                              <Check className="w-4 h-4 mr-2" />
                                            ) : (
                                              <X className="w-4 h-4 mr-2" />
                                            )}
                                            {verificationData.status ===
                                            "completed"
                                              ? "Approve"
                                              : "Reject"}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
