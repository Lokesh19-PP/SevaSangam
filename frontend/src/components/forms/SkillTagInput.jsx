import React, { useState } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const DEFAULT_SKILL_SUGGESTIONS = [
  'Plumbing & Pipe Fitting',
  'Sanitary Ware Installation',
  'Domestic Electrical Wiring',
  'MCB & Inverter Setup',
  'Carpentry & Joinery',
  'Furniture Assembly',
  'House Deep Cleaning',
  'Air Conditioner Repair',
  'Elder Care Assistance',
  'Gardening & Landscaping',
];

/**
 * SkillTagInput Component — SevaSangam
 * 
 * Reusable interactive tag input for worker skills and trade specializations.
 * Supports adding tags on Enter or Comma, quick suggestion buttons, tag removal,
 * duplicate filtering, and max-tag constraints.
 * 
 * Reuses Janhvi's Badge and Button components from components/ui.
 */
const SkillTagInput = ({
  value = [],
  onChange,
  suggestions = DEFAULT_SKILL_SUGGESTIONS,
  placeholder = 'Add a skill (press Enter or comma)...',
  label = 'Skills & Specializations',
  maxTags = 12,
  disabled = false,
  error = null,
  helperText = 'Select or type verified vocational trade skills recognized by the cooperative.',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const tags = Array.isArray(value) ? value : [];

  const addTag = (text) => {
    if (disabled || tags.length >= maxTags) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    // Duplicate check (case-insensitive)
    const exists = tags.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      const updated = [...tags, trimmed];
      onChange?.(updated);
    }
    setInputValue('');
  };

  const removeTag = (indexToRemove) => {
    if (disabled) return;
    const updated = tags.filter((_, idx) => idx !== indexToRemove);
    onChange?.(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const availableSuggestions = suggestions.filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label and Count Header */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 tracking-wide">
            {label}
          </label>
        )}
        <span className="text-[11px] text-slate-400 font-medium">
          {tags.length} / {maxTags} skills
        </span>
      </div>

      {/* Main Tag Input Box */}
      <div
        className={`
          flex flex-wrap items-center gap-2 p-2.5 rounded-xl border bg-white transition-all
          ${disabled ? 'bg-slate-50 border-slate-200 cursor-not-allowed' : 'border-slate-300 focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-100'}
          ${error ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-100' : ''}
        `}
      >
        {/* Rendered Skill Badges */}
        {tags.map((tag, idx) => (
          <Badge
            key={idx}
            variant="primary"
            size="md"
            className="pl-2.5 pr-1.5 py-1 text-xs gap-1.5 shadow-2xs group"
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                aria-label={`Remove skill ${tag}`}
                onClick={() => removeTag(idx)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-primary-700 hover:text-rose-600 hover:bg-rose-100/70 transition-colors cursor-pointer"
              >
                &times;
              </button>
            )}
          </Badge>
        ))}

        {/* Text input for custom typing */}
        {!disabled && tags.length < maxTags && (
          <div className="flex-1 min-w-[160px] flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => inputValue && addTag(inputValue)}
              placeholder={tags.length === 0 ? placeholder : 'Add more...'}
              disabled={disabled}
              className="w-full bg-transparent border-none p-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            {inputValue.trim() && (
              <Button
                type="button"
                variant="primary"
                size="xs"
                onClick={() => addTag(inputValue)}
                className="shrink-0"
              >
                Add
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Helper text or Error message */}
      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}

      {/* Suggested Skills List */}
      {!disabled && availableSuggestions.length > 0 && tags.length < maxTags && (
        <div className="pt-1">
          <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
            Suggested Trade Skills (click to add):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {availableSuggestions.slice(0, 6).map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addTag(sug)}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-700 hover:bg-primary-50 hover:text-primary-800 hover:border-primary-200 transition-colors cursor-pointer"
              >
                <span className="text-primary-600 font-bold">+</span>
                <span>{sug}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillTagInput;
