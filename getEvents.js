import ICAL from 'ical.js';
import fetch from 'node-fetch';

class Calendar {
    #events;
    #MOODLE_ID = process.env.MOODLE_ID;
    #MOODLE_PASSWORD = process.env.MOODLE_PASSWORD;
    #MOODLE_TOKEN = process.env.MOODLE_TOKEN;
    #url = `https://moodle.univ-ubs.fr/calendar/export_execute.php?userid=102622&authtoken=${this.#MOODLE_TOKEN}&preset_what=all`;

    constructor() {
    }

    /**
     * Get a list of all saved events, of length 1 at minimum
     * @returns {{inline: boolean, name: string, value: string}|*} list containing the events, formatted for use in a discord embed
     */
    get events() {
        return this.empty ? [{name: "Rendu", value: "Pas de rendus pour cette semaine", inline: true}] : this.#events;
    }

    /**
     * Check if there are upcoming events saved
     * @returns {boolean} true if there are no events, false otherwise
     */
    get empty() {
        return this.#events.length === 0;
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

    /**
     * Fetch all the events for the next week
     * @returns {Promise<void>} none
     */
    async fetch_week() {
        let url = this.#url + "&preset_time=weeknow";
        await this.fetch_events(url);
    }

    /**
     * Fetch all the events for the next month
     * @returns {Promise<void>}
     */
    async fetch_month() {
        let url = this.#url + "&preset_time=monthnow";
        await this.fetch_events(url);
    }

    /**
     * Fetch all the events from a given url and parse them into a discord embed usable format
     * @param url url from which to get the events
     * @returns {Promise<void>} none
     */
    async fetch_events(url) {
        let response = await fetch(url);
        let data = await response.text();
        this.calendarData = ICAL.parse(data);
        this.calendar = new ICAL.Component(this.calendarData);

        this.#events = [];
        let eventsData = this.calendar.getAllSubcomponents("vevent");
        eventsData.forEach(eventData => {
            let event = new ICAL.Event(eventData);
            let days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
            let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
            let d = new Date(event.endDate);
            let date = `${days[d.getDay() -1]} ${d.getDate()} ${months[d.getMonth()]} ${d.getHours()}:${d.getMinutes()}`;
            this.#events.push({
                name: eventData.jCal["1"]["8"]["3"] === undefined ? "R1.0x - xx" : eventData.jCal["1"]["8"]["3"],
                value: `*${event.summary}*\n**${date}**`,
                inline: true
            });
        });
    }
}

export default Calendar;
