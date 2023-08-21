import React from "react";
import moment from "moment";

interface TimeForHumanProps {
    date: string | number | Date;
    className: string | null | undefined
}

const TimeForHuman: React.FC<TimeForHumanProps> = ({ date, className }) => {
    const currentTime = moment();
    const parsedDate = moment(date);
    const timeDifference = currentTime.diff(parsedDate, "seconds");
    const duration = moment.duration(timeDifference, "seconds");

    let timeAgo = "";
    if (duration.years() > 0) {
        timeAgo = `${duration.years()} years ago`;
    } else if (duration.months() > 0) {
        timeAgo = `${duration.months()} months ago`;
    } else if (duration.days() > 0) {
        timeAgo = `${duration.days()} days ago`;
    } else if (duration.hours() > 0) {
        timeAgo = `${duration.hours()} hours ago`;
    } else if (duration.minutes() > 0) {
        timeAgo = `${duration.minutes()} minutes ago`;
    } else {
        timeAgo = `${duration.seconds()} seconds ago`;
    }

    return (
        <time
            className={className}
            dateTime={moment(date).toISOString()}
        >
            {timeAgo}
        </time>
    );
};

export default TimeForHuman;
