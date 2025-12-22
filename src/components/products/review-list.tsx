"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
  createdAt: string;
  images?: string;
}

interface ReviewListProps {
  productId: string;
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchReviews();
    // Load voted reviews from localStorage
    const voted = localStorage.getItem("votedReviews");
    if (voted) {
      setVotedReviews(new Set(JSON.parse(voted)));
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (
    reviewId: string,
    action: "helpful" | "notHelpful"
  ) => {
    if (votedReviews.has(reviewId)) {
      toast.error("You have already voted on this review");
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));

        // Save vote to localStorage
        const newVoted = new Set(votedReviews);
        newVoted.add(reviewId);
        setVotedReviews(newVoted);
        localStorage.setItem(
          "votedReviews",
          JSON.stringify(Array.from(newVoted))
        );

        toast.success("Thank you for your feedback!");
      }
    } catch (error) {
      console.error("Failed to vote:", error);
      toast.error("Failed to submit vote");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Loading reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reviews yet. Be the first to review this product!
      </div>
    );
  }

  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center gap-4 pb-6 border-b border-border">
        <div className="text-center">
          <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
          <div className="flex gap-1 mt-2">
            {renderStars(Math.round(averageRating))}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </div>
        </div>

        {/* Rating distribution could go here */}
      </div>

      {/* Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="pb-6 border-b border-border last:border-0"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {renderStars(review.rating)}
                  {review.verified && (
                    <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                {review.title && (
                  <h4 className="font-semibold text-lg">{review.title}</h4>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>

            <p className="text-sm font-medium mb-2">{review.customerName}</p>
            <p className="text-muted-foreground mb-4">{review.comment}</p>

            {/* Helpful buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(review.id, "helpful")}
                disabled={votedReviews.has(review.id)}
                className="text-sm"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Helpful ({review.helpful})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote(review.id, "notHelpful")}
                disabled={votedReviews.has(review.id)}
                className="text-sm"
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                Not Helpful ({review.notHelpful})
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
