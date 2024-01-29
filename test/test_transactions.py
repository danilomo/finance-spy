from fastapi import FastAPI
import pytest
import finance.spy.routers.dependencies
from financespy import Account, Transaction
from datetime import date
import json


@pytest.fixture
def patch_transaction(monkeypatch, random_account: Account):
    def open_account(account):
        return random_account

    monkeypatch.setattr(finance.spy.routers.dependencies, "open_account_", open_account)
    yield


@pytest.mark.parametrize(
    "date_range",
    [
        (date(2022, 1, 1), date(2022, 1, 1)),
        (date(2022, 1, 1), date(2023, 1, 1)),
        (date(2023, 1, 1), date(2022, 1, 1)),
        (date(2022, 1, 1), date(2023, 12, 31)),
        (date(1970, 1, 1), date(2025, 12, 31)),
        (date(2025, 12, 31), date(1970, 1, 1)),
    ],
)
def test_read_transactions(
    client, random_account: Account, patch_transaction, date_range
):
    date_from, date_to = date_range

    response = client.get(
        f"/api/accounts/myaccount/transactions?from={str(date_from)}&to={str(date_to)}"
    )

    transactions = [
        json.loads(trans.to_model_obj().model_dump_json())
        for trans in random_account.transactions(date_from=date_from, date_to=date_to)
    ]

    assert response.json() == transactions


def test_add_transaction(client, patch_transaction):
    year, month, day = 2024, "feb", 28

    response_post = client.post(
        f"/api/accounts/myaccount/transactions/{year}/{month}/{day}",
        content=json.dumps(
            {"value": "12345", "description": "Test", "categories": ["kaufhoff"]}
        ),
    )
    id = response_post.json()["id"]

    date_from, date_to = date(2024, 1, 1), date(2025, 12, 31)
    response_get = client.get(
        f"/api/accounts/myaccount/transactions?from={str(date_from)}&to={str(date_to)}"
    )

    assert response_get.json() == [
        {
            "id": id,
            "value": 12345,
            "date": "2024-02-28",
            "description": "",
            "categories": ["kaufhoff"],
        }
    ]


def test_edit_transaction(client, patch_transaction):
    year, month, day = 2024, "feb", 28

    response_post = client.post(
        f"/api/accounts/myaccount/transactions/{year}/{month}/{day}",
        content=json.dumps(
            {"value": "12345", "description": "Test", "categories": ["kaufhoff"]}
        ),
    )
    id = response_post.json()["id"]
    print(">>>", id)

    response_post = client.put(
        f"/api/accounts/myaccount/transactions?id={id}",
        content=json.dumps({"value": 54321}),
    )

    date_from, date_to = date(2024, 1, 1), date(2025, 12, 31)
    response_get = client.get(
        f"/api/accounts/myaccount/transactions?from={str(date_from)}&to={str(date_to)}"
    )

    assert response_get.json() == [
        {
            "id": id,
            "value": 54321,
            "date": "2024-02-28",
            "description": "",
            "categories": ["kaufhoff"],
        }
    ]


def test_delete_transaction(client, patch_transaction):
    year, month, day = 2024, "feb", 28

    response_post = client.post(
        f"/api/accounts/myaccount/transactions/{year}/{month}/{day}",
        content=json.dumps(
            {"value": "12345", "description": "Test", "categories": ["kaufhoff"]}
        ),
    )
    id = response_post.json()["id"]

    client.delete(f"/api/accounts/myaccount/transactions?id={id}")

    date_from, date_to = date(2024, 1, 1), date(2025, 12, 31)
    response_get = client.get(
        f"/api/accounts/myaccount/transactions?from={str(date_from)}&to={str(date_to)}"
    )

    assert response_get.json() == []
