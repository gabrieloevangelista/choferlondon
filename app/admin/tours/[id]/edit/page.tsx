'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Upload, X, Image as ImageIcon, Save, Eye, AlertCircle, Edit } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { CategoryChips } from '@/components/ui/category-chips'
import Link from 'next/link'
import Image from 'next/image'

interface FormData {
  name: string
  description: string
  short_description: string
  price: string
  duration: string
  category: string
  image_url: string
  is_featured: boolean
  is_promotion: boolean
  promotion_price: string
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditTour({ params }: PageProps) {
  const { id } = use(params)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    short_description: '',
    price: '',
    duration: '',
    category: 'Tour',
    image_url: '',
    is_featured: false,
    is_promotion: false,
    promotion_price: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTour, setIsLoadingTour] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const router = useRouter()

  useEffect(() => {
    loadTour()
  }, [id])

  const loadTour = async () => {
    try {
      const response = await fetch(`/api/admin/tours/${id}`)
      const data = await response.json()

      if (response.ok) {
        const tour = data.tour
        setFormData({
          name: tour.name || '',
          description: tour.description || '',
          short_description: tour.short_description || '',
          price: tour.price?.toString() || '',
          duration: tour.duration?.toString() || '',
          category: tour.category || 'Tour',
          image_url: tour.image_url || '',
          is_featured: Boolean(tour.is_featured),
          is_promotion: Boolean(tour.is_promotion),
          promotion_price: tour.promotion_price?.toString() || ''
        })
      } else {
        if (response.status === 401) {
          router.push('/admin/login')
          return
        }
        toast({
          title: 'Erro',
          description: data.error || 'Erro ao carregar tour',
          variant: 'destructive'
        })
        router.push('/admin')
      }
    } catch (error) {
      console.error('Erro ao carregar tour:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
      router.push('/admin')
    } finally {
      setIsLoadingTour(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do tour é obrigatório'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Preço é obrigatório'
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Preço deve ser um número válido maior que zero'
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duração é obrigatória'
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) <= 0) {
      newErrors.duration = 'Duração deve ser um número válido maior que zero'
    }

    if (formData.is_promotion && formData.promotion_price.trim()) {
      if (isNaN(Number(formData.promotion_price)) || Number(formData.promotion_price) <= 0) {
        newErrors.promotion_price = 'Preço promocional deve ser um número válido maior que zero'
      } else if (Number(formData.promotion_price) >= Number(formData.price)) {
        newErrors.promotion_price = 'Preço promocional deve ser menor que o preço normal'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // Toast de início do upload
    toast({
      title: '📤 Enviando Imagem...',
      description: `Fazendo upload de "${file.name}" (${(file.size / 1024 / 1024).toFixed(1)}MB)`
    })
    
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({ ...prev, image_url: data.url }))
        toast({
          title: '🖼️ Image Updated Successfully!',
          description: `"${file.name}" has been uploaded. Remember to save the tour to apply changes to the website.`,
          duration: 4000
        })
      } else {
        toast({
          title: '❌ Erro no Upload',
          description: data.error || 'Não foi possível enviar a imagem. Tente novamente.',
          variant: 'destructive',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: '🔌 Erro de Conexão',
        description: 'Verifique sua conexão e tente enviar a imagem novamente.',
        variant: 'destructive',
        duration: 5000
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Toast de início do processo
    toast({
      title: 'Salvando...',
      description: 'Atualizando informações do tour no sistema'
    })

    try {
      const response = await fetch(`/api/admin/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: '✅ Your tour has been updated successfully',
          description: `"${formData.name}" has been updated in the database and changes are now live on the website.`,
          duration: 4000
        })
        
        // Aguardar um pouco para o usuário ver a mensagem
        setTimeout(() => {
          router.push('/admin')
        }, 1500)
      } else {
        toast({
          title: '❌ Erro ao Salvar',
          description: data.error || 'Não foi possível atualizar o tour. Tente novamente.',
          variant: 'destructive',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Erro ao atualizar tour:', error)
      toast({
        title: '🔌 Erro de Conexão',
        description: 'Verifique sua conexão com a internet e tente novamente.',
        variant: 'destructive',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingTour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Dashboard
              </Button>
            </Link>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Edit className="w-8 h-8" />
              Editar Tour
            </h1>
            <p className="text-muted-foreground text-lg">
              Atualize as informações do tour selecionado.
            </p>
          </div>
          <Separator className="mt-6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Informações Básicas
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Dados principais que serão exibidos aos visitantes
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nome do Tour <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Tour pelo Centro de Londres"
                      className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                    {errors.name && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name}
                      </div>
                    )}
                  </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label>Categoria</Label>
                <CategoryChips
                  value={formData.category}
                  onChange={(value) => handleInputChange('category', value)}
                  placeholder="Digite uma categoria..."
                />
              </div>

              {/* Descrição Curta */}
              <div className="space-y-2">
                <Label htmlFor="short_description">Descrição Curta</Label>
                <Textarea
                  id="short_description"
                  value={formData.short_description}
                  onChange={(e) => handleInputChange('short_description', e.target.value)}
                  placeholder="Breve descrição do tour"
                  rows={2}
                />
              </div>

              {/* Descrição Completa */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição Completa *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Descrição detalhada do tour, incluindo itinerário, pontos turísticos, etc."
                  rows={6}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Preço e Duração */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (£) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Ex: 150.00"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (horas) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    placeholder="Ex: 8"
                    className={errors.duration ? 'border-red-500' : ''}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-600">{errors.duration}</p>
                  )}
                </div>
              </div>

              {/* Upload de Imagem */}
              <div className="space-y-2">
                <Label>Imagem de Destaque</Label>
                {formData.image_url ? (
                  <div className="relative">
                    <Image
                      src={formData.image_url}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Button type="button" disabled={isUploading} asChild>
                            <span>
                              {isUploading ? (
                                <div className="flex items-center gap-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  Enviando...
                                </div>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Escolher Imagem
                                </>
                              )}
                            </span>
                          </Button>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, WebP até 5MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Opções */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', Boolean(checked))}
                  />
                  <Label htmlFor="is_featured">Tour em destaque</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_promotion"
                    checked={formData.is_promotion}
                    onCheckedChange={(checked) => handleInputChange('is_promotion', Boolean(checked))}
                  />
                  <Label htmlFor="is_promotion">Tour em promoção</Label>
                </div>

                {formData.is_promotion && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="promotion_price">Preço Promocional (£)</Label>
                    <Input
                      id="promotion_price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.promotion_price}
                      onChange={(e) => handleInputChange('promotion_price', e.target.value)}
                      placeholder="Ex: 120.00"
                      className={errors.promotion_price ? 'border-red-500' : ''}
                    />
                    {errors.promotion_price && (
                      <p className="text-sm text-red-600">{errors.promotion_price}</p>
                    )}
                  </div>
                )}
              </div>

                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Configurações */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Opções de visibilidade e promoção
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_featured" className="text-sm font-medium">Tour em Destaque</Label>
                      <p className="text-xs text-muted-foreground">Aparecerá na seção de destaques</p>
                    </div>
                    <Checkbox
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange('is_featured', Boolean(checked))}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="is_promotion" className="text-sm font-medium">Tour em Promoção</Label>
                      <p className="text-xs text-muted-foreground">Ativar preço promocional</p>
                    </div>
                    <Checkbox
                      id="is_promotion"
                      checked={formData.is_promotion}
                      onCheckedChange={(checked) => handleInputChange('is_promotion', Boolean(checked))}
                    />
                  </div>

                  {formData.is_promotion && (
                    <div className="space-y-2 pt-2">
                      <Label htmlFor="promotion_price" className="text-sm font-medium">Preço Promocional (£)</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                        <Input
                          id="promotion_price"
                          type="number"
                          step="0.01"
                          value={formData.promotion_price}
                          onChange={(e) => handleInputChange('promotion_price', e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Como aparecerá no site
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    {formData.image_url ? (
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        width={200}
                        height={120}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Sem imagem</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{formData.name || 'Nome do Tour'}</h4>
                    <div className="flex items-center gap-2">
                      {formData.price && (
                        <Badge variant="secondary">£{formData.price}</Badge>
                      )}
                      {formData.duration && (
                        <Badge variant="outline">{formData.duration}h</Badge>
                      )}
                    </div>
                    {formData.is_featured && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Destaque</Badge>
                    )}
                    {formData.is_promotion && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Promoção</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isLoading} 
                    className="w-full"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Salvando no Sistema...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                      </div>
                    )}
                  </Button>
                  <Link href="/admin" className="block">
                    <Button type="button" variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}