'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Toggle } from '@/components/ui/toggle'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  MapPin, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Eye,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
  Download,
  Upload,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Power,
  PowerOff,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { AdminDashboardSkeleton } from '@/components/ui/admin-skeleton'
import Link from 'next/link'
import Image from 'next/image'

interface Tour {
  id: string
  name: string
  description: string
  short_description: string
  price: number
  duration: number
  category: string
  image_url: string | null
  is_featured: boolean
  is_promotion: boolean
  promotion_price: number | null
  is_active: boolean
  slug: string
  created_at: string
}

type SortField = 'name' | 'price' | 'duration' | 'category' | 'created_at'
type SortOrder = 'asc' | 'desc'

export default function AdminDashboard() {
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [selectedTours, setSelectedTours] = useState<Set<string>>(new Set())
  const [isProcessingBulk, setIsProcessingBulk] = useState(false)
  const [bulkPublishState, setBulkPublishState] = useState(true)
  const [stats, setStats] = useState({
    totalTours: 0,
    featuredTours: 0,
    promotionTours: 0,
    activeTours: 0
  })
  const router = useRouter()

  useEffect(() => {
    loadTours()
  }, [])

  // Efeito para filtrar e ordenar tours
  useEffect(() => {
    let filtered = tours.filter(tour => 
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredTours(filtered)
  }, [tours, searchTerm, sortField, sortOrder])

  const loadTours = async () => {
    try {
      const response = await fetch('/api/admin/tours')
      const data = await response.json()

      if (response.ok) {
        setTours(data.tours)
        setFilteredTours(data.tours)
        setStats({
          totalTours: data.tours.length,
          featuredTours: data.tours.filter((t: Tour) => t.is_featured).length,
          promotionTours: data.tours.filter((t: Tour) => t.is_promotion).length,
          activeTours: data.tours.filter((t: Tour) => t.is_active !== false).length
        })
      } else {
        if (response.status === 401) {
          // Limpar cookie e redirecionar
          document.cookie = 'admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          router.push('/admin/login')
          return
        }
        toast({
          title: 'Erro',
          description: data.error || 'Erro ao carregar tours',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Erro ao carregar tours:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  const handleDeleteTour = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o tour "${name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/tours/${id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: data.message
        })
        loadTours() // Recarregar lista
      } else {
        toast({
          title: 'Erro',
          description: data.error || 'Erro ao excluir tour',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Erro ao excluir tour:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean, name: string) => {
    const newStatus = !currentStatus
    const action = newStatus ? 'publish' : 'unpublish'
    const actionText = newStatus ? 'published' : 'unpublished'
    const statusText = newStatus ? 'publicado' : 'despublicado'
    
    try {
      // Show immediate feedback
      toast({
        title: `${newStatus ? '📤' : '📥'} ${newStatus ? 'Publicando' : 'Despublicando'} Tour...`,
        description: `Atualizando status de visibilidade de "${name}" no banco de dados`
      })

      const response = await fetch(`/api/admin/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: newStatus })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: `✅ Tour ${newStatus ? 'Publicado' : 'Despublicado'}!`,
          description: `"${name}" foi ${newStatus ? 'publicado' : 'despublicado'} com sucesso. ${newStatus ? 'Agora está visível no site.' : 'Agora está oculto do site.'}`,
          duration: 4000
        })
        loadTours() // Reload list to reflect changes immediately
      } else {
        toast({
          title: '❌ Falha na Atualização do Status',
          description: data.error || `Falha ao ${newStatus ? 'publicar' : 'despublicar'} o tour. Tente novamente.`,
          variant: 'destructive',
          duration: 5000
        })
      }
    } catch (error) {
      console.error('Error updating tour status:', error)
      toast({
        title: '🔌 Erro de Conexão',
        description: `Não foi possível ${newStatus ? 'publicar' : 'despublicar'} o tour. Verifique sua conexão com a internet e tente novamente.`,
        variant: 'destructive',
        duration: 5000
      })
    }
  }

  const handleToggleFeature = async (id: string, currentStatus: boolean, name: string) => {
    try {
      const response = await fetch(`/api/admin/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_featured: !currentStatus })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: `Tour "${name}" ${!currentStatus ? 'adicionado aos' : 'removido dos'} destaques`
        })
        loadTours() // Recarregar lista
      } else {
        toast({
          title: 'Erro',
          description: data.error || 'Erro ao alterar destaque do tour',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Erro ao alterar destaque:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
    }
  }

  const handleTogglePromotion = async (id: string, currentStatus: boolean, name: string) => {
    try {
      const response = await fetch(`/api/admin/tours/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_promotion: !currentStatus })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: `Tour "${name}" ${!currentStatus ? 'adicionado às' : 'removido das'} promoções`
        })
        loadTours() // Recarregar lista
      } else {
        toast({
          title: 'Erro',
          description: data.error || 'Erro ao alterar promoção do tour',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Erro ao alterar promoção:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
    }
  }

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      const response = await fetch(`/api/admin/tours/export?format=${format}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tours_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        
        toast({
          title: 'Sucesso',
          description: `Tours exportados em ${format.toUpperCase()}`
        })
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao exportar tours',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Erro na exportação:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
    }
  }

  const handleImport = async (file: File) => {
    setIsImporting(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/tours/import', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setImportResults(data)
        setShowImportModal(true)
        loadTours() // Recarregar lista
      } else {
        if (data.errors) {
          setImportResults(data)
          setShowImportModal(true)
        } else {
          toast({
            title: 'Erro',
            description: data.error || 'Erro ao importar tours',
            variant: 'destructive'
          })
        }
      }
    } catch (error) {
      console.error('Erro na importação:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />
    }
    return sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
  }

  // Funções de seleção em massa
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTours(new Set(filteredTours.map(tour => tour.id)))
    } else {
      setSelectedTours(new Set())
    }
  }

  const handleSelectTour = (tourId: string, checked: boolean) => {
    const newSelected = new Set(selectedTours)
    if (checked) {
      newSelected.add(tourId)
    } else {
      newSelected.delete(tourId)
    }
    setSelectedTours(newSelected)
  }

  const isAllSelected = filteredTours.length > 0 && selectedTours.size === filteredTours.length
  const isIndeterminate = selectedTours.size > 0 && selectedTours.size < filteredTours.length

  // Ações em massa
  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'promote' | 'unpromote' | 'delete') => {
    if (selectedTours.size === 0) {
      toast({
        title: 'Nenhum tour selecionado',
        description: 'Selecione pelo menos um tour para realizar a ação.',
        variant: 'destructive'
      })
      return
    }

    const selectedIds = Array.from(selectedTours)
    const actionText = {
      activate: 'publicar',
      deactivate: 'despublicar',
      feature: 'destacar',
      unfeature: 'remover destaque',
      promote: 'promover',
      unpromote: 'remover promoção',
      delete: 'excluir'
    }[action]

    const actionPastTense = {
      activate: 'publicados',
      deactivate: 'despublicados',
      feature: 'destacados',
      unfeature: 'removidos dos destaques',
      promote: 'promovidos',
      unpromote: 'removidos das promoções',
      delete: 'excluídos'
    }[action]

    if (action === 'delete') {
      if (!confirm(`Tem certeza que deseja excluir ${selectedIds.length} tour(s) selecionado(s)?`)) {
        return
      }
    }

    setIsProcessingBulk(true)

    try {
      const response = await fetch('/api/admin/tours/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action,
          tourIds: selectedIds
        })
      })

      const data = await response.json()

      if (response.ok) {
        const visibilityNote = action === 'activate' ? ' Tours agora estão visíveis no site.' : 
                              action === 'deactivate' ? ' Tours agora estão ocultos do site.' : ''
        toast({
          title: `✅ Ação em Massa Concluída!`,
          description: `${selectedIds.length} tour(s) ${actionPastTense} com sucesso.${visibilityNote}`,
          duration: 4000
        })
        setSelectedTours(new Set())
        loadTours() // Reload to reflect changes immediately
      } else {
        toast({
          title: 'Erro na ação em massa',
          description: data.error || 'Erro ao processar ação em massa',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Erro na ação em massa:', error)
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive'
      })
    } finally {
      setIsProcessingBulk(false)
    }
  }

  if (isLoading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">Chofer em Londres - Sistema Interno</p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Tours</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTours}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tours Publicados</CardTitle>
              <Power className="w-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeTours}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tours em Destaque</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.featuredTours}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tours em Promoção</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.promotionTours}</div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Gerenciar Tours</h2>
            <div className="flex flex-col sm:flex-row flex-wrap gap-2">
               <div className="flex flex-col xs:flex-row gap-2 flex-1">
                 <Button onClick={() => handleExport('csv')} variant="outline" size="sm" className="flex-1 xs:flex-none px-3 py-2">
                   <Download className="w-4 h-4 mr-2" />
                   Exportar CSV
                 </Button>
                 <label className="flex-1 xs:flex-none">
                   <Button variant="outline" size="sm" disabled={isImporting} asChild className="w-full px-3 py-2">
                     <span>
                       {isImporting ? (
                         <div className="flex items-center gap-2">
                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                           <span className="hidden xs:inline">Importando...</span>
                         </div>
                       ) : (
                         <>
                           <Upload className="w-4 h-4 mr-2" />
                           Importar
                         </>
                       )}
                     </span>
                   </Button>
                   <input
                     type="file"
                     accept=".csv,.xlsx,.xls"
                     onChange={(e) => {
                       const file = e.target.files?.[0]
                       if (file) {
                         handleImport(file)
                         e.target.value = ''
                       }
                     }}
                     className="hidden"
                     disabled={isImporting}
                   />
                 </label>
               </div>
               <Link href="/admin/tours/new" className="flex-1 sm:flex-none">
                 <Button className="w-full sm:w-auto px-3 py-2">
                   <Plus className="w-4 h-4 mr-2" />
                   Novo Tour
                 </Button>
               </Link>
             </div>
          </div>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar tours..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Barra de Ações em Massa */}
        {selectedTours.size > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedTours.size} tour(s) selecionado(s)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTours(new Set())}
                    className="text-blue-700 hover:text-blue-900 self-start xs:self-auto"
                  >
                    <X className="w-4 h-4 mr-1" />
                    <span className="hidden xs:inline">Limpar </span>Seleção
                  </Button>
                </div>
                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50">
                      <span className="text-xs font-medium text-gray-600">Publicação:</span>
                      <Toggle
                        checked={bulkPublishState}
                        onCheckedChange={(checked) => {
                          setBulkPublishState(checked)
                          handleBulkAction(checked ? 'activate' : 'deactivate')
                        }}
                        disabled={isProcessingBulk}
                        size="sm"
                      />
                      <span className={`text-xs font-medium ${bulkPublishState ? 'text-green-600' : 'text-red-600'}`}>
                        {bulkPublishState ? 'Ativar' : 'Desativar'}
                      </span>
                    </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    disabled={isProcessingBulk}
                    className="flex-1 xs:flex-none px-3 py-2"
                  >
                    {isProcessingBulk ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="hidden xs:inline">Processando...</span>
                      </div>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-1" />
                        Excluir
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tours List */}
        <div className="bg-white rounded-lg shadow">
          {filteredTours.length === 0 ? (
            <div className="p-8 text-center">
              {tours.length === 0 ? (
                <>
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum tour cadastrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Comece criando seu primeiro tour
                  </p>
                  <Link href="/admin/tours/new">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Tour
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum tour encontrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tente ajustar os termos de pesquisa
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        className={isIndeterminate ? 'data-[state=checked]:bg-blue-600' : ''}
                      />
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Tour
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center gap-1">
                        Preço
                        {getSortIcon('price')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('duration')}
                    >
                      <div className="flex items-center gap-1">
                        Duração
                        {getSortIcon('duration')}
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-1">
                        Categoria
                        {getSortIcon('category')}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTours.map((tour) => (
                    <tr key={tour.id} className={`hover:bg-gray-50 ${selectedTours.has(tour.id) ? 'bg-blue-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Checkbox
                          checked={selectedTours.has(tour.id)}
                          onCheckedChange={(checked) => handleSelectTour(tour.id, Boolean(checked))}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {tour.image_url ? (
                              <Image
                                src={tour.image_url}
                                alt={tour.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {tour.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {tour.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          £{tour.price}
                          {tour.is_promotion && tour.promotion_price && (
                            <span className="ml-2 text-xs text-green-600">
                              (Promoção: £{tour.promotion_price})
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tour.duration}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                          {tour.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <Toggle
                            checked={tour.is_active !== false}
                            onCheckedChange={(newChecked) => handleToggleStatus(tour.id, tour.is_active !== false, tour.name)}
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/tour/${tour.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/tours/${tour.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTour(tour.id, tour.name)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Modal de Resultados da Importação */}
        <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {importResults?.errors && importResults.errors.length > 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Erros na Importação
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Importação Concluída
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            
            {importResults && (
              <div className="space-y-4">
                {/* Erros de Validação */}
                {importResults.errors && importResults.errors.length > 0 && (
                  <div>
                    <h3 className="font-medium text-red-600 mb-2">Erros de Validação:</h3>
                    <div className="max-h-60 overflow-y-auto">
                      {importResults.errors.map((error: any, index: number) => (
                        <Alert key={index} variant="destructive" className="mb-2">
                          <AlertDescription>
                            <strong>Linha {error.row}, Campo "{error.field}":</strong> {error.message}
                            {error.value && <span className="block text-xs mt-1">Valor: "{error.value}"</span>}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Total de linhas com erro: {importResults.errors.length} de {importResults.totalRows || 0}
                    </p>
                  </div>
                )}
                
                {/* Resultados da Importação */}
                {importResults.results && (
                  <div>
                    <h3 className="font-medium text-green-600 mb-2">Resultados:</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 p-3 rounded">
                        <div className="text-2xl font-bold text-green-600">{importResults.results.success}</div>
                        <div className="text-sm text-green-700">Sucessos</div>
                      </div>
                      <div className="bg-red-50 p-3 rounded">
                        <div className="text-2xl font-bold text-red-600">{importResults.results.errors}</div>
                        <div className="text-sm text-red-700">Erros</div>
                      </div>
                    </div>
                    
                    {importResults.results.details && importResults.results.details.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Detalhes:</h4>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {importResults.results.details.map((detail: any, index: number) => (
                            <div key={index} className={`text-sm p-2 rounded ${
                              detail.action === 'created' ? 'bg-green-50 text-green-700' :
                              detail.action === 'updated' ? 'bg-blue-50 text-blue-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              <strong>Linha {detail.row}:</strong> {detail.name} - {
                                detail.action === 'created' ? 'Criado' :
                                detail.action === 'updated' ? 'Atualizado' :
                                `Erro: ${detail.error}`
                              }
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button onClick={() => setShowImportModal(false)}>
                    Fechar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}