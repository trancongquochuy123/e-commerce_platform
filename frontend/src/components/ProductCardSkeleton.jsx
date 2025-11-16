import React from "react";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="animate-shimmer h-[230px] w-full rounded-t-[14px] bg-[linear-gradient(110deg,#ececec_8%,#f5f5f5_18%,#ececec_33%)] bg-size-[200%_100%] md:h-[180px]"></div>
      <div className="flex flex-col gap-3 p-4">
        <div className="animate-shimmer h-[18px] w-3/4 rounded bg-[linear-gradient(110deg,#ececec_8%,#f5f5f5_18%,#ececec_33%)] bg-size-[200%_100%]"></div>
        <div className="animate-shimmer h-3.5 w-[45%] rounded bg-[linear-gradient(110deg,#ececec_8%,#f5f5f5_18%,#ececec_33%)] bg-size-[200%_100%]"></div>
        <div className="mt-1 flex items-center justify-between">
          <div className="animate-shimmer h-[22px] w-[70px] rounded bg-[linear-gradient(110deg,#ececec_8%,#f5f5f5_18%,#ececec_33%)] bg-size-[200%_100%]"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
