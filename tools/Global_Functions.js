import { event_date_full } from "./DateTime_Methods";

const capitalize_text = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowercase();

const filter_query_handler = (event) => {       
    const queryText = filtered_query.toLowerCase();
    const event_name = event.name.toLowerCase();
    const group_name = event.group_name.toLowerCase();
    return event_name.includes(queryText) || group_name.includes(queryText); 
}


const format_events = (array) => {
    if(array.length > 0) {
        array.sort((a, b) => {
            return a.start.seconds - b.start.seconds
        })
        const new_array = [];
        array.forEach(current => {
            var newArrayIndex;

            const new_date = !new_array.some((event, i) => {
                newArrayIndex = i;
                return event.date == event_date_full(current.start)
            });

            if( new_date ) { new_array.push({date: event_date_full(current.start), events: [current]}) } 
            else { new_array[newArrayIndex].events = [...new_array[newArrayIndex].events, current] }
        })
        return sort_by_date(new_array);
    } else {
        return array
    }
}

const format_messages = (array) => {
    if(array.length > 0) {

        const new_array = [];
        array.forEach(current => {
            var newArrayIndex;

            const new_date = !new_array.some((message, i) => {
                newArrayIndex = i;
                return message.date == event_date_full(current.created)
            });

            if( new_date ) { new_array.push({date: event_date_full(current.created), messages: [current]}) } 
            else { new_array[newArrayIndex].messages = [...new_array[newArrayIndex].messages, current] }
        })
        return new_array;
    } else {
        return array
    }
}

const sort_by_date = (events) => {
    return events.sort((a, b) => {
        var arrA = a.date.split("-")
        var arrB = b.date.split("-")
        if(arrA[0] > arrB[0]){return 1
        } else if (arrB[0] > arrA[0]){return -1
        } else if (arrA[1] > arrB[1]){return 1
        } else if (arrB[1] > arrA[1]){return -1
        } else if (arrA[2] > arrB[2]){return 1
        } else if (arrB[2] > arrA[2]){return -1
        } else {return 0}  
    })
};


const get_chat_id = (user_id, contact_id) => {
    const id = user_id + contact_id;
    var t = 0;
    for (let codePoint of id) { t = t + (codePoint.charCodeAt(0) * codePoint.charCodeAt(0)) };
    return t.toString();
}

const get_request_id = (user_id, ref_id) => {
    const r = user_id.split("").reverse().join("");
    const id = user_id + ref_id + r;
    var t = 0;
    for (let codePoint of id) { t = t + (codePoint.charCodeAt(0) * codePoint.charCodeAt(0)) };
    return t.toString();
}

const event_access = () => {

}


export { filter_query_handler, format_events, sort_by_date, capitalize_text, get_chat_id, get_request_id, format_messages }