from fastapi import APIRouter, Depends
from .dependencies import account_list, open_account
from financespy.account import Account

router = APIRouter(prefix="/api/accounts")


@router.get("/")
def list_accounts(accounts: list[str] = Depends(account_list)):
    return accounts


@router.get("/{account}/categories")
def categories(account: Account = Depends(open_account)):
    return account.categories.to_dict()
