
import { NextResponse } from "next/server"
import { createBooking } from '@/services/tour-service'

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()

    // Criar reserva usando o serviço
    const booking = await createBooking({
      tour_id: bookingData.tour_id,
      tour_name: bookingData.tour_name || 'Tour',
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email,
      customer_phone: bookingData.customer_phone,
      tour_date: bookingData.tour_date,
      passengers: bookingData.passengers,
      luggage: bookingData.luggage || 0,
      hotel: bookingData.hotel,
      flight_number: bookingData.flight_number,
      total_price: bookingData.total_price,
      status: bookingData.status || 'pending'
    })

    return NextResponse.json({ 
      success: true, 
      booking 
    })

  } catch (error) {
    console.error('Erro na API de reservas:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar reserva' },
      { status: 500 }
    )
  }
}
