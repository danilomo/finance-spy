import logging

from fastapi import APIRouter, Depends
from financespy import Transaction, Account
from financespy.models import TransactionModel
from financespy import parse_month
from datetime import date

from starlette.responses import Response
from starlette.status import HTTP_204_NO_CONTENT

from .dependencies import open_account, DateRange, date_range


router = APIRouter(prefix="/api/accounts/{account}/transactions")


@router.get("/", response_model=list[TransactionModel])
def list_transactions(
    account: Account = Depends(open_account), range: DateRange = Depends(date_range)
):
    return [
        trans.to_model_obj()
        for trans in account.transactions(
            date_from=range.date_from, date_to=range.date_to
        )
    ]


@router.get("/{year}/{month}", response_model=list[TransactionModel])
def month_all(year: int, month: str, account: Account = Depends(open_account)):
    return [
        trans.to_dict() for trans in account.month(year=year, month=month).records()
    ]


@router.get("/{year}/{month}/{details}", response_model=list[TransactionModel])
def month_details(
    year: int, month: str, details: str, account: Account = Depends(open_account)
):
    if details == "weeks":
        result = month_weeks(account, year, month)
    elif details == "days":
        result = month_days(account, year, month)
    else:
        result = month_day(account, year, month, int(details))

    return result


@router.post("/{year}/{month}/{day}")
def insert_record(
    transaction: TransactionModel,
    year: int,
    month: str,
    day: int,
    account: Account = Depends(open_account),
):
    id = account.insert_record(
        date(year=year, month=parse_month(month), day=day),
        Transaction.to_transaction(
            transaction,
            account.categories
        )
    )
    return {"id": id}


@router.put("/")
def edit_record(
    transaction: TransactionModel,
    id: str,
    account: Account = Depends(open_account),
):
    print(str(transaction))

    transaction.id = id
    account.update_record(
        Transaction.to_transaction(
            transaction,
            account.categories
        )
    )
    return Response(status_code=HTTP_204_NO_CONTENT)


@router.delete("/{id}")
def delete_record(
    id: str,
    account: Account = Depends(open_account),
):
    account.delete_record(id)
    return Response(status_code=HTTP_204_NO_CONTENT)


def month_weeks(backend, year, month):
    return [
        [trans.to_model_obj() for trans in week.records()]
        for week in backend.month(year=year, month=month).weeks()
    ]


def month_days(backend, year, month):
    return [
        [trans.to_model_obj() for trans in day.records()]
        for day in backend.month(year=year, month=month).days()
    ]


def month_day(backend, year, month, day):
    return [
        trans.to_model_obj()
        for trans in backend.month(year=year, month=month).day(day).records()
    ]
