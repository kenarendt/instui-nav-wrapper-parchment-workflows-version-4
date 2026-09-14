import { ChevronDown } from "lucide-react";
import FormField from "./FormField.jsx";
import "./Select.css";

/**
 * Select — mirrors InstUI Select (single choice), styled to match TextInput
 * with a trailing chevron.
 * options: [{ value, label }]
 *
 * `placeholder` adds a disabled empty option so a required select can start
 * with nothing chosen. Without it the first option is silently "selected" and a
 * form can report itself complete before the user has picked anything.
 */
export default function Select({
  id,
  label,
  required = false,
  value,
  onChange,
  options = [],
  placeholder,
}) {
  return (
    <FormField id={id} label={label} required={required}>
      <div className="select">
        <select
          id={id}
          className="select__control"
          value={value}
          onChange={onChange}
          required={required}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="select__chevron"
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </FormField>
  );
}
