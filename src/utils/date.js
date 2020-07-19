import { isObject, isDefined } from "./validation"
import { DocumentProvider } from "mongoose";

export const mongoQueryDate = (dateQueryObj) => {
    try {
        let startAndEndDateObj = {};
        let mongoDateComparsionObj = {};

        if (isObject(dateQueryObj)) {
            for (const dateKey in dateQueryObj) {
                if (dateQueryObj.hasOwnProperty(dateKey)) {
                    const dateTimeObj = dateStringToArr(dateQueryObj[dateKey]);
                    switch (dateKey) {
                        case 'gte':
                        case 'gt':
                            mongoDateComparsionObj[`$${dateKey}`] = dateTimeObj.date;
                            startAndEndDateObj.startDate = dateTimeObj.date;
                            break;
                        case 'lte':
                        case 'lt':
                            const finalDate = new Date(dateTimeObj.date);
                            if (!dateTimeObj.date.getHours() && !dateTimeObj.date.getMinutes() && !dateTimeObj.date.getSeconds()) {
                                finalDate.setDate(dateTimeObj.date.getDate() + 1);
                            }
                            mongoDateComparsionObj[`$${dateKey}`] = finalDate;
                            startAndEndDateObj.endDate = finalDate;
                            break;
                    }
                }
            }
        } else {
            const dateTimeObj = dateStringToArr(dateQueryObj);
            startAndEndDateObj = {
                startDate: dateTimeObj.date,
                get endDate() {
                    const finalDate = new Date(this.startDate);
                    if (!this.startDate.getHours() && !this.startDate.getMinutes() && !this.startDate.getSeconds()) {
                        finalDate.setDate(this.startDate.getDate() + 1);
                    }
                    return finalDate;
                }
            };
            mongoDateComparsionObj['$gte'] = startAndEndDateObj.startDate;
            mongoDateComparsionObj['$lte'] = startAndEndDateObj.endDate;
        }

        return {
            startAndEndDateObj,
            mongoDateComparsionObj
        }
    } catch (err) {
        console.log(err);
    }
}



export const dateStringToArr = (dateStr) => {

    try {
        let dateObj = {};
        let timeObj = {
            hour: 0,
            minute: 0,
            second: 0
        };
        let timeArr = [];
        let dateArr = [];

        let dateAndTimeRegExpSeperator = new RegExp('\\s');
        let dateRegExpSeperator = new RegExp('/|-');
        let timeRegExpSeperator = new RegExp(':');

        const dateAndTimeArr = dateStr.split(dateAndTimeRegExpSeperator);

        if (!dateAndTimeArr.length) {
            return null;
        }

        dateAndTimeArr.forEach(dateTime => {
            if (dateTime.match(dateRegExpSeperator) || !dateTime.match(timeRegExpSeperator)) {
                dateArr = dateTime.split(dateRegExpSeperator);
                dateObj = {
                    year: dateArr[0],
                    month: dateArr[1] || 0,
                    day: dateArr[2] || 1,
                };
            }
            if (dateTime.match(timeRegExpSeperator)) {
                timeArr = dateTime.split(timeRegExpSeperator);

                timeObj = {
                    hour: isDefined(timeArr[0]) ? timeArr[0].padStart(2, 0) : 0,
                    minute: isDefined(timeArr[1]) ? timeArr[1].padStart(2, 0) : 0,
                    second: isDefined(timeArr[2]) ? timeArr[2].padStart(2, 0) : 0,
                    get time() {
                        if (this.second)
                            return `${Number(this.hour)}:${Number(this.minute)}:${Number(this.second)}`;
                    }
                }

            }
        });

        const dateTimeObj = { ...dateObj, ...timeObj };

        Object.defineProperty(dateTimeObj, 'date', {
            get: function () {
                return new Date(
                    Number(this.year),
                    Number(this.month) - 1,
                    Number(this.day),
                    Number(this.hour),
                    Number(this.minute),
                    Number(this.second)
                )
            }
        });
        return dateTimeObj;
    } catch (err) {
        throw err;
    }
}