# Component Documentation

This document provides comprehensive documentation for all reusable UI components in Fritz's Forge e-commerce platform.

---

## Table of Contents

1. [Core UI Components](#core-ui-components)
2. [Product Components](#product-components)
3. [Cart Components](#cart-components)
4. [Admin Components](#admin-components)
5. [Layout Components](#layout-components)
6. [Analytics Components](#analytics-components)

---

## Core UI Components

### Button

**Location:** `src/components/ui/button.tsx`

A versatile button component with multiple variants and sizes.

**Props:**
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**Example:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Add to Cart
</Button>

<Button variant="outline" size="sm" onClick={handleClick}>
  Cancel
</Button>
```

**Variants:**
- `default` - Primary orange button
- `destructive` - Red button for delete actions
- `outline` - Bordered button with transparent background
- `secondary` - Gray button
- `ghost` - Minimal button with hover effect
- `link` - Text-only button styled as link

---

### Card

**Location:** `src/components/ui/card.tsx`

Container component for grouping related content.

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
```

**Sub-components:**
- `CardHeader` - Top section with title/description
- `CardTitle` - Main heading
- `CardDescription` - Subtitle or description
- `CardContent` - Main content area
- `CardFooter` - Bottom section for actions

**Example:**
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Product Details</CardTitle>
    <CardDescription>View product information</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Product content here...</p>
  </CardContent>
</Card>
```

---

### Badge

**Location:** `src/components/ui/badge.tsx`

Small status indicator or label.

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
}
```

**Example:**
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">In Stock</Badge>
<Badge variant="destructive">Out of Stock</Badge>
<Badge variant="secondary">Low Stock</Badge>
```

---

### Input

**Location:** `src/components/ui/input.tsx`

Text input field with consistent styling.

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // All standard input props supported
}
```

**Example:**
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
</div>
```

---

### Select

**Location:** `src/components/ui/select.tsx`

Dropdown selection component.

**Props:**
```typescript
interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}
```

**Example:**
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select value={category} onValueChange={setCategory}>
  <SelectTrigger>
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="knives">Knives</SelectItem>
    <SelectItem value="tools">Tools</SelectItem>
    <SelectItem value="jewelry">Jewelry</SelectItem>
  </SelectContent>
</Select>
```

---

### Tabs

**Location:** `src/components/ui/tabs.tsx`

Tabbed navigation component.

**Example:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="reviews">Reviews</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
  <TabsContent value="details">Details content</TabsContent>
  <TabsContent value="reviews">Reviews content</TabsContent>
</Tabs>
```

---

## Product Components

### ProductCard

**Location:** `src/components/products/ProductCard.tsx`

Display product in grid/list view.

**Props:**
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    stock: number;
    category: string;
  };
}
```

**Features:**
- Product image with hover zoom
- Price display
- Stock status badge
- Link to product detail page
- Add to cart button

**Example:**
```tsx
import { ProductCard } from '@/components/products/ProductCard';

<div className="grid grid-cols-4 gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

---

### ProductGallery

**Location:** `src/components/products/ProductGallery.tsx`

Image gallery with thumbnails and main image display.

**Props:**
```typescript
interface ProductGalleryProps {
  images: string[];
  productName: string;
}
```

**Features:**
- Main image display
- Thumbnail navigation
- Click to change main image
- Responsive layout

**Example:**
```tsx
import { ProductGallery } from '@/components/products/ProductGallery';

<ProductGallery 
  images={['/image1.jpg', '/image2.jpg', '/image3.jpg']} 
  productName="Hand-Forged Knife"
/>
```

---

### ProductRecommendations

**Location:** `src/components/products/product-recommendations.tsx`

Display personalized product recommendations.

**Props:**
```typescript
interface ProductRecommendationsProps {
  productId?: string;
  type?: 'collaborative' | 'category' | 'trending' | 'personalized';
  customerEmail?: string;
  limit?: number;
  title?: string;
}
```

**Features:**
- Multiple recommendation algorithms
- Loading states with skeletons
- Responsive grid layout
- Dynamic titles based on type

**Example:**
```tsx
import { ProductRecommendations } from '@/components/products/product-recommendations';

// Frequently bought together
<ProductRecommendations 
  productId="abc123" 
  type="collaborative" 
  limit={4} 
/>

// Personalized recommendations
<ProductRecommendations 
  customerEmail="user@example.com" 
  type="personalized" 
  limit={6}
  title="Recommended For You"
/>

// Trending products
<ProductRecommendations 
  type="trending" 
  limit={8} 
/>
```

---

### AddToCartButton

**Location:** `src/components/products/add-to-cart-button.tsx`

Button for adding products to cart with quantity selector.

**Props:**
```typescript
interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}
```

**Features:**
- Quantity selector
- Stock validation
- Loading states
- Success feedback

---

## Cart Components

### CartSheet

**Location:** `src/components/cart/CartSheet.tsx`

Slide-out cart drawer.

**Features:**
- Cart item list with thumbnails
- Quantity controls (+ / -)
- Remove item button
- Subtotal calculation
- Checkout button
- Empty cart state

**Example:**
```tsx
import { CartSheet } from '@/components/cart/CartSheet';

<CartSheet />
```

**Usage:**
The CartSheet is triggered by clicking the cart icon in the navbar. It uses Zustand for state management.

---

## Admin Components

### InventoryForecastWidget

**Location:** `src/components/admin/inventory-forecast-widget.tsx`

Display inventory forecasting data.

**Features:**
- Risk level indicators (critical, high, medium, low)
- Days until stockout
- Reorder recommendations
- Sales trends
- Summary statistics

**Example:**
```tsx
import { InventoryForecastWidget } from '@/components/admin/inventory-forecast-widget';

// In admin dashboard
<InventoryForecastWidget />
```

---

### AnalyticsCharts

**Location:** `src/components/admin/analytics-charts.tsx`

Time-series analytics with interactive charts.

**Props:**
- No props required (fetches data internally)

**Features:**
- Date range selector (7, 30, 90 days)
- Revenue area chart
- Orders bar chart
- Products sold line chart
- Summary metric cards
- Trend indicators

**Example:**
```tsx
import { AnalyticsCharts } from '@/components/admin/analytics-charts';

<AnalyticsCharts />
```

---

### CustomerAnalyticsView

**Location:** `src/components/admin/customer-analytics-view.tsx`

Detailed customer analytics dashboard.

**Props:**
```typescript
interface CustomerAnalyticsViewProps {
  customerEmail: string;
}
```

**Features:**
- RFM analysis (Recency, Frequency, Monetary)
- Customer segmentation (VIP, Loyal, At Risk, etc.)
- Lifetime value (CLV)
- Purchase history timeline
- Category preferences pie chart
- Order trends

**Example:**
```tsx
import { CustomerAnalyticsView } from '@/components/admin/customer-analytics-view';

<CustomerAnalyticsView customerEmail="user@example.com" />
```

---

## Layout Components

### Navbar

**Location:** `src/components/navbar.tsx`

Main navigation bar.

**Features:**
- Logo and site name
- Navigation links (Home, Shop, Custom Orders)
- Cart icon with item count
- Responsive mobile menu
- Sticky positioning

---

### Footer

**Location:** `src/components/footer.tsx`

Site footer with links and information.

**Features:**
- Social media links
- Quick links
- Contact information
- Copyright notice

---

## Analytics Components

### ProductAnalytics

**Location:** `src/components/analytics/product-analytics.tsx`

Track product page views.

**Props:**
```typescript
interface ProductAnalyticsProps {
  product: {
    id: string;
    name: string;
    category: string;
    price: number;
  };
}
```

**Usage:**
```tsx
import { ProductAnalytics } from '@/components/analytics/product-analytics';

<ProductAnalytics product={product} />
```

---

### GoogleAnalytics

**Location:** `src/components/analytics/google-analytics.tsx`

Google Analytics integration.

**Props:**
```typescript
interface GoogleAnalyticsProps {
  measurementId: string;
}
```

**Usage:**
```tsx
import { GoogleAnalytics } from '@/components/analytics/google-analytics';

<GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
```

---

## Styling Guidelines

### Tailwind Classes
All components use Tailwind CSS with the following conventions:

**Colors:**
- Primary: `orange-600` (#E65100)
- Hover: `orange-700`
- Light backgrounds: `orange-50`, `orange-100`

**Spacing:**
- Container padding: `px-4` or `container` class
- Section spacing: `space-y-6`, `space-y-8`
- Card padding: `p-4`, `p-6`

**Typography:**
- Headings: `font-heading` (Playfair Display)
- Body: `font-body` (Inter)
- Title sizes: `text-2xl`, `text-3xl`, `text-4xl`

**Responsive Breakpoints:**
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px

---

## Accessibility

All components follow accessibility best practices:

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states on interactive elements
- Alt text for images
- Proper heading hierarchy

---

## Performance Tips

1. **Use Next.js Image** - All product images use `next/image` for optimization
2. **Lazy loading** - Components load data on mount or interaction
3. **Memoization** - Use `React.memo()` for expensive components
4. **Code splitting** - Use dynamic imports for large components

**Example:**
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

---

## Testing Components

All components can be tested with Vitest and React Testing Library:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

See [cart.test.ts](../tests/cart.test.ts) for example tests.

---

## Contributing

When creating new components:

1. Place in appropriate directory (`ui/`, `products/`, `admin/`, etc.)
2. Use TypeScript with proper interfaces
3. Follow existing naming conventions
4. Add JSDoc comments for complex props
5. Include usage examples
6. Test with different data scenarios
7. Ensure responsive design
8. Check accessibility

---

## Support

For component-related questions or issues, please refer to the codebase or contact the development team.
