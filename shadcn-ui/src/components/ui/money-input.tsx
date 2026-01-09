import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface MoneyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number | string;
  onValueChange: (value: number) => void;
}

export function MoneyInput({ value, onValueChange, className, ...props }: MoneyInputProps) {
  // Format helper: 1234567 -> "1,234,567"
  const formatNumber = (num: number | string) => {
    if (!num && num !== 0) return '';
    return new Intl.NumberFormat('en-US').format(Number(num));
  };

  const [displayValue, setDisplayValue] = useState(formatNumber(value));

  // Sync internal state with external prop changes
  useEffect(() => {
    setDisplayValue(formatNumber(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Remove non-numeric chars (except dot if we want decimals, but usually just commas for integer currency)
    // Assuming integer for VND usually, but let's allow decimals just in case if needed, though usually finance apps here use integer for VND.
    // Let's stick to simple integer for now or allow standard float parsing.
    
    // Remove all commas
    const unformatted = rawValue.replace(/,/g, '');
    
    // Check if it's a valid number
    if (unformatted === '' || /^\d*\.?\d*$/.test(unformatted)) {
      if (unformatted === '') {
        setDisplayValue('');
        onValueChange(0);
        return;
      }
      
      const numValue = parseFloat(unformatted);
      if (!isNaN(numValue)) {
         // Update display with commas only if it's not ending with a dot (to allow typing "1.")
         // Actually, formatting while typing is tricky. 
         // Better strategy: Store raw input in display state, format on blur? 
         // OR standard approach: Format on every change but carefully manage cursor? 
         // Simplest for now: Format on change, but handle the "trailing dot" or "intermediate zeros" gracefully?
         // Let's try the simple "format on change" approach which works well for integers.
         
         const formatted = new Intl.NumberFormat('en-US').format(numValue);
         setDisplayValue(formatted);
         onValueChange(numValue);
      } else {
          // If parse fails but regex passed (e.g. "."), just update display?
          setDisplayValue(rawValue);
      }
    }
  };

  // Improved Strategy:
  // 1. User types "1234" -> display "1,234"
  // 2. User deletes -> update accordingly.
  // Limitation: Cursor jumping can happen if we force format every keystroke.
  // For this MV, let's use a simpler approach: controlled input where we format the display value.

  return (
    <Input
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={className}
      placeholder="0"
      {...props}
    />
  );
}
