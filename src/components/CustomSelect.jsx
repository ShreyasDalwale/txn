import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const CustomSelect = ({ value, onChange, options, placeholder, id, className, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className || ''}`} id={id}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-left text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between transition-all duration-150 outline-none focus:border-slate-900 dark:focus:border-zinc-400 focus:ring-1 focus:ring-slate-900 dark:focus:ring-zinc-400 cursor-pointer"
        required={required}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="flex-shrink-0">{selectedOption.icon}</span>}
              <span className="truncate font-medium">{selectedOption.label}</span>
              {selectedOption.subLabel && (
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">
                  ({selectedOption.subLabel})
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 font-medium">{placeholder || 'Select...'}</span>
          )}
        </span>
        <svg
          className={`h-4 w-4 text-slate-400 dark:text-slate-555 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-1.5 shadow-xl dark:shadow-none max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left rounded-xl px-3 py-2.5 text-xs transition duration-100 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-zinc-900/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="flex-shrink-0 text-sm">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </span>
                {opt.subLabel && (
                  <span
                    className={`text-[10px] font-semibold font-mono ${
                      isSelected ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {opt.subLabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

CustomSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      subLabel: PropTypes.string,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
};

export default CustomSelect;
