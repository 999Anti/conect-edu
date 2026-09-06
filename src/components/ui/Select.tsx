'use client';

import React from 'react';
import { cn } from '@utils/index';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, helperText, options, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-900 mb-2 dark:text-slate-200">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border-2 border-secondary-200 rounded-lg',
            'bg-white text-secondary-900 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700',
            'focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100',
            'transition-colors duration-200',
            'disabled:bg-secondary-100 disabled:cursor-not-allowed',
            error && 'border-red-600 focus:border-red-600 focus:ring-red-100',
            className
          )}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-secondary-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
