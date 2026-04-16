import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { cn } from '../../lib/utils';

export function SearchableSelect({ 
  value, 
  onValueChange, 
  options = [], 
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  label,
  required = false,
  disabled = false,
  emptyMessage = "No results found.",
  error = false
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  // Tracks the accumulated prefix buffer and the debounce timer
  const typeAheadRef = useRef({ buffer: '', timer: null });

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  const selectedValue = value || '';

  // Type-ahead: when the trigger button is focused (dropdown closed), typing
  // letters quickly builds a prefix buffer (e.g. "ind" → "India").
  // Buffer resets 600ms after the last keypress.
  const handleTriggerKeyDown = (e) => {
    if (disabled || open) return;
    const char = e.key.toLowerCase();
    if (char.length !== 1 || !/[a-z0-9 ]/.test(char)) return;

    e.preventDefault();
    const ta = typeAheadRef.current;

    // Accumulate buffer
    ta.buffer += char;

    // Clear any pending reset
    if (ta.timer) clearTimeout(ta.timer);
    ta.timer = setTimeout(() => { ta.buffer = ''; }, 600);

    // Find first option whose name starts with the current buffer
    const match = options.find(opt => opt.toLowerCase().startsWith(ta.buffer));
    if (match) {
      onValueChange(match);
    }
    // If no match, do nothing (keep current selection)
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
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
      {label && (
        <Label>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !selectedValue && "text-muted-foreground",
            error && "border-red-500"
          )}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleTriggerKeyDown}
          disabled={disabled}
        >
          <span className="truncate">
            {selectedValue || placeholder}
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
                  {emptyMessage}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between",
                      selectedValue === option && "bg-blue-50"
                    )}
                    onClick={() => {
                      onValueChange(option);
                      setOpen(false);
                      setSearch('');
                    }}
                  >
                    <span className="truncate">{option}</span>
                    {selectedValue === option && (
                      <Check className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
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
