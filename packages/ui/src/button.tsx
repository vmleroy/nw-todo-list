'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

export const Button = ({
  children,
  className,
  variant = 'default',
  size = 'default',
  onClick,
  ...props
}: ButtonProps) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer';
  
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900',
    destructive: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-sm',
    lg: 'h-12 rounded-md px-8'
  };

  const buttonClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <button className={buttonClassName} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};
