import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function Button({
  children,
  to,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon = true,
  className = '',
  type = 'button'
}) {
  const baseStyles = "inline-flex items-center justify-center font-body uppercase tracking-wider rounded-full transition-all duration-300 font-medium group";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-xs gap-1.5",
    md: "px-6 py-3 text-xs md:text-sm gap-2",
    lg: "px-8 py-4 text-sm md:text-base gap-2.5"
  };

  const variantStyles = {
    primary: "bg-earth-900 text-earth-50 hover:bg-clay hover:shadow-lg hover:shadow-clay/20",
    secondary: "bg-earth-100 text-earth-900 hover:bg-earth-200 border border-earth-300/40",
    clay: "bg-clay text-white hover:bg-earth-700 hover:shadow-lg hover:shadow-clay/30",
    outline: "border border-earth-900 text-earth-900 hover:bg-earth-900 hover:text-white",
    ghost: "text-earth-900 hover:text-clay hover:bg-earth-100/50"
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowRight
          size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
          className="transition-transform group-hover:translate-x-1"
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
}
export default Button;
