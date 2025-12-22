'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const MATERIALS = [
  { value: 'carbon-steel', label: 'Carbon Steel' },
  { value: 'stainless-steel', label: 'Stainless Steel' },
  { value: 'wrought-iron', label: 'Wrought Iron' },
  { value: 'damascus-steel', label: 'Damascus Steel' },
]

const CATEGORIES = [
  { value: 'knife', label: 'Knife' },
  { value: 'axe', label: 'Axe' },
  { value: 'sword', label: 'Sword' },
  { value: 'tool', label: 'Tool' },
  { value: 'decor', label: 'Decor' },
]

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: number
  material: string
  category: string
  stock: number
  images: string[]
  bladeLength?: string
  bladeWidth?: string
  handleLength?: string
  weight?: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: 0,
    material: '',
    category: '',
    stock: 0,
    images: [],
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Product created successfully')
        router.push('/admin')
        router.refresh()
      } else {
        toast.error('Failed to create product')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
      toast.error('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      setFormData({
        ...formData,
        images: [...formData.images, url],
      })
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-heading font-bold">Add New Product</h1>
        </div>
      </header>

      {/* Form */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-heading font-bold">Basic Information</h2>

            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                placeholder="auto-generated-from-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                rows={5}
                placeholder="Describe the product in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (RON) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (g)</Label>
                <Input
                  id="weight"
                  value={formData.weight || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  placeholder="e.g., 450"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="material">Material *</Label>
                <Select
                  value={formData.material}
                  onValueChange={(value) =>
                    setFormData({ ...formData, material: value })
                  }
                  required
                >
                  <SelectTrigger id="material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATERIALS.map((material) => (
                      <SelectItem key={material.value} value={material.value}>
                        {material.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-heading font-bold">Dimensions (Optional)</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bladeLength">Blade Length</Label>
                <Input
                  id="bladeLength"
                  value={formData.bladeLength || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bladeLength: e.target.value })
                  }
                  placeholder="e.g., 25cm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bladeWidth">Blade Width</Label>
                <Input
                  id="bladeWidth"
                  value={formData.bladeWidth || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, bladeWidth: e.target.value })
                  }
                  placeholder="e.g., 3cm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="handleLength">Handle Length</Label>
                <Input
                  id="handleLength"
                  value={formData.handleLength || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, handleLength: e.target.value })
                  }
                  placeholder="e.g., 12cm"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-heading font-bold">Product Images</h2>
              <Button type="button" variant="outline" onClick={handleImageUrlAdd}>
                Add Image URL
              </Button>
            </div>

            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-40 object-cover rounded border border-border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleImageRemove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No images added. Click "Add Image URL" to add product images.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/admin')}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
