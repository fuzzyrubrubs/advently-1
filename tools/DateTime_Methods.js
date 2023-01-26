import moment from 'moment';

const invite_preview_format = (date) => moment.unix(date.seconds).format('D MMM');

const event_preview_array_format = (date) => moment(date).format('dddd, D MMMM');

const convert_time = (time) => moment(time, 'HH:mm').format('h:MM a');


const local_to_utc = (time) => moment.unix(time.seconds).utc();
const utc_to_local = (time) => moment.unix(time.seconds).local();
const readable = (time) => moment.unix(time.seconds);
const event_format = (date) => moment(date).format('D MMMM');
const time_since = (date) => moment.unix(date).fromNow();
const calculate_age = (date) => moment().diff(date, 'years');
const date_after = (date1, date2) => moment(date1).isSameOrAfter(date2);

const event_expired = (timestamp) => moment(timestamp.seconds).isSameOrBefore(moment().subtract(4, "hours").unix());
const event_banner_format = (date) => moment.unix(date.seconds).format('D-MMMM-dddd-H-mm').split("-");

const event_date_full = (date) => {
    if (date && date.seconds) return moment.unix(date.seconds).format('YYYY-MM-DD')
}

const day_month = (date) =>  moment.unix(date).format('D MMM');


const chat_date_format = (date) => moment(date).format('D MMMM');
const message_time = (timestamp) => moment.unix(timestamp).format('HH:mm');

const event_time = (date) => moment.unix(date.seconds).format('H:mm');



const populate_30_days = () => {
    const new_array = [];
    for(var i = 0; i < 30; i++){
        var next_day = moment().add(i, 'days');
        var day = next_day.format('dddd');
        var date = next_day.format('D');
        var month = next_day.format('MMMM');
        const full = next_day.format('YYYY-MM-DD');
        new_array.push({date: date, day: day, month: month, full: full, id: i});
    }
    return new_array;
}

const populate_90_days = () => {
    const new_array = [];
    for(var i = 0; i < 90; i++){
        var next_day = moment().add(i, 'days');
        var day = next_day.format('dddd');
        var date = next_day.format('D');
        var month = next_day.format('MMMM');
        const full = next_day.format('YYYY-MM-DD');
        new_array.push({date: date, day: day, month: month, full: full, id: i});
    }
    return new_array;
}

const now = moment();


export { 
    invite_preview_format, 
    event_preview_array_format,
    event_format, 
    event_banner_format, 
    time_since, 
    populate_30_days, 
    populate_90_days, 
    event_expired, 
    calculate_age,  
    date_after,
    utc_to_local, 
    local_to_utc,
    event_date_full,
    event_time,
    readable,
    message_time,
    chat_date_format,
    now,
    day_month,
    convert_time
}
