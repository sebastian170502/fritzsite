"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"

interface Product {
  id: string
  name: string
}

interface CustomOrderFormProps {
  products: Product[]
}

export function CustomOrderForm({ products }: CustomOrderFormProps) {
  const [scratchImages, setScratchImages] = useState<string[]>([])
  const [modifyImages, setModifyImages] = useState<string[]>([])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImages: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newImages = files.map(file => URL.createObjectURL(file))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number, images: string[], setImages: React.Dispatch<React.SetStateAction<string[]>>) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index]) // Cleanup memory
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">


        <Tabs defaultValue="scratch" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-secondary/30 rounded-full">
            <TabsTrigger 
                value="scratch" 
                className="rounded-full h-full text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
                Start from Scratch
            </TabsTrigger>
            <TabsTrigger 
                value="modify" 
                className="rounded-full h-full text-base data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
                Modify from Shop
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: IDEA FROM SCRATCH */}
          <TabsContent value="scratch">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle>Start Custom Order Request</CardTitle>
                <CardDescription>
                  Feel free to share any details or specific wishes regarding your product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* 1. SELECT MATERIAL */}
                <div className="space-y-2">
                  <Label htmlFor="material-new">Dominant Material</Label>
                   <Select>
                    <SelectTrigger id="material-new">
                      <SelectValue placeholder="Choose main material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carbon-steel">Carbon Steel</SelectItem>
                      <SelectItem value="stainless-steel">Stainless Steel</SelectItem>
                      <SelectItem value="wrought-iron">Wrought Iron</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. DIMENSIONS */}
                <div className="space-y-4">
                   <Label>Estimated Dimensions</Label>
                   
                   {/* Diagram Image Placeholder */}
                   <div className="relative w-full h-48 bg-secondary/20 rounded-lg overflow-hidden border border-border flex items-center justify-center">
                      <Image 
                        src="/dimensions-guide-pic.jpeg" 
                        alt="Dimensions Guide" 
                        fill
                        className="object-contain p-4"
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-muted-foreground text-sm bg-background/80 px-2 py-1 rounded hidden">
                          Image Placeholder
                        </span>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Blade Width: 1-7cm */}
                      <div className="space-y-2">
                        <Label htmlFor="blade-width" className="text-xs text-muted-foreground uppercase tracking-wide">Blade Width (cm)</Label>
                        <Select>
                          <SelectTrigger id="blade-width">
                            <SelectValue placeholder="Select width" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {Array.from({ length: 7 }, (_, i) => i + 1).map((num) => (
                              <SelectItem key={num} value={num.toString()}>{num} cm</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Blade Length: 5-30cm */}
                      <div className="space-y-2">
                        <Label htmlFor="blade-length" className="text-xs text-muted-foreground uppercase tracking-wide">Blade Length (cm)</Label>
                        <Select>
                          <SelectTrigger id="blade-length">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                             {Array.from({ length: 26 }, (_, i) => i + 5).map((num) => (
                              <SelectItem key={num} value={num.toString()}>{num} cm</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Handle Length: 10-50cm */}
                      <div className="space-y-2">
                        <Label htmlFor="handle-length" className="text-xs text-muted-foreground uppercase tracking-wide">Handle Length (cm)</Label>
                         <Select>
                          <SelectTrigger id="handle-length">
                            <SelectValue placeholder="Select length" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                             {Array.from({ length: 41 }, (_, i) => i + 10).map((num) => (
                              <SelectItem key={num} value={num.toString()}>{num} cm</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                   </div>
                </div>

                {/* 3. ACCURATE DESCRIPTION */}
                <div className="space-y-2">
                  <Label htmlFor="notes-new">Accurate Description with Tool/Product</Label>
                  <Textarea 
                    id="notes-new" 
                    placeholder="Describe exactly what you want (e.g. 'Hand-forged hammer with oak handle'). Include functionality and style details."
                    className="min-h-[120px]" 
                  />
                </div>

                {/* 4. UPLOAD PICTURES (LAST) */}
                <div className="space-y-2">
                  <Label htmlFor="file-new">Upload Pictures for Reference</Label>
                  <Input 
                    id="file-new" 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="cursor-pointer" 
                    onChange={(e) => handleImageChange(e, setScratchImages)}
                  />
                  
                  {/* Image Previews */}
                  {scratchImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {scratchImages.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-border group">
                          <Image
                            src={src}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, scratchImages, setScratchImages)}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full rounded-full text-lg">
                    Submit Order
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* TAB 2: MODIFY PRODUCT */}
          <TabsContent value="modify">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm mt-6">
              <CardHeader>
                <CardTitle>Modify Item from Shop</CardTitle>
                <CardDescription>
                  Choose a product from our catalog and personalize it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="product-select">Select Product</Label>
                  <Select>
                    <SelectTrigger id="product-select">
                      <SelectValue placeholder="Select a base product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.length > 0 ? (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))
                      ) : (
                         <SelectItem value="none" disabled>No products in catalog</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="dimensions-modify">Desired Dimensions</Label>
                   <Input id="dimensions-modify" placeholder="e.g.: Length, Width, Height" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material-modify">Preferred Material</Label>
                  <Select>
                    <SelectTrigger id="material-modify">
                      <SelectValue placeholder="Choose material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="carbon-steel">Carbon Steel</SelectItem>
                      <SelectItem value="stainless-steel">Stainless Steel</SelectItem>
                      <SelectItem value="wrought-iron">Wrought Iron</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-modify">Upload Sketch / Photo (Optional)</Label>
                  <Input 
                    id="file-modify" 
                    type="file" 
                    multiple
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => handleImageChange(e, setModifyImages)} 
                  />

                  {/* Image Previews */}
                  {modifyImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {modifyImages.map((src, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-border group">
                          <Image
                            src={src}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, modifyImages, setModifyImages)}
                            className="absolute top-1 right-1 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes-modify">Other Details</Label>
                  <Textarea 
                    id="notes-modify" 
                    placeholder="Describe any other modifications you want (color, finishes, etc.)"
                    className="min-h-[120px]" 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full rounded-full text-lg">
                    Submit Order
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
