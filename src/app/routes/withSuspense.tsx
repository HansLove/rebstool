/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSX,ReactNode, Suspense } from "react";
import Loading from "@/components/loaders/loading1/Loading";

export const withSuspense = (
    Component: React.LazyExoticComponent<any>,
    fallback: ReactNode = "Loading..."
  ): JSX.Element => (
    <Suspense
      fallback={
        <div className="absolute inset-1">
          <div className="absolute top-1/2 left-1/2  -translate-x-1/2">
            <Loading />
            {fallback}
          </div>
        </div>

      }
    >
      <Component />
    </Suspense>
  );