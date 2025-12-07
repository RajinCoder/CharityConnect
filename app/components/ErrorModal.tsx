export default function ErrorModal({ message }: { message: string }) {
  return (
    <div className="absolute bottom-0 bg-red-200 border border-red-600 flex items-center justify-center p-4 rounded-md h-20 w-full">
      {message}
    </div>
  );
}
