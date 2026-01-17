"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
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
} from "react-icons/fi"
import { getPayments, type PaymentRecord } from "@/lib/payment-store"
import Link from "next/link"

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
  const [loading, setLoading] = useState(false)

  const fetchPayments = async () => {
    setLoading(true)
    const data = await getPayments()
    setPayments(data)
    setLoading(false)
  }

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("admin_logged_in") === "true"
    setIsLoggedIn(loggedIn)
    if (loggedIn) {
      fetchPayments()
    }
  }, [])

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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("hi-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
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

  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">सरस्वती पूजा 2026 - भुगतान रिकॉर्ड</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-background/80 backdrop-blur border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributors</p>
                  <p className="text-3xl font-bold text-primary">{payments.length}</p>
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
                  <p className="text-3xl font-bold text-green-600">₹{totalAmount.toLocaleString("hi-IN")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background/80 backdrop-blur border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Event Date</p>
                  <p className="text-xl font-bold text-blue-600">2 Feb 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Records Table */}
        <Card className="bg-background/80 backdrop-blur border-primary/20">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-xl flex items-center gap-2">
              <FiImage className="w-5 h-5 text-primary" />
              Payment Records / भुगतान रिकॉर्ड
            </CardTitle>
            <CardDescription>सभी योगदानकर्ताओं की सूची नीचे दी गई है</CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {loading ? (
              <div className="text-center py-16 text-muted-foreground">
                <FiRefreshCw className="w-10 h-10 mx-auto mb-4 animate-spin" />
                <p className="text-lg">Loading records...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <FiUsers className="w-10 h-10" />
                </div>
                <p className="text-xl font-medium">No records found</p>
                <p className="text-sm mt-1">कोई भुगतान रिकॉर्ड नहीं मिला</p>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment, index) => (
                      <TableRow key={payment.id} className="hover:bg-muted/20">
                        <TableCell className="font-bold text-primary">{index + 1}</TableCell>
                        <TableCell className="font-medium">{payment.name}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-600 font-semibold">
                            ₹{Number(payment.amount).toLocaleString("hi-IN")}
                          </span>
                        </TableCell>
                        <TableCell>{payment.branch}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(payment.timestamp)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2 bg-transparent hover:bg-primary/10">
                                <FiImage className="w-4 h-4" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <div className="space-y-4">
                                <img
                                  src={payment.screenshot || "/placeholder.svg"}
                                  alt={`Payment screenshot from ${payment.name}`}
                                  className="w-full rounded-lg border"
                                />
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
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-medium">{formatDate(payment.timestamp)}</span>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
    </main>
  )
}
