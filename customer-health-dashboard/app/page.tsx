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
    <div className="min-h-screen bg-neutral-50 p-6 pt-0" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto space-y-6">
        <svg className="w-32 p-0 m-0" width="376" height="103" viewBox="0 0 376 103" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M128.245 68.8135C125.108 67.0984 122.671 64.7064 120.888 61.6825C119.106 58.6586 118.226 55.206 118.226 51.3697C118.226 47.5334 119.106 44.0807 120.888 41.0568C122.671 38.033 125.108 35.6635 128.245 33.9484C131.382 32.256 134.947 31.3984 138.942 31.3984C142.936 31.3984 145.666 32.1206 148.442 33.5422C151.218 34.9639 153.384 37.04 154.918 39.748L149.525 43.2232C148.284 41.3502 146.772 39.9511 144.944 39.0033C143.116 38.0781 141.108 37.6042 138.874 37.6042C136.64 37.6042 133.999 38.1683 131.968 39.2967C129.915 40.425 128.313 42.0498 127.162 44.1484C126.011 46.2471 125.424 48.6391 125.424 51.3697C125.424 54.1002 126.011 56.5599 127.162 58.6586C128.313 60.7573 129.915 62.3595 131.968 63.5104C134.022 64.6387 136.324 65.2029 138.874 65.2029C141.424 65.2029 143.116 64.729 144.944 63.8037C146.772 62.8785 148.307 61.4568 149.525 59.5838L154.918 62.9914C153.384 65.6993 151.24 67.7754 148.442 69.2422C145.666 70.6865 142.484 71.4312 138.942 71.4312C134.925 71.386 131.359 70.5285 128.245 68.8135Z" fill="#2D3644"/>
          <path d="M163.562 16.3242H170.67V71.2056H163.562V16.3242Z" fill="#2D3644"/>
          <path d="M190.122 68.8135C187.008 67.0984 184.594 64.7064 182.834 61.6825C181.073 58.6586 180.216 55.206 180.216 51.3697C180.216 47.5334 181.096 44.0807 182.834 41.0568C184.594 38.033 187.008 35.6635 190.122 33.9484C193.237 32.256 196.734 31.3984 200.616 31.3984C204.497 31.3984 207.995 32.256 211.087 33.9484C214.178 35.6409 216.593 38.0104 218.33 41.0568C220.091 44.0807 220.948 47.5334 220.948 51.3697C220.948 55.206 220.068 58.6586 218.33 61.6825C216.57 64.7064 214.156 67.0984 211.087 68.8135C207.995 70.5285 204.52 71.4086 200.616 71.4086C196.734 71.3861 193.237 70.5285 190.122 68.8135ZM207.408 63.4427C209.394 62.2918 210.974 60.667 212.102 58.5683C213.23 56.4697 213.795 54.0776 213.795 51.3471C213.795 48.6166 213.23 46.2245 212.102 44.1259C210.974 42.0272 209.394 40.425 207.408 39.2741C205.4 38.1458 203.166 37.5816 200.638 37.5816C198.111 37.5816 195.877 38.1458 193.868 39.2741C191.883 40.4024 190.303 42.0272 189.13 44.1259C187.979 46.2245 187.392 48.6166 187.392 51.3471C187.392 54.0776 187.979 56.4697 189.13 58.5683C190.28 60.667 191.86 62.2918 193.868 63.4427C195.877 64.5936 198.111 65.1803 200.638 65.1803C203.166 65.1803 205.4 64.5936 207.408 63.4427Z" fill="#2D3644"/>
          <path d="M237.534 68.8135C234.397 67.0984 231.96 64.7064 230.177 61.6825C228.395 58.6586 227.515 55.206 227.515 51.3697C227.515 47.5334 228.395 44.0807 230.177 41.0568C231.96 38.033 234.397 35.6635 237.534 33.9484C240.671 32.256 244.236 31.3984 248.231 31.3984C252.225 31.3984 254.955 32.1206 257.731 33.5422C260.507 34.9639 262.673 37.04 264.208 39.748L258.814 43.2232C257.573 41.3502 256.061 39.9511 254.233 39.0033C252.405 38.0781 250.397 37.6042 248.163 37.6042C245.929 37.6042 243.289 38.1683 241.258 39.2967C239.204 40.425 237.602 42.0498 236.451 44.1484C235.3 46.2471 234.713 48.6391 234.713 51.3697C234.713 54.1002 235.3 56.5599 236.451 58.6586C237.602 60.7573 239.204 62.3595 241.258 63.5104C243.311 64.6387 245.613 65.2029 248.163 65.2029C250.713 65.2029 252.405 64.729 254.233 63.8037C256.061 62.8785 257.596 61.4568 258.814 59.5838L264.208 62.9914C262.673 65.6993 260.529 67.7754 257.731 69.2422C254.955 70.6865 251.773 71.4312 248.231 71.4312C244.236 71.386 240.671 70.5285 237.534 68.8135Z" fill="#2D3644"/>
          <path d="M288.173 53.13L280.049 60.6672V71.3862H272.94V16.5273H280.049V51.7309L301.419 32.211H309.994L293.498 48.4136L311.619 71.4088H302.886L288.173 53.13Z" fill="#2D3644"/>
          <path d="M319.293 23.2294C318.39 22.3493 317.916 21.2661 317.916 19.9798C317.916 18.6936 318.367 17.6104 319.293 16.6851C320.195 15.7825 321.346 15.3086 322.723 15.3086C324.099 15.3086 325.25 15.7374 326.153 16.5949C327.055 17.4524 327.529 18.5356 327.529 19.8219C327.529 21.1082 327.078 22.2816 326.153 23.1843C325.25 24.0869 324.099 24.5608 322.723 24.5608C321.346 24.5608 320.218 24.1095 319.293 23.2294ZM319.18 32.098H326.288V71.2958H319.18V32.098Z" fill="#2D3644"/>
          <path d="M371.33 36.1599C374.264 39.0484 375.73 43.2683 375.73 48.8422V71.4086H368.622V49.6546C368.622 45.8634 367.719 42.9975 365.891 41.0794C364.064 39.1612 361.446 38.1909 358.061 38.1909C354.676 38.1909 351.178 39.3192 348.967 41.5533C346.755 43.7873 345.649 47.0143 345.649 51.2117V71.386H338.541V32.1882H345.356V38.1006C346.778 36.0696 348.718 34.5351 351.156 33.4519C353.593 32.3687 356.368 31.8271 359.483 31.8271C364.447 31.8271 368.396 33.2714 371.33 36.1599Z" fill="#2D3644"/>
          <path d="M48.8568 67.0984C39.8303 67.0984 32.4736 59.7418 32.4736 50.7152C32.4736 41.6887 39.8303 34.332 48.8568 34.332C57.8834 34.332 65.24 41.6887 65.24 50.7152C65.24 59.7418 57.8834 67.0984 48.8568 67.0984ZM48.8568 39.2515C42.5382 39.2515 37.3931 44.3966 37.3931 50.7152C37.3931 57.0338 42.5382 62.1789 48.8568 62.1789C55.1754 62.1789 60.3205 57.0338 60.3205 50.7152C60.3205 44.3966 55.1754 39.2515 48.8568 39.2515Z" fill="#1A9DD9"/>
          <path d="M48.8566 83.3464C30.8712 83.3464 16.2256 68.7008 16.2256 50.7154C16.2256 32.73 30.8712 18.0845 48.8566 18.0845C66.842 18.0845 81.4875 32.73 81.4875 50.7154C81.4875 68.7008 66.842 83.3464 48.8566 83.3464ZM48.8566 23.0265C33.5791 23.0265 21.1451 35.4606 21.1451 50.738C21.1451 66.0154 33.5791 78.4495 48.8566 78.4495C64.134 78.4495 76.5681 66.0154 76.5681 50.738C76.5681 35.4606 64.134 23.0265 48.8566 23.0265Z" fill="#1A9DD9"/>
          <path d="M97.5323 46.9241C96.6523 36.0471 92.1841 26.163 85.3239 18.4679C83.7669 16.7077 82.0744 15.0829 80.2916 13.5484C72.6191 7.09442 62.9607 2.94221 52.3545 2.17495C51.181 2.08468 50.0301 2.03955 48.8341 2.03955C47.6381 2.03955 46.4872 2.08468 45.3138 2.17495C34.4819 2.94221 24.6204 7.27495 16.8801 13.9772C15.6164 15.1055 14.3978 16.3015 13.2244 17.5426C12.4797 18.3325 12.5023 19.5511 13.2695 20.3183L13.9239 20.9727C14.7138 21.7626 16.0226 21.74 16.7899 20.9276C17.9182 19.709 19.1368 18.5807 20.4005 17.4975C27.2381 11.6754 35.881 7.88424 45.3589 7.13955C46.5098 7.04929 47.6832 6.98159 48.8792 6.98159C50.0753 6.98159 51.2262 7.04929 52.3996 7.13955C61.6518 7.88424 70.0916 11.4949 76.839 17.0688C78.6443 18.5581 80.3368 20.2055 81.8713 21.9657C87.8514 28.7581 91.7779 37.4236 92.6354 46.9466C92.7483 48.2555 92.816 49.5869 92.816 50.9409C92.816 52.2949 92.7708 52.9719 92.7031 53.9873C92.0487 63.6457 88.235 72.4466 82.3 79.3971L85.7978 82.8949C92.6129 75.0418 96.9682 64.9997 97.6452 53.9873C97.7129 52.9719 97.758 51.9564 97.758 50.9409C97.7129 49.5643 97.6452 48.2555 97.5323 46.9241Z" fill="#1A9DD9"/>
          <path d="M47.1417 95.9609L47.0514 98.3303C47.0289 99.0525 47.593 99.6392 48.3152 99.6392H49.4209C50.143 99.6392 50.7072 99.0299 50.6846 98.3303L50.5944 95.9609C50.5718 95.2613 50.0076 94.7197 49.3081 94.7197H48.4054C47.751 94.7197 47.1868 95.2613 47.1417 95.9609Z" fill="#1A9DD9"/>
          <path d="M40.8903 99.0073C41.2514 99.075 41.6125 99.1202 41.951 99.1653C42.6731 99.2781 43.3275 98.7591 43.4178 98.037L43.6886 95.6901C43.7563 95.0131 43.2824 94.3812 42.6054 94.2684L41.7253 94.133C41.0483 94.0202 40.3939 94.4715 40.2811 95.1485L39.8297 97.4728C39.6943 98.2175 40.1682 98.8945 40.8903 99.0073Z" fill="#1A9DD9"/>
          <path d="M33.6241 97.2245C33.9626 97.3373 34.3011 97.4501 34.6622 97.5404C35.3617 97.7435 36.0838 97.3599 36.2869 96.6603L36.9188 94.3811C37.0993 93.7267 36.7157 93.0271 36.0613 92.824L35.2037 92.5758C34.5493 92.3727 33.8498 92.7112 33.6015 93.3656L32.8117 95.5771C32.5635 96.2541 32.9245 96.9988 33.6241 97.2245Z" fill="#1A9DD9"/>
          <path d="M26.7192 94.3587C27.0351 94.5166 27.3736 94.6746 27.6895 94.8326C28.344 95.1485 29.1338 94.8777 29.4271 94.2007L30.3975 92.0569C30.6683 91.425 30.4201 90.6803 29.7882 90.387L28.9758 89.9808C28.3665 89.6649 27.5993 89.9131 27.2833 90.5224L26.155 92.5985C25.8165 93.2303 26.0648 94.0202 26.7192 94.3587Z" fill="#1A9DD9"/>
          <path d="M20.333 90.4544C20.6264 90.6575 20.9198 90.8832 21.2131 91.0863C21.8224 91.4925 22.6348 91.3571 23.0184 90.7252L24.3047 88.7394C24.6883 88.1527 24.5304 87.3854 23.9662 87.0018L23.2215 86.4828C22.6574 86.0766 21.8901 86.212 21.4614 86.7536L20.0397 88.6266C19.6109 89.2133 19.7237 90.0257 20.333 90.4544Z" fill="#1A9DD9"/>
          <path d="M16.2937 82.1501L14.6012 83.7749C14.0822 84.2939 14.0822 85.1063 14.6012 85.6253C14.8494 85.8736 15.1202 86.1218 15.391 86.37C15.9326 86.8665 16.745 86.8439 17.2415 86.3023L18.7985 84.5422C19.2499 84.0231 19.2273 83.2333 18.7308 82.7594L18.0764 82.1276C17.5799 81.6762 16.7901 81.6762 16.2937 82.1276V82.1501Z" fill="#1A9DD9"/>
          <path d="M11.8929 76.8245L9.9748 78.1785C9.36551 78.6073 9.25268 79.4196 9.704 80.0064C9.92967 80.2997 10.1328 80.5705 10.3584 80.8639C10.8098 81.4506 11.6221 81.5409 12.1863 81.067L13.9916 79.555C14.5332 79.1263 14.6009 78.3365 14.1947 77.7949L13.6531 77.0727C13.2244 76.5537 12.4571 76.4409 11.8929 76.8245Z" fill="#1A9DD9"/>
          <path d="M8.35019 70.8895L6.22895 71.9501C5.57452 72.266 5.32629 73.0558 5.66479 73.7103C5.82275 74.0262 6.00328 74.3421 6.18381 74.6581C6.54488 75.2899 7.3347 75.5156 7.96656 75.1545L9.99753 73.9359C10.5843 73.5749 10.7874 72.8302 10.4714 72.2209L10.0427 71.4311C9.70417 70.8218 8.95948 70.5735 8.35019 70.8895Z" fill="#1A9DD9"/>
          <path d="M5.75476 64.4807L3.49812 65.2029C2.79856 65.4285 2.4375 66.1732 2.68573 66.8502C2.79856 67.1887 2.93396 67.5272 3.04679 67.8657C3.29502 68.5427 4.06228 68.9038 4.73927 68.6104L6.92821 67.7303C7.56007 67.4821 7.876 66.76 7.65033 66.1055L7.3344 65.248C7.10874 64.6161 6.40918 64.2777 5.75476 64.4807Z" fill="#1A9DD9"/>
          <path d="M4.17562 57.756L1.85129 58.1171C1.12916 58.2299 0.655268 58.9069 0.790666 59.6291C0.858365 59.9901 0.926064 60.3286 0.993763 60.6897C1.15173 61.4118 1.82872 61.8631 2.55084 61.6826L4.85261 61.141C5.5296 60.983 5.95836 60.3286 5.82297 59.6516L5.64244 58.7715C5.48447 58.0945 4.85261 57.6432 4.17562 57.756Z" fill="#1A9DD9"/>
          <path d="M3.63382 50.8506H1.28691C0.564789 50.8506 -0.0219365 51.4599 0.000629886 52.182C0.000629886 52.5431 0.0231962 52.9041 0.0457626 53.2652C0.0908953 53.9873 0.700187 54.5515 1.42231 54.4838L3.76921 54.3032C4.44621 54.2581 4.9878 53.6714 4.94267 52.9718L4.89753 52.0692C4.89753 51.3922 4.33337 50.8506 3.63382 50.8506Z" fill="#1A9DD9"/>
          <path d="M4.1521 43.9453L1.82777 43.5843C1.10564 43.4714 0.451219 43.9905 0.360954 44.7126C0.315821 45.0737 0.270688 45.4347 0.248122 45.7958C0.180423 46.5179 0.699449 47.1723 1.42157 47.2175L3.76848 47.398C4.44547 47.4431 5.05476 46.9467 5.14502 46.2697L5.23529 45.367C5.30299 44.6675 4.8291 44.0582 4.1521 43.9453Z" fill="#1A9DD9"/>
          <path d="M5.70967 37.1981L3.45303 36.4986C2.75348 36.2729 2.03135 36.6791 1.82825 37.3786C1.73799 37.7171 1.62516 38.0782 1.53489 38.4167C1.35436 39.1163 1.76055 39.8384 2.48268 39.9963L4.78445 40.5379C5.46144 40.6959 6.13843 40.2897 6.31896 39.6353L6.54463 38.7778C6.74772 38.1008 6.36409 37.4012 5.70967 37.1981Z" fill="#1A9DD9"/>
          <path d="M8.28216 30.7666L6.16093 29.7285C5.5065 29.4126 4.73924 29.6834 4.42331 30.3604C4.10739 31.0374 4.12995 31.0148 3.97199 31.3533C3.67862 32.0303 3.99455 32.7975 4.67155 33.0683L6.86048 33.9484C7.49234 34.1967 8.23703 33.9033 8.50783 33.2714L8.86889 32.4365C9.18482 31.8272 8.91402 31.0825 8.28216 30.7666Z" fill="#1A9DD9"/>
          <path d="M11.825 24.8315L9.90682 23.4775C9.29752 23.0488 8.5077 23.2293 8.10151 23.8386C7.89841 24.1319 7.69531 24.4479 7.51478 24.7412C7.13115 25.3505 7.31168 26.1629 7.94354 26.5465L9.97452 27.7426C10.5612 28.1036 11.3285 27.9231 11.7121 27.3364L12.2086 26.5691C12.5471 25.9824 12.3891 25.2151 11.825 24.8315Z" fill="#1A9DD9"/>
          <path d="M80.7433 76.9598L88.2128 84.4292C88.7995 85.016 88.5964 86.0314 87.8292 86.3474L75.6433 91.2217C74.6956 91.6053 73.7478 90.6575 74.1088 89.7098L78.8252 77.366C79.1186 76.5761 80.1566 76.3505 80.7433 76.9598Z" fill="#1A9DD9"/>
          <path d="M48.8565 54.2809C50.8257 54.2809 52.422 52.6846 52.422 50.7154C52.422 48.7462 50.8257 47.1499 48.8565 47.1499C46.8873 47.1499 45.291 48.7462 45.291 50.7154C45.291 52.6846 46.8873 54.2809 48.8565 54.2809Z" fill="#1A9DD9"/>
        </svg>
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">Customer Health Dashboard</h1>
          <p className="text-neutral-600">Zuletzt aktualisiert: 22.06.2025</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-neutral-600">Kunden Gesamt</CardTitle>
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
            <CardTitle>Customer Health Metriken</CardTitle>
            <CardDescription>Suche und sortiere Kunden nach Health Score und Metriken</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Search className="h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Suche nach Kundennummer oder Name..."
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
                        Kundennummer {getSortIcon("company_id")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("company_name")}
                        className="h-auto p-0 font-semibold text-primary-700 hover:text-primary-800"
                      >
                        Kundenname {getSortIcon("company_name")}
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
