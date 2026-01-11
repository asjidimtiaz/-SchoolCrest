import { getSchool } from '@/lib/getSchool'
import { getEvents, SchoolEvent } from '@/lib/getEvents'
import BackButton from '@/components/BackButton'
import EventCard from '@/components/Calendar/EventCard'
import { CalendarRange, Calendar } from 'lucide-react'
import { format } from 'date-fns'

import BrandingProviderWrapper from '@/components/BrandingProviderWrapper'
import BrandingBackground from '@/components/BrandingBackground'

export default async function CalendarPage() {
  const school = await getSchool()
  
  if (!school) return null

  const events = await getEvents(school.id)

  const branding = {
    name: school.name,
    logoUrl: school.logo_url,
    tagline: school.tagline,
    primaryColor: school.primary_color || '#000000',
    secondaryColor: school.secondary_color || '#ffffff',
    accentColor: school.accent_color || '#3b82f6',
    backgroundUrl: school.background_url,
    backgroundType: school.background_type as 'image' | 'video'
  }

  return (
    <BrandingProviderWrapper branding={branding}>
       <InternalCalendarPage school={school} events={events} branding={branding} />
    </BrandingProviderWrapper>
  );
}

import KioskHeader from '@/components/KioskHeader'

function InternalCalendarPage({ school, events, branding }: { school: any, events: SchoolEvent[], branding: any }) {
  // Group events by Month Year (e.g., "January 2024")
  const groupedEvents: Record<string, SchoolEvent[]> = {};
  
  events.forEach(event => {
    const date = new Date(event.start_time);
    const key = format(date, 'MMMM yyyy');
    if (!groupedEvents[key]) {
        groupedEvents[key] = [];
    }
    groupedEvents[key].push(event);
  });

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
        <BrandingBackground />
        <KioskHeader pageTitle="Events Calendar" />

        <div className="flex-1 max-w-7xl mx-auto px-10 w-full relative z-10 flex flex-col pt-8 overflow-y-auto custom-scrollbar">
            {/* Content Container */}
            <div className="w-full max-w-4xl mx-auto pb-32">
                
                {Object.keys(groupedEvents).length > 0 ? (
                    <div className="space-y-12">
                        {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                            <section key={month}>
                                {/* Sticky Month Header */}
                                <div className="sticky top-0 z-20 py-4 mb-6 backdrop-blur-md bg-white/50 rounded-2xl border border-white/20 shadow-sm flex items-center justify-center">
                                     <div className="flex items-center gap-3">
                                        <Calendar className="text-slate-500" />
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">
                                            {month}
                                        </h2>
                                     </div>
                                </div>
                                
                                <div className="space-y-4">
                                    {monthEvents.map((event) => (
                                        <EventCard 
                                            key={event.id} 
                                            event={event} 
                                            primaryColor={school.primary_color || '#000'}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 animate-fade-in glass-card border-none rounded-[3rem] bg-white/10 backdrop-blur-md">
                        <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center text-white/40 mb-6">
                            <CalendarRange size={48} strokeWidth={1} />
                        </div>
                        <p className="text-xl font-black text-white/60 uppercase tracking-widest">No upcoming events</p>
                    </div>
                )}
            </div>
        </div>

        {/* Centered Bottom Back Button */}
        <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="pointer-events-auto active:scale-95 transition-all duration-200">
                <BackButton label="Back to Menu" className="px-10 py-3.5 text-sm font-black shadow-[0_15px_30px_rgba(0,0,0,0.12)] bg-white text-slate-900 border border-gray-100 rounded-full" />
            </div>
        </div>
    </main>
  );
}
