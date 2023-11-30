from fastapi import Query
from financespy.account import memory_account
from financespy.account import open_account as open_account_
from financespy.dashboards import open_file as open_dashboard_file
import os
from dataclasses import dataclass
from datetime import datetime, date, timedelta


@dataclass
class DateRange:
    date_from: datetime
    date_to: datetime


def date_range(_from: str = Query(alias="from"), to: str = Query()):
    date_from = to_date(_from) or today(minus=7)
    date_to = to_date(to) or today()

    return DateRange(date_from=date_from, date_to=date_to)


def to_date(string):
    if not string:
        return None

    return datetime.strptime(string, "%Y-%m-%d").date()


def today(minus=0):
    result = date.today()
    result = result - timedelta(days=minus)
    return result


def open_account(account: str):
    try:
        account = open_account_("/home/danilo/Documents/Finances/accounts/" + account)
        yield account
    except:
        yield memory_account(None)
    finally:
        account.backend.__exit__(None, None, None)


def open_dashboard(dashboard: str):
    return open_dashboard_file(
        "/home/danilo/Documents/Finances/dashboards/" + dashboard + ".yaml"
    )


def list_directory(directory):
    return os.listdir(directory)


def dashboard_list():
    return [
        folder.replace(".yaml", "")
        for folder in list_directory("/home/danilo/Documents/Finances/dashboards")
    ]


def account_list():
    return list_directory("/home/danilo/Documents/Finances/accounts")
