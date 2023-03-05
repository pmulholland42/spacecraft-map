from datetime import datetime, timedelta
import re
from typing import Generator, Tuple


def parse_step(step: str) -> Tuple[int, str]:
    skip = int(re.findall(r"\d+", step)[0])
    interval = re.findall(r"[a-zA-Z]*$", step)[0]
    return (skip, interval)


def round_datetime_down(date: datetime, interval: str) -> datetime:
    delta_hours = date.hour
    delta_minutes = date.minute

    if interval == "h":
        delta_hours = 0
    elif interval == "min":
        delta_hours = 0
        delta_minutes = 0

    rounding_delta = timedelta(
        hours=delta_hours,
        minutes=delta_minutes,
        seconds=date.second,
        microseconds=date.microsecond,
    )

    return date - rounding_delta


def round_datetime_up(date: datetime, interval: str) -> datetime:
    date_rounded_down = round_datetime_down(date, interval)
    td = timedelta()
    if interval == "d":
        td = timedelta(days=1)
    elif interval == "h":
        td = timedelta(hours=1)
    elif interval == "min":
        td = timedelta(minutes=1)

    if date_rounded_down == date:
        return date
    else:
        return date_rounded_down + td


def generate_date_range(
    start_date: datetime, end_date: datetime, interval: str, skip: int
) -> Generator[datetime, None, None]:
    delta = end_date - start_date
    num_intervals = 0
    if interval == "d":
        num_intervals = delta.days
    elif interval == "h":
        num_intervals = (delta.days * 24) + (delta.seconds / 3600)
    elif interval == "min":
        num_intervals = (delta.days * 1440) + (delta.seconds / 60)

    for n in range(int(num_intervals) + 1):
        if n % skip != 0:
            continue
        td = timedelta(n)
        if interval == "d":
            td = timedelta(days=n)
        elif interval == "h":
            td = timedelta(hours=n)
        elif interval == "min":
            td = timedelta(minutes=n)

        yield start_date + td
