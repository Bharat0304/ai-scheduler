import React, { useState, useEffect } from 'react';
import { getApiUrl } from "../config";
import "./CSS/Calendar.css";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { useLocation } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

export const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const [scheduleId, setScheduleId] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  useEffect(() => {
    const fetchScheduleData = async () => {
      if (!scheduleId) return;
      try {
        const response = await fetch(getApiUrl(`api/schedule/${scheduleId}`));
        if (!response.ok) {
          throw new Error('Failed to fetch schedule data');
        }
        const data = await response.json();
        setScheduleData(data);
        if (data.events) {
          setEvents(
            data.events[scheduleId].map(event => ({
              id: event.id,
              start: new Date(event.start),
              end: new Date(event.end),
              employee: event.employee,
              email: event.email,
            }))
          );
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setError('Failed to load schedule data');
      }
    };

    if (scheduleId) {
      fetchScheduleData();
    }
  }, [scheduleId]);

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents(
      events.map(item => (item.id === event.id ? updatedEvent : item))
    );
  };

  const handleEventResize = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    setEvents(
      events.map(item => (item.id === event.id ? updatedEvent : item))
    );
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedEvent(null);
    setVisible(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setVisible(true);
  };

  return (
    <div className="calendar-container">
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        resizable
        style={{ height: 500 }}
      />
    </div>
  );
};
