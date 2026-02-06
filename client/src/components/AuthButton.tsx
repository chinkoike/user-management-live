type Props = {
  text: string;
  loading?: boolean;
};

export default function AuthButton({ text, loading }: Props) {
  return (
    <button
      disabled={loading}
      className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? "Loading..." : text}
    </button>
  );
}
