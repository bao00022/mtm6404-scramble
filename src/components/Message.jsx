export function Message({ color, children }) {
  return (
    <div className={`px-2 py-1 flex justify-center items-center mb-4 ${color} ${children ? "" : "hidden"}`}>
      <p>{children}</p>
    </div>
  );
}
