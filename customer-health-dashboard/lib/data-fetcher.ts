export interface CustomerHealthData {
  company_id: string,
  company: string,
  tenure_days: number
  is_new_customer: number
  is_mature_customer: number
  days_to_contract_end: number
  contract_expiring_soon: number
  baseline_type: string
  baseline_weekly_avg: number
  max_weekly_activity: number
  activities_w_1: number
  activities_w_2: number
  activities_w_3: number
  activities_w_4: number
  total_4weeks: number
  avg_weekly_4weeks: number
  week_1_vs_2_change: number
  week_2_vs_3_change: number
  week_3_vs_4_change: number
  activity_correlation: number
  current_vs_baseline_ratio: number
  current_vs_max_ratio: number
  weeks_with_activity: number
  weeks_with_zero_activity: number
  consecutive_zero_weeks: number
  activity_consistency: number
  total_activities: number
  activities_last_30d: number
  activities_last_7d: number
  activities_last_3d: number
  unique_tasks_30d: number
  unique_days_active_30d: number
  unique_days_active_7d: number
  days_since_last_activity: number
  activities_per_day_30d: number
  activities_per_active_day_30d: number
  strong_decline: number
  moderate_decline: number
  stable_trend: number
  growing_trend: number
  no_recent_activity: number
  sporadic_user: number
  inactive_user: number
  dormant_user: number
  below_baseline: number
  well_below_max: number
  highly_inconsistent: number
  zero_activity_period: number
  churn_probability: number
  health_score: number
  risk_level: string
  num_contacts: number
}

export async function fetchCustomerData(): Promise<CustomerHealthData[]> {
  try {
    console.log("Starting to fetch customer data...")

    const response = await fetch(
      //"/customer_health_scores_random_forest_short.csv",
      "/customer_health_scores_random_forest_final.csv",
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const csvText = await response.text()
    console.log("CSV text length:", csvText.length)
    console.log("First 500 characters:", csvText.substring(0, 500))

    if (!csvText || csvText.trim().length === 0) {
      throw new Error("Empty CSV data received")
    }

    // Split by newlines and handle different line endings
    const lines = csvText.trim().split(/\r?\n/)
    console.log("Number of lines:", lines.length)

    if (lines.length < 2) {
      throw new Error("CSV must have at least a header and one data row")
    }

    // Parse headers
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))
    console.log("Headers:", headers)

    const data: CustomerHealthData[] = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i].trim()
        if (!line) continue // Skip empty lines

        // Handle CSV parsing with potential commas in quoted fields
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))

        if (values.length !== headers.length) {
          console.warn(`Row ${i} has ${values.length} values but expected ${headers.length}`)
          continue
        }

        const row: any = {}

        headers.forEach((header, headerIndex) => {
          const value = values[headerIndex]

          // Parse numeric fields
          if (
            [
              "tenure_days",
              "is_new_customer",
              "is_mature_customer",
              "days_to_contract_end",
              "contract_expiring_soon",
              "baseline_weekly_avg",
              "max_weekly_activity",
              "activities_w_1",
              "activities_w_2",
              "activities_w_3",
              "activities_w_4",
              "total_4weeks",
              "avg_weekly_4weeks",
              "week_1_vs_2_change",
              "week_2_vs_3_change",
              "week_3_vs_4_change",
              "activity_correlation",
              "current_vs_baseline_ratio",
              "current_vs_max_ratio",
              "weeks_with_activity",
              "weeks_with_zero_activity",
              "consecutive_zero_weeks",
              "activity_consistency",
              "total_activities",
              "activities_last_30d",
              "activities_last_7d",
              "activities_last_3d",
              "unique_tasks_30d",
              "unique_days_active_30d",
              "unique_days_active_7d",
              "days_since_last_activity",
              "activities_per_day_30d",
              "activities_per_active_day_30d",
              "strong_decline",
              "moderate_decline",
              "stable_trend",
              "growing_trend",
              "no_recent_activity",
              "sporadic_user",
              "inactive_user",
              "dormant_user",
              "below_baseline",
              "well_below_max",
              "highly_inconsistent",
              "zero_activity_period",
              "churn_probability",
              "health_score",
              "num_contacts"
            ].includes(header)
          ) {
            const numValue = Number.parseFloat(value)
            row[header] = isNaN(numValue) ? 0 : numValue
          } else {
            row[header] = value || ""
          }
        })

        // Ensure company_id is always a string
        if (row.company_id !== undefined) {
          row.company_id = row.company_id.toString()
        }

        data.push(row as CustomerHealthData)
      } catch (rowError) {
        console.warn(`Error parsing row ${i}:`, rowError)
      }
    }

    console.log(`Successfully loaded ${data.length} customer records`)
    console.log("Sample record:", data[0])
    return data
  } catch (error) {
    console.error("Error fetching customer data:", error)
    return []
  }
}
