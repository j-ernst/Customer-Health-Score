"use client"

import { useState, useMemo } from "react"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Custom number formatter to avoid hydration issues
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Mock data - replace with your CSV data
const mockCustomerData = [
  {
    company_id: "COMP-001",
    company_name: "Acme Corp",
    health_score: 85,
    recent_usage: 92,
    usage_trend: 78,
    peak_usage: 95,
    support_tickets: 2,
    last_login_days: 1,
    feature_adoption: 88,
    contract_value: 50000,
  },
  {
    company_id: "COMP-002",
    company_name: "TechStart Inc",
    health_score: 45,
    recent_usage: 35,
    usage_trend: 42,
    peak_usage: 68,
    support_tickets: 8,
    last_login_days: 14,
    feature_adoption: 52,
    contract_value: 25000,
  },
  {
    company_id: "COMP-003",
    company_name: "Global Solutions",
    health_score: 72,
    recent_usage: 68,
    usage_trend: 75,
    peak_usage: 82,
    support_tickets: 3,
    last_login_days: 2,
    feature_adoption: 71,
    contract_value: 75000,
  },
  {
    company_id: "COMP-004",
    company_name: "Innovation Labs",
    health_score: 28,
    recent_usage: 15,
    usage_trend: 22,
    peak_usage: 45,
    support_tickets: 12,
    last_login_days: 28,
    feature_adoption: 31,
    contract_value: 15000,
  },
  {
    company_id: "COMP-005",
    company_name: "Enterprise Systems",
    health_score: 91,
    recent_usage: 89,
    usage_trend: 94,
    peak_usage: 97,
    support_tickets: 1,
    last_login_days: 0,
    feature_adoption: 93,
    contract_value: 120000,
  },
  {
    company_id: "COMP-006",
    company_name: "Digital Dynamics",
    health_score: 58,
    recent_usage: 52,
    usage_trend: 61,
    peak_usage: 73,
    support_tickets: 5,
    last_login_days: 7,
    feature_adoption: 64,
    contract_value: 35000,
  },
]

type SortField = keyof (typeof mockCustomerData)[0]
type SortDirection = "asc" | "desc"

export default function CustomerHealthDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("health_score")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  const getHealthScoreColor = (score: number) => {
    if (score >= 70) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 70) return "Healthy"
    if (score >= 40) return "At Risk"
    return "Critical"
  }

  const filteredAndSortedData = useMemo(() => {
    const filtered = mockCustomerData.filter(
      (customer) =>
        customer.company_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return filtered
  }, [searchTerm, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />
    return sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const criticalCustomers = filteredAndSortedData.filter((c) => c.health_score < 40).length
  const atRiskCustomers = filteredAndSortedData.filter((c) => c.health_score >= 40 && c.health_score < 70).length
  const healthyCustomers = filteredAndSortedData.filter((c) => c.health_score >= 70).length

  return (
    <div className="min-h-screen bg-neutral-50 p-6" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Customer Health Dashboard</h1>
          <p className="text-neutral-600">Monitor customer health scores and proactively reduce churn risk</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-600">{filteredAndSortedData.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Critical Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">At Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{atRiskCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Healthy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{healthyCustomers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Health Metrics</CardTitle>
            <CardDescription>Search and sort customers by health score and underlying metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search by Company ID or Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary-50">
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("company_id")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Company ID {getSortIcon("company_id")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("company_name")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Company Name {getSortIcon("company_name")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("health_score")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Health Score {getSortIcon("health_score")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("recent_usage")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Recent Usage {getSortIcon("recent_usage")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("usage_trend")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Usage Trend {getSortIcon("usage_trend")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("peak_usage")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Peak Usage {getSortIcon("peak_usage")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("support_tickets")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Support Tickets {getSortIcon("support_tickets")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("last_login_days")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Last Login (Days) {getSortIcon("last_login_days")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("feature_adoption")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Feature Adoption {getSortIcon("feature_adoption")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("contract_value")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Contract Value {getSortIcon("contract_value")}
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.map((customer) => (
                    <TableRow key={customer.company_id} className="hover:bg-primary-25">
                      <TableCell className="font-medium text-primary-700">{customer.company_id}</TableCell>
                      <TableCell className="font-medium">{customer.company_name}</TableCell>
                      <TableCell>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getHealthScoreColor(customer.health_score)}`}
                        >
                          {customer.health_score} - {getHealthScoreLabel(customer.health_score)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${customer.recent_usage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-neutral-600">{customer.recent_usage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${customer.usage_trend}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-neutral-600">{customer.usage_trend}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${customer.peak_usage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-neutral-600">{customer.peak_usage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            customer.support_tickets > 5
                              ? "bg-red-100 text-red-800"
                              : customer.support_tickets > 2
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {customer.support_tickets}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            customer.last_login_days > 14
                              ? "bg-red-100 text-red-800"
                              : customer.last_login_days > 7
                                ? "bg-orange-100 text-orange-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {customer.last_login_days}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-500 h-2 rounded-full"
                              style={{ width: `${customer.feature_adoption}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-neutral-600">{customer.feature_adoption}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-primary-700">
                        {formatCurrency(customer.contract_value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
