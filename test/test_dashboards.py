import shutil
from fastapi import FastAPI
import pytest
import finance.spy.routers.dependencies
from financespy import Account
from datetime import date
import json
from financespy.dashboards import open_file


@pytest.fixture
def dashboards_folder(tmp_path, patch_transaction):
    dst_folder = tmp_path / "dashboards"
    shutil.copytree("./test/resources", dst_folder)
    yield dst_folder


@pytest.fixture
def patch_transaction(monkeypatch, random_account: Account):
    def open_account(account):
        return random_account

    monkeypatch.setattr(finance.spy.routers.dependencies, "open_account_", open_account)
    yield


@pytest.fixture
def patch_dashboards(dashboards_folder, monkeypatch):
    def open_dashboard(file):
        return open_file(dashboards_folder / "dashboard1.yaml")

    monkeypatch.setattr(
        finance.spy.routers.dependencies, "open_dashboard_file", open_dashboard
    )


def test_read_dashboard(client, patch_dashboards):
    date_from, date_to = date(1980, 1, 1), date(2035, 12, 31)

    dashboard_meta = client.get(f"/api/dashboards/test").json()

    dashboard_data = client.get(
        f"/api/dashboards/test/data?from={str(date_from)}&to={str(date_to)}&account=myaccount"
    ).json()

    for row in dashboard_meta["template"]:
        for chart in row["charts"]:
            chart_id = chart["id"]
            assert chart_id in dashboard_data
