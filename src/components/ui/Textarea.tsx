'use client';

import React from 'react';
import { cn } from '@utils/index';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, label, error, helperText, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-900 mb-2">
            {label}
            {props.required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border-2 border-secondary-200 rounded-lg',
            'bg-white text-secondary-900 placeholder-secondary-400',
            'focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100',
            'transition-colors duration-200',
            'disabled:bg-secondary-100 disabled:cursor-not-allowed',
            'resize-none',
            error && 'border-red-600 focus:border-red-600 focus:ring-red-100',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-secondary-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
