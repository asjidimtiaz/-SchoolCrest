export interface GoogleCalendarEvent {
  id: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime?: string
    date?: string
  }
  end: {
    dateTime?: string
    date?: string
  }
}

export async function fetchGoogleEvents(calendarUrl: string, apiKey: string): Promise<GoogleCalendarEvent[]> {
  if (!calendarUrl || !apiKey) return []

  try {
    // 1. Extract Calendar ID from URL
    let calendarId = calendarUrl

    // If it's a full Google Calendar URL
    if (calendarUrl.includes('src=')) {
      try {
        const url = new URL(calendarUrl)
        const src = url.searchParams.get('src')
        if (src) calendarId = src
      } catch (e) {
        console.error('Failed to parse calendar URL:', e)
      }
    }

    // 2. Fetch from Google API
    const timeMin = new Date().toISOString()
    const maxResults = 25

    // API Endpoint: https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events
    const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`

    const response = await fetch(apiUrl, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Google Calendar API Error:', errorData)
      return []
    }

    const data = await response.json()
    return data.items || []

  } catch (error) {
    console.error('Error fetching Google Calendar events:', error)
    return []
  }
}
