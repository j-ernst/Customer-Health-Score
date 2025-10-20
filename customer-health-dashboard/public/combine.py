import pandas as pd

# Read the CSV files
companies_df = pd.read_csv('customer_health_scores_random_forest_final.csv')
licenses_df = pd.read_csv('licenses.csv', sep='#')

# Select only company_id and quantity from licenses
licenses_df = licenses_df[['company_id', 'quantity']]

# Merge on company_id
merged_df = companies_df.merge(licenses_df, on='company_id', how='left')

# Display the result
print(merged_df)

# Optional: Save to a new CSV
merged_df.to_csv('merged_data.csv', index=False)