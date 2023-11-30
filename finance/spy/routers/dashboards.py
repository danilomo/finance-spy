from fastapi import APIRouter, Depends, Request
from .dependencies import (
    dashboard_list,
    open_dashboard,
    open_account,
    DateRange,
    date_range,
)
from financespy.account import Account
from financespy.dashboards.dashboard import Dashboard

router = APIRouter(prefix="/api/dashboards")


@router.get("/")
def all_dashboards(dashboards: list = Depends(dashboard_list)):
    return dashboards


@router.get("/{dashboard}")
def dashboard_layout(dashboard: Dashboard = Depends(open_dashboard)) -> Dashboard:
    return dashboard


@router.get(
    "/{dashboard}/data",
)
def dashboard_data(
    request: Request,
    dashboard: Dashboard = Depends(open_dashboard),
    account: Account = Depends(open_account),
    dt_range: DateRange = Depends(date_range),
):
    params = {
        key: value
        for key, value in request.query_params.items()
        if key not in ["from", "to", "account"]
    }

    transactions = list(account.transactions(dt_range.date_from, dt_range.date_to))
    chart_data = dashboard.chart_data(transactions, account, params)
    result = {}

    for chart in chart_data:
        result[chart["id"]] = chart["data"]

    return result
