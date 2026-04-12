import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ChevronsUpDown } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { cn } from '../../lib/utils';

/**
 * MultiSelectCountries
 *
 * Props:
 *   value          — comma-separated string of selected countries (backend format)
 *   onChange       — called with updated comma-separated string
 *   options        — string[] of available country names
 *   label          — optional label text
 *   placeholder    — text shown when nothing is selected
 *   searchPlaceholder
 */
export function MultiSelectCountries({
  value = '',
  onChange,
  options = [],
  label,
  placeholder = 'Select countries...',
  searchPlaceholder = 'Search countries...',
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Parse value string → array
  const selected = value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(search.toLowerCase()) &&
      !selected.includes(opt)
  );

  const add = (country) => {
    const next = [...selected, country];
    onChange(next.join(', '));
    setSearch('');
  };

  const remove = (country) => {
    const next = selected.filter((c) => c !== country);
    onChange(next.join(', '));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && <Label>{label}</Label>}

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((country) => (
            <span
              key={country}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1"
            >
              {country}
              <button
                type="button"
                onClick={() => remove(country)}
                className="hover:text-blue-600 focus:outline-none"
                aria-label={`Remove ${country}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown trigger */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          className={cn(
            'w-full justify-between font-normal',
            selected.length === 0 && 'text-muted-foreground'
          )}
          onClick={() => setOpen(!open)}
        >
          <span className="truncate">
            {selected.length === 0
              ? placeholder
              : `${selected.length} countr${selected.length === 1 ? 'y' : 'ies'} selected`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  ref={inputRef}
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">
                  {search ? 'No results found.' : 'All countries selected.'}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      add(option);
                    }}
                  >
                    {option}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
