import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';

interface SelectInputProps {
  id: number;
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[];
  placeholder?: string;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const SelectInput = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Selecciona una opción",
  error = null,
  required = false,
  disabled = false,
  className = ""
}: SelectInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const labelStyles = `
    block text-sm font-semibold transition-colors duration-200
    ${error ? 'text-red-600' : 'text-white'}
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  const containerStyles = `
    relative w-full transition-all duration-200
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  const triggerStyles = `
    w-full px-4 py-4  rounded-xl text-left cursor-pointer
    transition-all duration-200 ease-in-out
    flex items-center justify-between
    focus:outline-none focus:ring-4
    ${error
      ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-200'
      : isFocused || isOpen
        ? 'border-amber-400 bg-amber-50/30 focus:border-amber-500 focus:ring-amber-200'
        : 'border-gray-200 bg-white hover:border-secondary'
    }
    ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}
  `;

  const optionStyles = (isSelected: boolean, isHovered: boolean) => `
    px-4 py-3 cursor-pointer transition-all duration-150
    flex items-center justify-between
    ${isSelected
      ? 'bg-amber-100 text-amber-800 font-medium'
      : 'text-gray-700 hover:bg-amber-50'
    }
    ${isHovered ? 'bg-amber-50' : ''}
  `;

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        (triggerRef.current && triggerRef.current.contains(e.target as Node)) ||
        (dropdownRef.current && dropdownRef.current.contains(e.target as Node))
      ) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="space-y-1">
      <label htmlFor={id.toString()} className={labelStyles}>
        {label}
      </label>

      <div className={containerStyles}>
        <div
          className={triggerStyles}
          ref={triggerRef}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className={`block truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'
              }`}
          />
        </div>
        {isOpen && createPortal(
          <div
            ref={dropdownRef}
            className="z-50 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-y-auto max-h-60"
            style={{
              position: 'absolute',
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              transition: 'transform 0.2s, opacity 0.2s',
              transform: isOpen ? 'scale(1)' : 'scale(0.95)',
              opacity: isOpen ? 1 : 0,
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={optionStyles(option.value === value, false)}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                <span className="block truncate">{option.label}</span>
                {option.value === value && (
                  <CheckIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>,
          document.body
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectInput;