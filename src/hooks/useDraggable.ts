import { useEffect, useRef, useState } from "react";

interface Coords {
  x: number;
  y: number;
}

// TODO: return isBeingDragged too
// TODO: allow the user to pass in a bounding box for the draggable element

/**
 * Allows an absolute positioned element to be clicked and dragged around the screen.
 * @returns A ref for the element to be dragged, and an optional ref for the handle
 */
export function useDraggable() {
  const [isBeingDragged, setIsBeingDragged] = useState(false);
  const [relativeCoords, setRelativeCoords] = useState<Coords | null>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Move the draggable element with the mouse
    function handleMouseMove(event: MouseEvent) {
      if (draggableRef.current !== null && relativeCoords !== null) {
        draggableRef.current.style.left =
          event.clientX + relativeCoords.x + "px";
        draggableRef.current.style.top =
          event.clientY + relativeCoords.y + "px";
      }
    }

    if (isBeingDragged) {
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isBeingDragged, relativeCoords, draggableRef]);

  useEffect(() => {
    // Stop dragging when the user lets go of the mouse or switches away from the browser tab
    function stopDragging() {
      setIsBeingDragged(false);
    }
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("blur", stopDragging);

    return () => {
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("blur", stopDragging);
    };
  }, [setIsBeingDragged]);

  useEffect(() => {
    // Start dragging when the user clicks
    function startDragging(event: MouseEvent) {
      if (draggableRef.current !== null) {
        const rect = draggableRef.current.getBoundingClientRect();
        const x = rect.left - event.clientX;
        const y = rect.top - event.clientY;
        setRelativeCoords({ x, y });
        setIsBeingDragged(true);
      }
    }

    let usingHandle = false;
    const handle = handleRef.current;
    const draggable = draggableRef.current;

    if (handle !== null) {
      handle.addEventListener("mousedown", startDragging);
    } else if (draggable !== null) {
      draggable.addEventListener("mousedown", startDragging);
    }
    return () => {
      if (usingHandle && handle !== null) {
        handle.removeEventListener("mousedown", startDragging);
      } else if (draggable !== null) {
        draggable.removeEventListener("mousedown", startDragging);
      }
    };
  }, [handleRef, draggableRef]);

  return [draggableRef, handleRef];
}
