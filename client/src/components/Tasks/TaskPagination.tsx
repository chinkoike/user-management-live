export default function TaskPagination({
  page,
  totalPages,
  setPage,
}: {
  page: number;
  totalPages: number;
  setPage: (p: number | ((prev: number) => number)) => void;
}) {
  // ถ้ามีแค่หน้าเดียว ไม่ต้องโชว์ Pagination เลยก็ได้ครับ จะได้ไม่รก
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-30"
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Prev
      </button>

      <span className="font-medium">
        Page {page} of {totalPages}
      </span>

      <button
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-30"
        disabled={page >= totalPages}
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
      >
        Next
      </button>
    </div>
  );
}
