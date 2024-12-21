"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import jsonData from 'public/data.json';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, SortAsc, SortDesc, X, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import { debounce } from 'lodash';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UnitScore } from '@/types/dashboard'

// convert a UnitScore to a unique ID:
const unitScoreToId = (row: UnitScore) => `${row.unit_code}${row.Season}`;

// Comparison operators
const OPERATORS = {
  '>=': (a, b) => a >= b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '<': (a, b) => a < b,
  '=': (a, b) => a === b,
  '!=': (a, b) => a !== b,
};

const ITEMS_PER_PAGE = 50;

const parseFilter = (filterStr) => {
  if (!filterStr) return null;

  const operatorMatch = Object.keys(OPERATORS).find(op => filterStr.includes(op));

  if (!operatorMatch) return { operator: 'contains', value: filterStr };
  
  const [value] = filterStr.split(operatorMatch).slice(1);
  const numValue = parseFloat(value.trim());
  
  return {
    operator: operatorMatch,
    value: isNaN(numValue) ? value.trim() : numValue
  };
};

const evaluateFilter = (value, filter, aggregationType) => {
  if (!filter) return true;
  
  if (filter.operator === 'contains') {
    return value.toString().toLowerCase().includes(filter.value.toLowerCase());
  }
  
  const numValue = Array.isArray(value) 
    ? value[aggregationType === "mean" ? 0 : 1]
    : value;
    
  return OPERATORS[filter.operator](numValue, filter.value);
};

