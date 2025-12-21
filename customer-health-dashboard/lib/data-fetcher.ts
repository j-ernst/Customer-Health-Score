export interface CustomerHealthData {
  company_id: string;
  company: string;
  priority_rank: number;
  priority_score: number;
  priority_label: string;
  churn_probability: number;
  risk_category: string;
  primary_risk_factor: string;
  recommended_action: string;
  value_tier: string;
  num_licenses: number;
  product: string;
  contract_type: string;
  ARR: number;
  estimated_mrr: number;
  tenure_days: number;
  activities_last_4w: number;
  activity_vs_baseline_ratio: number;
  days_since_last_activity: number;
  activity_trend: number;  // Changed from string to number
  week_1_activities: number;
  week_2_activities: number;
  week_3_activities: number;
  week_4_activities: number;
  total_spent: number;
  spent_per_tenure_day: number;
  total_activities: number;
  activities_per_week_baseline: number;
  avg_activity_last_4w: number;
}

export async function fetchCustomerData(): Promise<CustomerHealthData[]> {
  try {
    console.log("Starting to fetch customer data...");
    console.log("Fetching from: /merged_data.csv");
    console.log("Make sure the CSV file is in the /public directory");

    const response = await fetch("/customer_churn_dashboard.csv");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}. Make sure merged_data.csv is in your /public directory`);
    }

    const csvText = await response.text();
    console.log("CSV text length:", csvText.length);
    console.log("First 500 characters:", csvText.substring(0, 500));

    if (!csvText || csvText.trim().length === 0) {
      throw new Error("Empty CSV data received");
    }

    // Robust CSV parser that handles quoted fields with commas and escaped quotes
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      let i = 0;

      while (i < line.length) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
          // Escaped quote within quoted field
          current += '"';
          i += 2;
          continue;
        }

        if (char === '"') {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
          continue;
        }

        if (char === "," && !inQuotes) {
          // Field separator
          result.push(current.trim());
          current = "";
          i++;
          continue;
        }

        // Regular character
        current += char;
        i++;
      }

      // Push the last field
      result.push(current.trim());
      
      return result;
    };

    // Split by newlines and handle different line endings
    const lines = csvText.trim().split(/\r?\n/);
    console.log("Number of lines:", lines.length);

    if (lines.length < 2) {
      throw new Error("CSV must have at least a header and one data row");
    }

    // Parse headers
    const headers = parseCSVLine(lines[0]);
    console.log("Headers:", headers);
    console.log("Number of headers:", headers.length);

    const data: CustomerHealthData[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const line = lines[i].trim();
        if (!line) continue; // Skip empty lines

        const values = parseCSVLine(line);

        if (values.length !== headers.length) {
          console.warn(
            `Row ${i} has ${values.length} values but expected ${headers.length}. Skipping.`
          );
          continue;
        }

        const row: any = {};

        headers.forEach((header, headerIndex) => {
          const value = values[headerIndex];

          // Parse numeric fields
          if (
            [
              "priority_rank",
              "priority_score",
              "churn_probability",
              "num_licenses",
              "ARR",
              "estimated_mrr",
              "tenure_days",
              "activities_last_4w",
              "activity_vs_baseline_ratio",
              "days_since_last_activity",
              "activity_trend",
              "week_1_activities",
              "week_2_activities",
              "week_3_activities",
              "week_4_activities",
              "total_spent",
              "spent_per_tenure_day",
              "total_activities",
              "activities_per_week_baseline",
              "avg_activity_last_4w",
            ].includes(header)
          ) {
            // Skip empty strings
            if (value === "" || value === null || value === undefined) {
              row[header] = null;
            } else {
              const numValue = Number.parseFloat(value);
              row[header] = isNaN(numValue) ? null : numValue;
            }
          } else {
            row[header] = value || "";
          }
        });

        // Ensure company_id is always a string
        if (row.company_id !== undefined) {
          row.company_id = row.company_id.toString();
        }

        data.push(row as CustomerHealthData);
        
        // Log first few records for debugging
        if (i <= 3) {
          console.log(`Row ${i} sample:`, {
            company_id: row.company_id,
            company: row.company,
            priority_rank: row.priority_rank,
            risk_category: row.risk_category,
            churn_probability: row.churn_probability,
            ARR: row.ARR
          });
        }
      } catch (rowError) {
        console.warn(`Error parsing row ${i}:`, rowError);
      }
    }

    console.log(`Successfully loaded ${data.length} customer records`);
    if (data.length > 0) {
      console.log("First complete record:", data[0]);
      console.log("All column names:", Object.keys(data[0]));
    }
    return data;
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return [];
  }
}