import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/supabase-auth'
import { supabase } from '@/lib/supabase'

type BulkAction = 'activate' | 'deactivate' | 'feature' | 'unfeature' | 'promote' | 'unpromote' | 'delete'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { action, tourIds }: { action: BulkAction; tourIds: string[] } = await request.json()

    if (!action || !tourIds || !Array.isArray(tourIds) || tourIds.length === 0) {
      return NextResponse.json(
        { error: 'Ação e IDs dos tours são obrigatórios' },
        { status: 400 }
      )
    }

    const validActions: BulkAction[] = ['activate', 'deactivate', 'feature', 'unfeature', 'promote', 'unpromote', 'delete']
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: 'Ação inválida' },
        { status: 400 }
      )
    }

    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Definir dados de atualização baseado na ação
    switch (action) {
      case 'activate':
        updateData.is_active = true
        break
      case 'deactivate':
        updateData.is_active = false
        break
      case 'feature':
        updateData.is_featured = true
        break
      case 'unfeature':
        updateData.is_featured = false
        break
      case 'promote':
        updateData.is_promotion = true
        break
      case 'unpromote':
        updateData.is_promotion = false
        updateData.promotion_price = null
        break
      case 'delete':
        // Para exclusão, verificar se há reservas
        const { data: bookings } = await supabase
          .from('bookings')
          .select('id')
          .in('tour_id', tourIds)
          .limit(1)

        if (bookings && bookings.length > 0) {
          return NextResponse.json(
            { error: 'Não é possível excluir tours que possuem reservas' },
            { status: 400 }
          )
        }

        // Excluir tours
        const { error: deleteError } = await supabase
          .from('tours')
          .delete()
          .in('id', tourIds)

        if (deleteError) {
          console.error('Erro ao excluir tours:', deleteError)
          return NextResponse.json(
            { error: 'Erro ao excluir tours' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          message: `${tourIds.length} tour(s) excluído(s) com sucesso`,
          affected: tourIds.length
        })
    }

    // Para ações de atualização
    if (action !== 'delete') {
      const { data, error } = await supabase
        .from('tours')
        .update(updateData)
        .in('id', tourIds)
        .select('id')

      if (error) {
        console.error('Erro ao atualizar tours:', error)
        return NextResponse.json(
          { error: 'Erro ao atualizar tours' },
          { status: 500 }
        )
      }

      const actionMessages = {
        activate: 'ativado(s)',
        deactivate: 'desativado(s)',
        feature: 'destacado(s)',
        unfeature: 'removido(s) dos destaques',
        promote: 'promovido(s)',
        unpromote: 'removido(s) das promoções'
      }

      return NextResponse.json({
        message: `${data?.length || 0} tour(s) ${actionMessages[action]} com sucesso`,
        affected: data?.length || 0
      })
    }

  } catch (error) {
    console.error('Erro na ação em massa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}