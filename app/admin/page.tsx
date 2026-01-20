"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  FiLock,
  FiLogOut,
  FiImage,
  FiArrowLeft,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiSearch,
  FiEye,
  FiTrendingUp,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  getPayments,
  updatePayment,
  deletePayment,
  type PaymentRecord,
} from "@/lib/payment-store"

const ADMIN_CREDENTIALS = {
  userId: "admin",
  password: "saraswati2026",
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)

  const [editingPayment, setEditingPayment] = useState<PaymentRecord | null>(null)
  const [editForm, setEditForm] = useState({ name: "", amount: "", branch: "", screenshot: "" })
  const [deletePaymentRecord, setDeletePaymentRecord] = useState<PaymentRecord | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionMessage, setActionMessage] = useState("")

  // New states
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBranch, setFilterBranch] = useState("all")
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalContributors: 0,
    todayContributions: 0,
    averageAmount: 0,
  })
  const [screenshotView, setScreenshotView] = useState<PaymentRecord | null>(null)

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const data = await getPayments()
      setPayments(data)
      setFilteredPayments(data)
      calculateStats(data)
    } catch (error) {
      setActionMessage("Failed to load data")
    }
    setLoading(false)
  }

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("admin_logged_in") === "true"
    setIsLoggedIn(loggedIn)
    if (loggedIn) {
      fetchPayments()
    }
  }, [])

  const calculateStats = (data: PaymentRecord[]) => {
    const totalAmount = data.reduce((sum, p) => sum + Number(p.amount), 0)
    const totalContributors = data.length
    const today = new Date().toDateString()
    const todayContributions = data.filter(
      (p) => new Date(p.timestamp).toDateString() === today
    ).length
    const averageAmount = totalContributors > 0 ? totalAmount / totalContributors : 0

    setStats({
      totalAmount,
      totalContributors,
      todayContributions,
      averageAmount: Math.round(averageAmount),
    })
  }

  useEffect(() => {
    if (!searchQuery.trim() && filterBranch === "all") {
      setFilteredPayments(payments)
    } else {
      const q = searchQuery.toLowerCase()
      setFilteredPayments(
        payments.filter((p) => {
          const matchesSearch =
            p.name.toLowerCase().includes(q) ||
            p.branch.toLowerCase().includes(q) ||
            String(p.amount).includes(q)

          const matchesBranch = filterBranch === "all" || p.branch === filterBranch

          return matchesSearch && matchesBranch
        })
      )
    }
  }, [searchQuery, filterBranch, payments])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (userId === ADMIN_CREDENTIALS.userId && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem("admin_logged_in", "true")
      setIsLoggedIn(true)
      await fetchPayments()
      setError("")
    } else {
      setError("गलत User ID या Password / Invalid User ID or Password")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("admin_logged_in")
    setIsLoggedIn(false)
    setUserId("")
    setPassword("")
  }

  const handleEditClick = (payment: PaymentRecord) => {
    setEditingPayment(payment)
    setEditForm({
      name: payment.name,
      amount: payment.amount,
      branch: payment.branch,
      screenshot: payment.screenshot || ""
    })
    setActionMessage("")
  }

  const handleSaveEdit = async () => {
    if (!editingPayment) return

    setActionLoading(true)
    try {
      await updatePayment(editingPayment.id, {
        name: editForm.name,
        amount: editForm.amount,
        branch: editForm.branch,
        screenshot: editForm.screenshot
      })
      setActionMessage("Record updated successfully! / रिकॉर्ड अपडेट हो गया!")
      await fetchPayments()
      setTimeout(() => {
        setEditingPayment(null)
        setActionMessage("")
      }, 1500)
    } catch (err: any) {
      setActionMessage("Error: " + (err.message || "Update failed"))
    }
    setActionLoading(false)
  }

  const handleDelete = async () => {
    if (!deletePaymentRecord) return

    const idToDelete = deletePaymentRecord.id
    setActionLoading(true)
    setActionMessage("")

    try {
      await deletePayment(idToDelete)
      setActionMessage("Record deleted! / रिकॉर्ड डिलीट हो गया!")
      await fetchPayments()
      setTimeout(() => {
        setDeleteDialogOpen(false)
        setDeletePaymentRecord(null)
        setActionMessage("")
      }, 1000)
    } catch (err: any) {
      setActionMessage("Error: " + (err.message || "Delete failed"))
    }
    setActionLoading(false)
  }

  const openDeleteDialog = (payment: PaymentRecord) => {
    setDeletePaymentRecord(payment)
    setDeleteDialogOpen(true)
    setActionMessage("")
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("hi-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const getBranches = () => {
    const branches = new Set(payments.map((p) => p.branch))
    return Array.from(branches)
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-primary/20">
              <FiLock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-serif text-3xl text-primary">Admin Panel</CardTitle>
            <CardDescription className="text-base">सरस्वती पूजा 2026 - Payment Records</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-sm font-medium">
                  User ID / यूजर आईडी
                </Label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="userId"
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter User ID"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password / पासवर्ड
                </Label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm text-center p-3 rounded-lg border border-destructive/20">
                  {error}
                </div>
              )}
              <Button type="submit" className="w-full h-12 text-base font-medium">
                Login / लॉगिन करें
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full h-11 gap-2 mt-2 bg-transparent">
                  <FiArrowLeft className="w-4 h-4" />
                  Back to Home / होम पर वापस जाएं
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">सरस्वती पूजा 2026 - भुगतान रिकॉर्ड प्रबंधन</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchPayments}
              disabled={loading}
              className="gap-2 bg-background/50 backdrop-blur"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/">
              <Button variant="outline" className="gap-2 bg-background/50 backdrop-blur">
                <FiArrowLeft className="w-4 h-4" />
                Home
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout} className="gap-2">
              <FiLogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Action Message */}
        {actionMessage && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${actionMessage.includes("Error")
                ? "bg-red-50 border border-red-200 text-red-800"
                : "bg-green-50 border border-green-200 text-green-800"
              }`}
          >
            {actionMessage.includes("Error") ? (
              <FiAlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            )}
            <span className="text-sm font-medium">{actionMessage}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-background/80 backdrop-blur border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributors</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalContributors}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.todayContributions} today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Collection</p>
                  <p className="text-3xl font-bold text-green-600">₹{stats.totalAmount.toLocaleString("hi-IN")}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Avg: ₹{stats.averageAmount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Contributions</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.todayContributions}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <FiFileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-3xl font-bold text-purple-600">{payments.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Showing {filteredPayments.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-background/80 backdrop-blur border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, amount, or branch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                )}
              </div>
              <Select value={filterBranch} onValueChange={setFilterBranch}>
                <SelectTrigger className="w-full md:w-[180px] h-12">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {getBranches().map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
              <FiFileText className="w-4 h-4" />
              <span>
                Database: {payments.length} records • Filtered: {filteredPayments.length} records
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Records Table */}
        <Card className="bg-background/80 backdrop-blur border-primary/20">
          <CardHeader className="border-b border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FiImage className="w-5 h-5 text-primary" />
                  Payment Records / भुगतान रिकॉर्ड
                </CardTitle>
                <CardDescription>
                  Showing {filteredPayments.length} of {payments.length} records
                  {searchQuery && ` for "${searchQuery}"`}
                  {filterBranch !== "all" && ` in ${filterBranch}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  ₹{stats.totalAmount.toLocaleString()} Total
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {stats.totalContributors} Contributors
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">
                <FiRefreshCw className="w-10 h-10 mx-auto mb-4 animate-spin" />
                <p className="text-lg">Loading records...</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <FiUsers className="w-10 h-10" />
                </div>
                <p className="text-xl font-medium">No records found</p>
                <p className="text-sm mt-1">
                  {searchQuery
                    ? `No payments found for "${searchQuery}". Try a different search term.`
                    : "कोई भुगतान रिकॉर्ड नहीं मिला"}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                    className="mt-4"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-16 font-semibold">Sr.No.</TableHead>
                      <TableHead className="font-semibold">Name / नाम</TableHead>
                      <TableHead className="font-semibold">Amount / राशि</TableHead>
                      <TableHead className="font-semibold">Branch / शाखा</TableHead>
                      <TableHead className="font-semibold">Date & Time / तिथि</TableHead>
                      <TableHead className="w-28 font-semibold">Screenshot</TableHead>
                      <TableHead className="w-32 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment, index) => (
                      <TableRow key={payment.id} className="hover:bg-muted/20">
                        <TableCell className="font-bold text-primary">{index + 1}</TableCell>
                        <TableCell className="font-medium">{payment.name}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-50 text-green-700 border-green-200 font-semibold">
                            ₹{Number(payment.amount).toLocaleString("hi-IN")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                            {payment.branch}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span className="text-foreground">
                              {formatDate(payment.timestamp).split(",")[0]}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(payment.timestamp).split(",")[1]}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent hover:bg-primary/10 w-full"
                                onClick={() => setScreenshotView(payment)}
                              >
                                <FiEye className="w-4 h-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <FiImage className="w-5 h-5 text-primary" />
                                  Payment Screenshot - {payment.name}
                                </DialogTitle>
                                <DialogDescription>
                                  Contribution Amount: ₹{Number(payment.amount).toLocaleString("hi-IN")}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {payment.screenshot ? (
                                  <div className="bg-muted/20 rounded-lg p-2">
                                    <img
                                      src={payment.screenshot}
                                      alt={`Payment screenshot from ${payment.name}`}
                                      className="w-full h-auto rounded-lg max-h-[500px] object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg"
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-center py-12 text-muted-foreground">
                                    <FiImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No screenshot available</p>
                                  </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Name:</span>
                                      <span className="font-medium">{payment.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Amount:</span>
                                      <span className="font-semibold text-green-600">
                                        ₹{Number(payment.amount).toLocaleString("hi-IN")}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Branch:</span>
                                      <span className="font-medium">{payment.branch}</span>
                                    </div>
                                  </div>
                                  <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Date:</span>
                                      <span className="font-medium">{formatDate(payment.timestamp)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Record ID:</span>
                                      <span className="font-mono text-sm truncate max-w-[150px]">
                                        {payment.id}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Screenshot:</span>
                                      <span className="text-sm">
                                        {payment.screenshot ? "Available" : "Not Available"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setScreenshotView(null)}>
                                  Close
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 bg-transparent hover:bg-blue-500/10 hover:text-blue-600"
                              onClick={() => handleEditClick(payment)}
                            >
                              <FiEdit className="w-4 h-4" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 bg-transparent hover:bg-red-500/10 hover:text-red-600"
                              onClick={() => openDeleteDialog(payment)}
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </Button>
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

      {/* Edit Dialog */}
      <Dialog open={!!editingPayment} onOpenChange={(open) => !open && setEditingPayment(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FiEdit className="w-5 h-5 text-primary" />
              Edit Record / रिकॉर्ड संपादित करें
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name / नाम</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Amount / राशि (₹)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-branch">Branch / शाखा</Label>
              <Input
                id="edit-branch"
                value={editForm.branch}
                onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-screenshot">Screenshot URL / स्क्रीनशॉट यूआरएल</Label>
              <Input
                id="edit-screenshot"
                value={editForm.screenshot}
                onChange={(e) => setEditForm({ ...editForm, screenshot: e.target.value })}
                className="h-11"
                placeholder="https://example.com/screenshot.jpg"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingPayment(null)} disabled={actionLoading}>
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={actionLoading}>
              {actionLoading ? (
                <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FiSave className="w-4 h-4 mr-2" />
              )}
              Save / सेव करें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <FiTrash2 className="w-5 h-5" />
              Delete Record / रिकॉर्ड डिलीट करें
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {deletePaymentRecord && (
              <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm space-y-2">
                <p>
                  <strong>Name:</strong> {deletePaymentRecord.name}
                </p>
                <p>
                  <strong>Amount:</strong>{" "}
                  <span className="text-green-600 font-semibold">
                    ₹{Number(deletePaymentRecord.amount).toLocaleString("hi-IN")}
                  </span>
                </p>
                <p>
                  <strong>Branch:</strong> {deletePaymentRecord.branch}
                </p>
                <p>
                  <strong>Date:</strong> {formatDate(deletePaymentRecord.timestamp)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeletePaymentRecord(null)
              }}
              disabled={actionLoading}
            >
              <FiX className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
              {actionLoading ? (
                <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FiTrash2 className="w-4 h-4 mr-2" />
              )}
              Delete / डिलीट करें
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}