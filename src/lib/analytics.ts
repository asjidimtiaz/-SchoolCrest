/**
 * Simple page view tracking for kiosk analytics
 * Logs interactions per school for monitoring and insights
 */

interface PageViewEvent {
  school_id: string
  page: string
  timestamp: Date
  session_id?: string
}

interface InteractionEvent {
  school_id: string
  action: string
  target: string
  timestamp: Date
}

class KioskAnalytics {
  private schoolId: string | null = null
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setSchool(schoolId: string) {
    this.schoolId = schoolId
  }

  /**
   * Track a page view
   */
  trackPageView(page: string) {
    if (!this.schoolId) return

    const event: PageViewEvent = {
      school_id: this.schoolId,
      page,
      timestamp: new Date(),
      session_id: this.sessionId,
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Page View:', event)
    }

    // In production, you could send to:
    // - Supabase table
    // - PostHog
    // - Mixpanel
    // - Google Analytics
    this.sendEvent('page_view', event)
  }

  /**
   * Track user interactions
   */
  trackInteraction(action: string, target: string) {
    if (!this.schoolId) return

    const event: InteractionEvent = {
      school_id: this.schoolId,
      action,
      target,
      timestamp: new Date(),
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Interaction:', event)
    }

    this.sendEvent('interaction', event)
  }

  /**
   * Track kiosk session start
   */
  trackSessionStart() {
    this.trackInteraction('session_start', 'kiosk')
  }

  /**
   * Track kiosk reset (inactivity timeout)
   */
  trackSessionReset() {
    this.trackInteraction('session_reset', 'inactivity')
  }

  /**
   * Send event to analytics backend
   */
  private async sendEvent(type: string, data: any) {
    // Implement your preferred analytics backend here
    // Example: Send to Supabase
    /*
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, ...data })
      })
    } catch (err) {
      console.error('[Analytics] Failed to send event:', err)
    }
    */
  }
}

// Singleton instance
export const analytics = new KioskAnalytics()

// React hook for easy usage
export function useAnalytics() {
  return analytics
}