const ScoreCell = ({ value, max = 5 }) => {
  const getColor = (score) => {
    if (score === 0) {
      return 'rgb(128, 128, 128)'; // Grey for zero
    }
    const ratio = score / max;
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red}, ${green}, 0)`;
  };

  return (
    <div className="w-16 h-8 flex items-center justify-center text-white font-medium rounded"
         style={{ backgroundColor: getColor(value) }}>
      {value?.toFixed(2)}
    </div>
  );
};

const FilterInput = ({ value, onChange, type = 'text', placeholder }) => {
  const handleChange = debounce((e) => {
    onChange(e.target.value);
  }, 300);

  return (
    <div className="flex items-center gap-1 p-1">
      <Search className="w-4 h-4 text-gray-400" />
      <Input
        type={type}
        defaultValue={value}
        onChange={handleChange}
        placeholder={`${placeholder} (e.g. >4.3, >=80)`}
        className="h-6 text-sm"
      />
    </div>
  );
};

const ColumnManager = ({ columns, visibleColumns, onToggle }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-4">
          <Settings2 className="w-4 h-4 mr-2" />
          Manage Columns
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Visible Columns</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {columns.map(column => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                checked={visibleColumns.has(column)}
                onCheckedChange={() => onToggle(column)}
                id={`column-${column}`}
              />
              <label htmlFor={`column-${column}`} className="text-sm font-medium">
                {column}
              </label>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UnitScoresDashboard = () => {
  const [data] = useState<UnitScore[]>(jsonData as UnitScore[]);
  const [filters, setFilters] = useState({});
  const [selectedUnits, setSelectedUnits] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState(new Set([
    'unit_name', 'unit_code', 'Season', 'Level', 'Responses', 'Invited', 
    ...Array.from({length: 13}, (_, i) => `I${i+1}`), 'agg_score'
  ]));
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [aggregationType, setAggregationType] = useState('mean');
  const [currentPage, setCurrentPage] = useState(1);

  const allColumns = useMemo(() => [
    'unit_name', 'unit_code', 'Season', 'Level', 'Responses', 'Invited', 'Response Rate',
    ...Array.from({length: 13}, (_, i) => `I${i+1}`), 'agg_score'
  ], []);

  const handleFilter = (column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleColumn = (column) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const filteredData = useMemo(() => {
    // Only show data if there are active filters
    if (Object.values(filters).every(v => !v)) return [];

    return data.filter(row => {
      return Object.entries(filters).every(([key, filterStr]) => {
        if (!filterStr) return true;
        
        const filter = parseFilter(filterStr);
        const cellValue = row[key];
        
        return evaluateFilter(cellValue, filter, aggregationType);
      });
    });
  }, [data, filters, aggregationType]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aVal = a[sortConfig.key!];
      let bVal = b[sortConfig.key!];

      if (Array.isArray(aVal)) {
        aVal = aggregationType === 'mean'
          ? aVal[0]
          : aVal[1];
      }
      if (Array.isArray(bVal)) {
        bVal = aggregationType === 'mean'
          ? bVal[0]
          : bVal[1];
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, aggregationType]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  const selectedRowsData = useMemo(() => {
    return data.filter(row => selectedUnits.has(unitScoreToId(row)));
  }, [data, selectedUnits]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedUnits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    })
  };

  const toggleAllSelected = (checked: boolean) => {
    setSelectedUnits(prev => {
      const newSet = new Set(prev);
      paginatedData.forEach(row => {
        if (checked) {
          newSet.add(unitScoreToId(row));
        } else {
          newSet.delete(unitScoreToId(row));
        }
      });

      return newSet;
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unit Scores Dashboard</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Select
                value={aggregationType}
                onValueChange={setAggregationType}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mean">Mean</SelectItem>
                  <SelectItem value="median">Median</SelectItem>
                </SelectContent>
              </Select>
              <ColumnManager
                columns={allColumns}
                visibleColumns={visibleColumns}
                onToggle={toggleColumn}
              />
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({});
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border">
                    <Checkbox
                      checked={
                        paginatedData.length > 0 &&
                        selectedUnits.size === paginatedData.length
                      }
                      onCheckedChange={toggleAllSelected}
                    />
                  </th>
                  {Array.from(visibleColumns).map((column) => (
                    <th key={column} className="p-2 border">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span>{column}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort(column)}
                          >
                            {sortConfig.key === column ? (
                              sortConfig.direction === "asc" ? (
                                <SortAsc className="w-4 h-4" />
                              ) : (
                                <SortDesc className="w-4 h-4" />
                              )
                            ) : null}
                          </Button>
                        </div>
                        <FilterInput
                          value={filters[column]}
                          onChange={(value) => handleFilter(column, value)}
                          type={
                            typeof data[0][column] === "number"
                              ? "text"
                              : "text"
                          }
                          placeholder={`Filter ${column}`}
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.size + 1}
                      className="p-8 text-center text-gray-500"
                    >
                      Enter filters above to view data
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((row, index) => {
                    const actualIndex =
                      (currentPage - 1) * ITEMS_PER_PAGE + index;
                    return (
                      <tr
                        key={actualIndex}
                        className={
                          selectedUnits.has(unitScoreToId(row))
                            ? "bg-blue-50"
                            : ""
                        }
                      >
                        <td className="p-2 border">
                          <Checkbox
                            checked={selectedUnits.has(unitScoreToId(row))}
                            onCheckedChange={() =>
                              toggleRowSelection(unitScoreToId(row))
                            }
                          />
                        </td>
                        {Array.from(visibleColumns).map((column) => (
                          <td key={column} className="p-2 border">
                            {Array.isArray(row[column]) ? (
                              <ScoreCell
                                value={
                                  aggregationType === "mean"
                                    ? row[column][0]
                                    : row[column][1]
                                }
                              />
                            ) : (
                              row[column]
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedUnits.size > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Comparison Table ({selectedUnits.size} items)
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedUnits(new Set());
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear Table
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    {Array.from(visibleColumns).map((column) => (
                      <th key={column} className="p-2 border">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedRowsData.map((row) => (
                    <tr key={unitScoreToId(row)}>
                      {Array.from(visibleColumns).map((col) => (
                        <td key={col} className="p-2 border">
                          {Array.isArray(row[col]) ? (
                            <ScoreCell
                              value={
                                aggregationType === "mean"
                                  ? row[col][0]
                                  : row[col][1]
                              }
                            />
                          ) : (
                            row[col]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UnitScoresDashboard;