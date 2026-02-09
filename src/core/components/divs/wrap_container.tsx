"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import WrapItem from "./wrap_item";

const WrapContainer = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [itemsPerRow, setItemsPerRow] = useState<number>(0);

  // Count the number of valid React elements in children
  const childrenArray = Children.toArray(children);
  const validChildren = childrenArray.filter((child) => isValidElement(child));

  useEffect(() => {
    const calculateItemsPerRow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const minItemWidth = 300; // min-w-[300px]
        const gapWidth = 40; // gap-x-10 = 40px

        // Calculate how many items can fit in one row
        // Formula: (containerWidth - gapWidth * (n-1)) / n >= minItemWidth
        // where n is the number of items per row
        let maxItems = Math.floor(
          (containerWidth + gapWidth) / (minItemWidth + gapWidth)
        );

        // Ensure at least 1 item per row
        maxItems = Math.max(1, maxItems);

        setItemsPerRow(maxItems);
        console.log(
          `Container width: ${containerWidth}px, Items per row: ${maxItems}`
        );
      }
    };

    calculateItemsPerRow();

    // Use ResizeObserver for more reliable width detection
    const resizeObserver = new ResizeObserver(() => {
      calculateItemsPerRow();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize as fallback
    const handleResize = () => calculateItemsPerRow();
    window.addEventListener("resize", handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [validChildren.length]);

  // Calculate how many empty items are needed to fill the last row
  const emptyItemsNeeded = useMemo(() => {
    // If itemsPerRow is not calculated yet, try to estimate it
    let currentItemsPerRow = itemsPerRow;

    if (currentItemsPerRow === 0 && containerRef.current) {
      const containerWidth =
        containerRef.current.clientWidth || window.innerWidth;
      const minItemWidth = 300;
      const gapWidth = 40;
      currentItemsPerRow = Math.max(
        1,
        Math.floor((containerWidth + gapWidth) / (minItemWidth + gapWidth))
      );
    }

    if (currentItemsPerRow === 0) return 0;

    const totalItems = validChildren.length;
    const itemsInLastRow = totalItems % currentItemsPerRow;

    // If the last row is not full, add empty items to fill it
    if (itemsInLastRow > 0) {
      return currentItemsPerRow - itemsInLastRow;
    }

    return 0;
  }, [itemsPerRow, validChildren.length]);

  console.log(
    `Items per row: ${itemsPerRow}, Total items: ${validChildren.length}, Empty items needed: ${emptyItemsNeeded}`
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap gap-x-10 gap-y-2 justify-between"
    >
      {children}
      {/* Add empty WrapItems to fill the last row */}
      {Array.from({ length: emptyItemsNeeded }, (_, index) => (
        <WrapItem key={`empty-${index}`}>
          <></>
        </WrapItem>
      ))}
    </div>
  );
};

export default WrapContainer;
