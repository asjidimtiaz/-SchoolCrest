'use client'

import { format } from 'date-fns'
import { CalendarRange, Calendar as CalendarIcon } from 'lucide-react'
import { useBranding } from '@/context/BrandingContext'
import BrandingBackground from '@/components/BrandingBackground'
import KioskHeader from '@/components/KioskHeader'
import BackButton from '@/components/BackButton'
import EventCard from '@/components/Calendar/EventCard'
import { SchoolEvent } from '@/lib/getEvents'
import { useState, useEffect } from 'react'
import { fetchGoogleEvents, GoogleCalendarEvent } from '@/lib/googleCalendar'
import GoogleCalendarCard from '@/components/Calendar/GoogleCalendarCard'

interface CalendarContentProps {
    school: any
    events: SchoolEvent[]
}

export default function CalendarContent({ school, events }: CalendarContentProps) {
    const branding = useBranding()
    const [googleEvents, setGoogleEvents] = useState<GoogleCalendarEvent[]>([])
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)

    useEffect(() => {
        if (school.calendar_url && school.google_api_key) {
            setIsLoadingGoogle(true)
            fetchGoogleEvents(school.calendar_url, school.google_api_key)
                .then(data => {
                    setGoogleEvents(data)
                    setIsLoadingGoogle(false)
                })
                .catch(() => setIsLoadingGoogle(false))
        }
    }, [school.calendar_url, school.google_api_key])

    // Helper to force Agenda/List view and clean styling
    const getEmbedUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            // Force Agenda View (List)
            urlObj.searchParams.set('mode', 'AGENDA');
            // Clean up UI
            urlObj.searchParams.set('showTitle', '0');
            urlObj.searchParams.set('showNav', '1');
            urlObj.searchParams.set('showDate', '1');
            urlObj.searchParams.set('showPrint', '0');
            urlObj.searchParams.set('showTabs', '0');
            urlObj.searchParams.set('showCalendars', '0');
            urlObj.searchParams.set('showTz', '0');
            return urlObj.toString();
        } catch (e) {
            return url;
        }
    }

    return (
        <main className="min-h-screen relative flex flex-col">
            <BrandingBackground />
            <KioskHeader pageTitle={branding.navCalendarLabel} />

            <div className="flex-1 max-w-7xl mx-auto px-10 w-full relative z-10 flex flex-col pt-8">
                {/* Content Container */}
                <div className="w-full max-w-7xl mx-auto pb-10 h-full flex flex-col">

                    {/* 1. Google Calendar Integration */}
                    {school.calendar_url && (
                        <div className="mb-16">
                            {/* Header for Google Calendar */}
                            <div className="flex items-center gap-6 mb-10 animate-fade-in">
                                <div className="px-8 py-3 rounded-full bg-white/10 border border-white/30 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                    <span className="text-sm font-black uppercase tracking-[0.25em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                        School Schedule
                                    </span>
                                </div>
                                <div className="h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent flex-1 shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
                            </div>

                            {school.google_api_key && (googleEvents.length > 0 || isLoadingGoogle) ? (
                                /* Native Cards View */
                                <div className="grid grid-cols-1 gap-6 pb-4">
                                    {isLoadingGoogle ? (
                                        /* Skeleton Loading State */
                                        Array(4).fill(0).map((_, i) => (
                                            <div key={i} className="h-48 bg-white/5 animate-pulse rounded-[2.5rem] border border-white/10" />
                                        ))
                                    ) : (
                                        googleEvents.map(event => (
                                            <GoogleCalendarCard
                                                key={event.id}
                                                event={event}
                                                primaryColor={branding.primaryColor}
                                            />
                                        ))
                                    )}
                                </div>
                            ) : (
                                /* Iframe Fallback (If no API key or fetch failed/empty) */
                                <div className="flex-none w-full h-[60vh] bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/40 ring-1 ring-white/60 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                                    <iframe
                                        src={getEmbedUrl(school.calendar_url)}
                                        style={{ border: 0 }}
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        className="w-full h-full relative z-10"
                                    ></iframe>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 2. Internal Events List */}
                    {events.length > 0 ? (
                        <div className="space-y-2">
                            {/* Values Header if both exist */}
                            {school.calendar_url && (
                                <div className="flex items-center gap-6 mb-10 mt-4 animate-fade-in">
                                    <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-white/80 w-32 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                    <div className="px-8 py-3 rounded-full bg-white/10 border border-white/30 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                        <span className="text-sm font-black uppercase tracking-[0.25em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                            Featured Events
                                        </span>
                                    </div>
                                    <div className="h-px bg-gradient-to-l from-transparent via-white/50 to-white/80 flex-1 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                                </div>
                            )}

                            {events.map((event, index) => {
                                const eventDate = new Date(event.start_time);
                                const prevEvent = events[index - 1];
                                const prevDate = prevEvent ? new Date(prevEvent.start_time) : null;

                                const isNewDay = !prevDate ||
                                    eventDate.getDate() !== prevDate.getDate() ||
                                    eventDate.getMonth() !== prevDate.getMonth();

                                return (
                                    <div key={event.id}>
                                        {/* structured Date Header */}
                                        {isNewDay && (
                                            <div className="sticky top-0 z-20 pt-8 pb-4 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-transparent backdrop-blur-md mb-2 -mx-4 px-4 flex items-end gap-4 border-b border-white/5">
                                                <span className="text-4xl font-black text-white leading-none tracking-tighter">
                                                    {eventDate.getDate()}
                                                </span>
                                                <div className="flex flex-col pb-1">
                                                    <span className="text-xs font-bold uppercase tracking-widest text-white/50 leading-none mb-1">
                                                        {format(eventDate, 'MMMM')}
                                                    </span>
                                                    <span className="text-sm font-black uppercase tracking-widest text-white leading-none">
                                                        {format(eventDate, 'EEEE')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <EventCard
                                            event={event}
                                            primaryColor={school.primary_color || '#000'}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : !school.calendar_url && (
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
    )
}
