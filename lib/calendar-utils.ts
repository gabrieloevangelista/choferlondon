/**
 * Utilitários para integração com calendários nativos
 */

export interface CalendarEvent {
  title: string
  startDate: Date
  endDate: Date
  description: string
  location: string
}

/**
 * Detecta o tipo de dispositivo/sistema operacional
 */
export function detectDevice() {
  if (typeof window === 'undefined') return 'unknown'
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  const platform = window.navigator.platform?.toLowerCase() || ''
  
  // iOS (iPhone/iPad)
  if (/iphone|ipad|ipod/.test(userAgent) || (platform === 'macintel' && 'ontouchend' in document)) {
    return 'ios'
  }
  
  // Android
  if (/android/.test(userAgent)) {
    return 'android'
  }
  
  // Windows
  if (/win/.test(platform) || /windows/.test(userAgent)) {
    return 'windows'
  }
  
  // macOS
  if (/mac/.test(platform) && !/iphone|ipad|ipod/.test(userAgent)) {
    return 'macos'
  }
  
  return 'unknown'
}

/**
 * Formata uma data para o formato de calendário (YYYYMMDDTHHMMSSZ)
 */
function formatCalendarDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/**
 * Gera URL para Google Calendar
 */
function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatCalendarDate(event.startDate)}/${formatCalendarDate(event.endDate)}`,
    details: event.description,
    location: event.location
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Gera URL para Outlook/Hotmail
 */
function generateOutlookUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: event.startDate.toISOString(),
    enddt: event.endDate.toISOString(),
    body: event.description,
    location: event.location
  })
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}

/**
 * Gera dados para calendário nativo do iOS (formato .ics)
 */
function generateICSData(event: CalendarEvent): string {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Chofer em Londres//Tour Booking//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatCalendarDate(event.startDate)}`,
    `DTEND:${formatCalendarDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `UID:${Date.now()}@choferemlondres.com`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
  
  return icsData
}

/**
 * Abre o calendário apropriado baseado no dispositivo detectado
 */
export function addToCalendar(event: CalendarEvent): void {
  const device = detectDevice()
  
  try {
    switch (device) {
      case 'ios':
        // Para iOS, tenta abrir o app nativo do calendário via .ics
        const icsData = generateICSData(event)
        const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        
        // Cria um link temporário para download
        const link = document.createElement('a')
        link.href = url
        link.download = `evento-${event.title.replace(/[^a-zA-Z0-9]/g, '-')}.ics`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        // Fallback para Google Calendar se o usuário preferir
        setTimeout(() => {
          if (confirm('Deseja abrir no Google Calendar como alternativa?')) {
            window.open(generateGoogleCalendarUrl(event), '_blank')
          }
        }, 1000)
        break
        
      case 'android':
        // Android: tenta Google Calendar primeiro, depois fallback
        const googleUrl = generateGoogleCalendarUrl(event)
        const androidWindow = window.open(googleUrl, '_blank')
        
        // Se não conseguir abrir, oferece alternativas
        if (!androidWindow) {
          alert('Por favor, permita pop-ups para adicionar o evento ao seu calendário.')
        }
        break
        
      case 'windows':
        // Windows: oferece opções entre Outlook e Google Calendar
        const choice = confirm('Deseja abrir no Outlook? (Cancelar para Google Calendar)')
        if (choice) {
          window.open(generateOutlookUrl(event), '_blank')
        } else {
          window.open(generateGoogleCalendarUrl(event), '_blank')
        }
        break
        
      case 'macos':
        // macOS: oferece download .ics para Calendar nativo ou Google Calendar
        const macChoice = confirm('Deseja baixar arquivo .ics para o Calendar do Mac? (Cancelar para Google Calendar)')
        if (macChoice) {
          const icsData = generateICSData(event)
          const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          
          const link = document.createElement('a')
          link.href = url
          link.download = `evento-${event.title.replace(/[^a-zA-Z0-9]/g, '-')}.ics`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        } else {
          window.open(generateGoogleCalendarUrl(event), '_blank')
        }
        break
        
      default:
        // Fallback: sempre Google Calendar
        window.open(generateGoogleCalendarUrl(event), '_blank')
        break
    }
  } catch (error) {
    console.error('Erro ao abrir calendário:', error)
    // Fallback final: Google Calendar
    window.open(generateGoogleCalendarUrl(event), '_blank')
  }
}

/**
 * Função simplificada que detecta automaticamente e abre o melhor calendário
 */
export function addTourToCalendar({
  tourName,
  tourDate,
  hotel,
  passengers,
  flight
}: {
  tourName: string
  tourDate: string
  hotel: string
  passengers: string
  flight?: string
}): void {
  const startDate = new Date(tourDate)
  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000) // 4 horas de duração
  
  const event: CalendarEvent = {
    title: tourName,
    startDate,
    endDate,
    description: `Tour em Londres\n\nDetalhes da reserva:\n- Passageiros: ${passengers}\n- Local de encontro: ${hotel}${flight ? `\n- Voo: ${flight}` : ''}\n\nReserva confirmada via Chofer em Londres\n\nEm caso de dúvidas, entre em contato conosco:\nWhatsApp: +44 20 1234 5678\nEmail: info@choferemlondres.com`,
    location: hotel
  }
  
  addToCalendar(event)
}