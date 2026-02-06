type Props = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
};

export default function AuthInput({
  label,
  type = "text",
  value,
  onChange,
  error,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md border px-3 py-2 focus:outline-none
        ${error ? "border-red-500" : "border-gray-300"}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
