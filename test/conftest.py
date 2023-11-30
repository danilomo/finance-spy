import pytest
from fastapi.testclient import TestClient
from finance.spy import app
from financespy import Transaction
from financespy import Money
from financespy import categories as cats
from financespy.account import memory_account
import pytest
import random
from datetime import date



@pytest.fixture
def category_list():
    return [
        {
            "expenses": [
                {"others": ["uncategorized", "withdrawal", "misc"]},
                {"church": ["tithes", "offering"]},
                {
                    "food": [
                        {
                            "groceries": [
                                "lidl",
                                "aldi",
                                "edeka",
                                "asia_market",
                                "alnatura",
                                "rewe",
                                "netto",
                                "penny",
                                "rossmann",
                                "yaz",
                                "nahkauf",
                                "bakery",
                                "backery",
                                "asia",
                            ]
                        },
                        "restaurant",
                        "street_food",
                        "kfc",
                        "hamburguer",
                        "icecream",
                        "mc",
                        "sushi",
                        "bk",
                    ]
                },
                {"utilities": ["internet", "electricity", "cellphone_balance"]},
                {"travel": ["plane_ticket", "hotel_reservation", "train_ticket"]},
                {"tax": ["tv_tax"]},
                {
                    "shopping": [
                        "saturn",
                        "electronics",
                        "clothing",
                        "sports",
                        "tkmax",
                        "h_m",
                        "kaufhoff",
                        "furniture",
                        "shopping_misc",
                        "shoes",
                        "tedi",
                        "purses",
                        "jewlery",
                        "home_goods",
                        "action",
                        "real",
                        "clothes",
                        "moemax",
                    ]
                },
                {
                    "education": [
                        {"course_fee": ["german_course", "inlingua", "vhs"]},
                        "textbook",
                        "school_supplies",
                        "magazine",
                        "book",
                    ]
                },
                {
                    "body_and_hygiene": [
                        "dm",
                        "perfume",
                        "hair_product",
                        "apotheke",
                        "mueller",
                        "douglas",
                        "hairdresser",
                        "nails",
                        "müller",
                    ]
                },
                {
                    "commuting": [
                        "monthly_ticket",
                        "day_ticket",
                        "single_ticket",
                        "bus_ticket",
                    ]
                },
            ]
        }
    ]


@pytest.fixture
def categories(category_list):
    return cats.categories_from_list(category_list)


@pytest.fixture
def random_account(categories):
    """Creates a random in-memory account for testing purposes"""

    account = memory_account(categories)

    years = [2020, 2021, 2022]
    months = list(range(1, 13))
    days = list(range(1, 29))

    categories = account.backend.categories
    cat_list = categories.all

    for year in years:
        for month in months:
            selected_days = sorted(random.sample(days, 15))

            for day in selected_days:
                dt = date(year=year, month=month, day=day)

                value = random.randint(500, 15000)
                random_category = categories.category(random.choice(cat_list))
                record = Transaction(
                    value=Money(cents=value),
                    categories=[random_category],
                    description="",
                )

                account.insert_record(dt, record)

    return account


@pytest.fixture(scope="module")
def client():
    client = TestClient(app)
    yield client


@pytest.fixture
def account():
    pass
