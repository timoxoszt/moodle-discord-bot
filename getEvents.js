import ICAL from 'ical.js';
import fetch from 'node-fetch';

class Calendar {
    /**
     * List containing all the parsed events
     * @type {Array}
     */
    #events = [];
    /**
     * Token to use to authenticate to moodle
     * @type {string}
     */
    #MOODLE_TOKEN = process.env.MOODLE_TOKEN;
    MOODLE_URL = process.env.MOODLE_URL;
    /**
     * Id of the Moodle account to use
     * @type {string}
     */
    #MOODLE_ID = process.env.MOODLE_ID;
    /**
     * Url for the calendar export on Moodle
     * @type {string}
     */
    #url = `${this.MOODLE_URL}calendar/export_execute.php?userid=${this.#MOODLE_ID}&authtoken=${this.#MOODLE_TOKEN}&preset_what=all&preset_time=recentupcoming`;

    constructor() {
    }

    /**
     * Get a list of all saved events, of length 1 at minimum
     * @returns {{inline: boolean, name: string, value: string}|*} list containing the events, formatted for use in a discord embed
     */
    get events() {
        return this.empty ? [{name: "Kết quả", value: "Không có deadline trong tuần này", inline: true}] : this.#events;
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
        let now = new Date();
        let then = new Date(now.getTime() + 604800000); // now + 1 week in millisec
        await this.fetch_events(this.#url, then);
    }

    /**
     * Fetch all the events for the next month
     * @returns {Promise<void>}
     */
    async fetch_month() {
        let now = new Date();
        let then = new Date(now.getTime() + 2419200000); // now + 4 weeks in millisec
        await this.fetch_events(this.#url, then);
    }

    /**
     * Fetch all the events from a given url and parse them into a discord embed usable format
     * @param url url from which to get the events
     * @param then timeframe within which the events have to be
     * @returns {Promise<void>} none
     */
    async fetch_events(url, then) {
        let response = await fetch(url);
        let data = await response.text();
        this.calendarData = ICAL.parse(data);
        this.calendar = new ICAL.Component(this.calendarData);

        this.#events = [];
        let eventsData = this.calendar.getAllSubcomponents("vevent");
        eventsData.forEach(eventData => {
            let event = new ICAL.Event(eventData);
            let d = new Date(event.endDate);
            let now = new Date();

            if (now < d && d < then) { // Filter out passed events and future events
                let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                let date = d.toLocaleDateString('vi-VN', options);
                let time = d.toLocaleTimeString('vi-VN').split(':');
                this.#events.push({
                    name: eventData.jCal["1"]["8"]["3"] === undefined ? "R1.0x - xx" : eventData.jCal["1"]["8"]["3"],
                    value: `*${event.summary}*\n**${date} ${time[0]}:${time[1]}**`,
                    inline: true
                });
            }
        });
    }
}

export default Calendar;
