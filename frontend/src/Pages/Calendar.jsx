import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { Modal, Form, Input, Spin } from 'antd';
import { useLocation } from 'react-router-dom';
import './CSS/Calendar.css';
import { getApiUrl } from "../config";

const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

export const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const location = useLocation();
  const [scheduleId, setScheduleId] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'new_schedule') {
      new_schedule();
    }
    load_user_information();
    const scheduleId = localStorage.getItem('schedule-id');
    if (scheduleId) {
      setScheduleId(scheduleId);
    }
  }, [location.search]);

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

  const load_user_information = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setError("No token found. Please login first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/basic", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setUserData(data);

      if (data.events) {
        const scheduleId = localStorage.getItem('schedule-id');
        if (scheduleId && data.events[scheduleId]) {
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
      }

    } catch (err) {
      setError("Something went wrong");
      console.error("Fetch error:", err);
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    form.setFieldsValue({
      employee: event.employee,
      email: event.email,
      start: moment(event.start).format('YYYY-MM-DDTHH:mm'),
      end: moment(event.end).format('YYYY-MM-DDTHH:mm')
    });
    setVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (!scheduleId) {
        alert('No schedule-id found. Please generate one.');
        return;
      }
      const response = await fetch(getApiUrl(`api/schedule/${scheduleId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          availability: selectedTimeSlots,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit availability');
      }

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        alert('Availability submitted successfully!');
        setVisible(false);
        setSelectedTimeSlots([]);
      }
    } catch (error) {
      console.error('Error submitting availability:', error);
      setError('Failed to submit availability');
    }
  };

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    const updatedEvents = events.map(evt => (evt.id === event.id ? updatedEvent : evt));
    setEvents(updatedEvents);
  };

  const handleEventResize = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    const updatedEvents = events.map(evt => (evt.id === event.id ? updatedEvent : evt));
    setEvents(updatedEvents);
  };

  const getEmployeeColor = (employee) => {
    const colors = [
      '#8B5CF61A', '#FF7E67', '#48C9B0', '#F9C80E', '#A569BD', '#45B39D'
    ];
    const hash = [...employee].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const eventStyleGetter = (event) => {
    const color = getEmployeeColor(event.employee);
    return {
      style: {
        backgroundColor: `${color}20`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '0px',
        color: '#111',
        fontSize: '12px',
        padding: '4px',
        fontWeight: '400',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'all 0.2s ease-in-out',
      }
    };
  };

  const saveToDB = async () => {
    const scheduleId = localStorage.getItem('schedule-id');
    if (!scheduleId) {
      alert('No schedule-id found in localStorage. Please generate one.');
      return;
    }

    const eventsBySchedule = {
      [scheduleId]: events.map(event => ({
        id: event.id,
        start: event.start.toISOString(),
        end: event.end.toISOString(),
        employee: event.employee,
        email: event.email,
      }))
    };

    const token = localStorage.getItem("auth-token");
    if (!token) {
      setError("No token found. Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/update_user", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updates: {
            _id: {"$oid": userData._id.$oid},
            events: eventsBySchedule
          }
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      alert("Data saved successfully!");

    } catch (err) {
      console.error("Failed to save data:", err);
      setError("Failed to save data. Please try again.");
    }
  };

  const new_schedule = async () => {
    const scheduleId = localStorage.getItem('schedule-id');
    if (!scheduleId) {
      alert('No schedule-id found in localStorage. Please generate one.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5001/api/view-calendar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          schedule_id: scheduleId,
        }),
      });
      const data = await res.json();

      if (data.error) {
        setEvents([]);
        setLoading(false);
        alert(data.error);
        return;
      }
      if (!Array.isArray(data.calendar_json)) {
        setEvents([]);
        setLoading(false);
        console.error('calendar_json is not an array:', data);
        return;
      }
      const formattedEvents = data.calendar_json.map(event => ({
        id: event.id,
        start: new Date(event.start),
        end: new Date(event.end),
        employee: event.employee,
        email: event.email,
      }));

      setEvents(formattedEvents);
      setUserData(prev => ({
        ...prev,
        events: {
          ...(prev?.events || {}),
          [scheduleId]: formattedEvents
        }
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{height: '750px', padding: '50px 120px', fontFamily: "'Montserrat', sans-serif"}}>
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        selectable
        resizable
        onSelectSlot={(slotInfo) => {
          setSelectedEvent(null);
          form.resetFields();
          form.setFieldsValue({
            start: moment(slotInfo.start).format('YYYY-MM-DDTHH:mm'),
            end: moment(slotInfo.end).format('YYYY-MM-DDTHH:mm'),
            employee: '',
            email: '',
          });
          setVisible(true);
        }}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        eventPropGetter={eventStyleGetter}
        defaultView="week"
        defaultDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
        components={{
          event: ({ event }) => (
            <div style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              paddingLeft: '4px',
              fontSize: '12px',
              overflowWrap: 'break-word'
            }}>
              {event.employee}
              <br/>
              {moment(event.start).format('HH:mm')}
              <br />
              -
              <br />
              {moment(event.end).format('HH:mm')}
            </div>
          )
        }}
      />

      <Modal
        title={selectedEvent ? "Edit Schedule" : "Add New Schedule"}
        open={visible}
        onOk={handleSubmit}
        onCancel={() => setVisible(false)}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="employee" label="Employee Name" rules={[{required: true}]}>
              <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{type: 'email', required: true}]}>
              <Input />
          </Form.Item>
          <Form.Item name="start" label="Start Time" rules={[{required: true}]}>
              <Input type="datetime-local" />
          </Form.Item>
          <Form.Item name="end" label="End Time" rules={[{required: true}]}>
              <Input type="datetime-local" />
          </Form.Item>
        </Form>
      </Modal>

      <div style={{padding: "20px", gap: "20px", display: "flex", justifyContent: "flex-end"}}>
        <button onClick={saveToDB} className="gradient-button"> Save </button>
      </div>
    </div>
  );
};

export default EventCalendar;
