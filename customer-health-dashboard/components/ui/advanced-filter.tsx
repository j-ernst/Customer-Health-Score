import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface Filter {
  id: number;
  column: string;
  operator: string;
  value: string;
}

interface AdvancedFilterProps {
  data?: Record<string, any>[];
  onFilterChange?: (filtered: Record<string, any>[]) => void;
  numericColumns?: string[];
}

export default function AdvancedFilter({ 
  data = [], 
  onFilterChange = () => {}, 
  numericColumns = [] 
}: AdvancedFilterProps) {
  const [filters, setFilters] = useState<Filter[]>([]);

  const operators = [
    { value: '>', label: '>' },
    { value: '<', label: '<' },
    { value: '=', label: '=' },
    { value: '!=', label: '≠' },
    { value: '>=', label: '≥' },
    { value: '<=', label: '≤' }
  ];

  const applyFilters = (newFilters: Filter[]): void => {
    const filtered = data.filter(row => {
      return newFilters.every(filter => {
        if (!filter.column || !filter.operator || filter.value === '') return true;
        
        const value = parseFloat(row[filter.column]);
        const filterValue = parseFloat(filter.value);

        switch (filter.operator) {
          case '>':
            return value > filterValue;
          case '<':
            return value < filterValue;
          case '=':
            return value === filterValue;
          case '!=':
            return value !== filterValue;
          case '>=':
            return value >= filterValue;
          case '<=':
            return value <= filterValue;
          default:
            return true;
        }
      });
    });

    onFilterChange(filtered);
  };

  const addFilter = (): void => {
    const newFilter: Filter = { id: Date.now(), column: '', operator: '>', value: '' };
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
  };

  const removeFilter = (id: number): void => {
    const newFilters = filters.filter(f => f.id !== id);
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const updateFilter = (id: number, field: keyof Filter, newValue: string): void => {
    const newFilters = filters.map(f =>
      f.id === id ? { ...f, [field]: newValue } : f
    );
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className="bg-white border rounded-md p-4 mb-6">
      <div className="space-y-3">
        {filters.map((filter, index) => (
          <div key={filter.id} className="flex items-center gap-3">
            <span className="text-gray-500 text-sm w-8">{index > 0 ? 'AND' : ''}</span>
            
            <select
              value={filter.column}
              onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
              className="flex-1 px-3 py-2 border rounded text-sm bg-white"
            >
              <option value="">Spalte wählen</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>

            <select
              value={filter.operator}
              onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
              className="px-3 py-2 border rounded text-sm bg-white w-20"
            >
              {operators.map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>

            <input
              type="number"
              value={filter.value}
              onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
              placeholder="Wert"
              className="w-24 px-3 py-2 border rounded text-sm"
            />

            <button
              onClick={() => removeFilter(filter.id)}
              className="p-2 text-gray-400 hover:text-red-600 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <button
          onClick={addFilter}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
        >
          <Plus size={18} />
          Filter hinzufügen
        </button>
      </div>
    </div>
  );
}