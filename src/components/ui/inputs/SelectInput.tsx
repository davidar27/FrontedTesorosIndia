import ChevronDownIcon from "@/components/ui/icons/ChevronDownIcon";


interface SelectInputProps {
  id: string;
  label: string;
  value: string | number;
  options: { value: string | number; label: string }[];
  onChange: (value: string | number) => void;
  className?: string;
}

const SelectInput = ({
  id,
  label,
  value,
  options,
  onChange,
}: SelectInputProps) => {
  const inputStyles = `
    w-full rounded-lg p-3 bg-white/90 text-gray-800 border border-gray-200
    focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent
    transition-all duration-200 hover:shadow-sm appearance-none pr-8
  `;

  const labelStyles = `
    block text-sm font-semibold mb-1 text-white
  `;

  return (
    <div className="space-y-1">
      <label htmlFor={id} className={labelStyles}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`${inputStyles} appearance-none pr-10`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
      </div>
    </div>

  );
};

export default SelectInput;
