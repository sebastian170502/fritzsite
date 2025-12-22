'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Star, Check, X, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Review {
  id: string
  customerName: string
  email: string
  rating: number
  title: string
  comment: string
  approved: boolean
  verified: boolean
  createdAt: string
  product: {
    id: string
    name: string
    slug: string
  }
}

export default function AdminReviewsPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/admin/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (reviewId: string, approved: boolean) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      })

      if (response.ok) {
        toast.success(approved ? 'Review approved' : 'Review unapproved')
        fetchReviews()
      } else {
        toast.error('Failed to update review')
      }
    } catch (error) {
      console.error('Failed to update review:', error)
      toast.error('Failed to update review')
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Review deleted')
        fetchReviews()
      } else {
        toast.error('Failed to delete review')
      }
    } catch (error) {
      console.error('Failed to delete review:', error)
      toast.error('Failed to delete review')
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'pending') return !review.approved
    if (filter === 'approved') return review.approved
    return true
  })

  const pendingCount = reviews.filter((r) => !r.approved).length

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All ({reviews.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          onClick={() => setFilter('pending')}
        >
          Pending ({pendingCount})
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Approved ({reviews.length - pendingCount})
        </Button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading reviews...
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No reviews found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(review.rating)}
                    {review.approved && (
                      <span className="text-xs bg-green-500/20 text-green-600 px-2 py-1 rounded">
                        Approved
                      </span>
                    )}
                    {!review.approved && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                    {review.verified && (
                      <span className="text-xs bg-blue-500/20 text-blue-600 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-1">
                    {review.title || 'No title'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {review.comment}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{review.customerName}</span>
                    <span>•</span>
                    <span>{review.email}</span>
                    <span>•</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={() =>
                        router.push(`/shop/${review.product.slug}`)
                      }
                      className="text-sm text-primary hover:underline"
                    >
                      {review.product.name}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!review.approved ? (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(review.id, true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApprove(review.id, false)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Unapprove
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
