import ICAL from 'ical.js';
import fetch from 'node-fetch';

class Calendar {
    constructor() {
        this.url = `https://moodle.univ-ubs.fr/calendar/export_execute.php?userid=102622&authtoken=c828b9bdec801049ec6887ec17f81db25c69695e&preset_what=all&preset_time=monthnow`;
        this.empty = true;
    }

    /**
     * Get the current week number
     * @returns {number} Number of the current week
     */
    week_number() {
        let today = new Date();
        let oneJan =  new Date(today.getFullYear(), 0, 1);
        let numberOfDays =  Math.floor((today - oneJan) / (24 * 60 * 60 * 1000));
        return  Math.ceil(( today.getDay() + 1 + numberOfDays) / 7);
    }

    async fetch_week() {
        let response = await fetch(this.url);
        let data = await response.text();
        this.calendarData = ICAL.parse(data);
        this.calendar = new ICAL.Component(this.calendarData);

        this.events = [];
        let eventsData = this.calendar.getAllSubcomponents("vevent");
        eventsData.forEach(eventData => {
            let event = new ICAL.Event(eventData);
            this.events.push({
                name: eventData.jCal["1"]["8"]["3"] === undefined ? "R1.0x - xx" : eventData.jCal["1"]["8"]["3"],
                value: event.summary,
                inline: true
            });
        });
        this.empty = this.events.length === 0;
    }

    week_events() {
        return this.calendar;
    }
}

export default Calendar;
