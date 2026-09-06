'use client';

import React from 'react';
import { cn } from '@utils/index';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, icon, ...props },
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
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-500 dark:text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-2 border-2 border-secondary-200 rounded-lg',
              'bg-white text-secondary-900 placeholder-secondary-400',
              'dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:placeholder-slate-400',
              'focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100',
              'transition-colors duration-200',
              'disabled:bg-secondary-100 disabled:cursor-not-allowed',
              error && 'border-red-600 focus:border-red-600 focus:ring-red-100',
              icon && 'pl-10',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-secondary-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
