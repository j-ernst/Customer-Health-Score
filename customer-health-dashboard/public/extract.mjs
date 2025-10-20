import Papa from 'papaparse';
import fs from 'fs';

// Read the CSV file
const csvData = fs.readFileSync('customer_health_scores_random_forest_final.csv', 'utf8');

// Parse the CSV
const parsed = Papa.parse(csvData, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true
});

// Extract company IDs
const companyIds = parsed.data
  .map(row => row.company_id)
  .filter(id => id !== undefined && id !== null);

console.log(`Total company IDs extracted: ${companyIds.length}`);
console.log(`First 10 IDs: ${companyIds.slice(0, 10).join(', ')}`);
console.log(`Full list as array: [${companyIds.join(', ')}]`);