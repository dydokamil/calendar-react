import axios from "axios";
import moment from "moment";

export const GET_MONTH_DETAILS = "get_month_details";
export const FETCH_EVENTS = "fetch_events";
export const ADD_EVENT = "add_event";
export const DELETE_EVENT = "delete_event";

const ROOT_URL = "https://calendar-django.herokuapp.com/calendar/rest";

export function getMonthDetails(year, month) {
  const firstDay = moment({ year, month });
  const lastDay = moment(firstDay).endOf("month");

  return {
    type: GET_MONTH_DETAILS,
    payload: {
      first: {
        weekday: firstDay.isoWeekday(),
        day: firstDay.date(),
        week: firstDay.isoWeek()
      },
      last: {
        weekday: lastDay.isoWeekday(),
        day: lastDay.date(),
        week: lastDay.isoWeek()
      },
      year,
      month,
      monthName: firstDay.format("MMMM")
    }
  };
}

export function addEvent(
  login, // login/password for brevity
  password,
  date,
  label,
  start = undefined,
  end = undefined
) {
  const request = axios.post(
    `${ROOT_URL}/calendar_entry/`,
    {
      label,
      start,
      end,
      date
    },
    {
      auth: {
        username: login,
        password: password
      }
    }
  );

  return {
    type: ADD_EVENT,
    payload: request
  };
}

export function fetchEvents(
  login,
  password,
  year = undefined,
  month = undefined,
  day = undefined
) {
  month = month ? month + 1 : month;
  const request = axios.get(`${ROOT_URL}/calendar_entry/`, {
    auth: {
      username: login,
      password: password
    },
    params: {
      year,
      month,
      day
    }
  });

  return {
    type: FETCH_EVENTS,
    payload: request
  };
}

export function deleteEvent(login, password, id) {
  const request = axios.delete(`${ROOT_URL}/calendar_entry/${id}`, {
    auth: { username: login, password: password }
  });
  return {
    type: DELETE_EVENT,
    payload: request,
    id
  };
}
