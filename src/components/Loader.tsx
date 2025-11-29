// src/components/Loader.tsx
import { memo } from "react";

export default memo(function Loader({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <img src="/loading.gif" alt="Loading" className="mx-auto mb-2 w-12 h-12" />
        <p>{message}</p>
      </div>
    </div>
  );
});
