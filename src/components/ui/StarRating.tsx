import { FiStar } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number; // 0-5
  className?: string;
}

export function StarRating({ rating, className }: StarRatingProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar
          key={i}
          className={cn(
            "text-sm",
            i < rating ? "fill-amber-400 text-amber-400" : "text-white/15"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}