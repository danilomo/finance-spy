from .csv import import_transactions as csv_import
from .models import ImportInput, ImportOutput
from financespy import Account, Transaction
from .models import ImportInput

__importers = {
    "csv": csv_import
}


def import_transactions(account: Account, importer_input: ImportInput):
    if importer_input.type_str not in __importers:
        return ImportOutput(
            success=False,
            message=f"Invalid import type {importer_input.type_str}"
        )

    transactions = __importers[importer_input.type_str](account, importer_input)
    output = list(transactions)

    if importer_input.dry_run:
        return ImportOutput(
            success=True,
            output=output
        )

    for transaction in transactions:
        account.insert_record(
            date_=transaction.date,
            transaction=Transaction.to_transaction(
                transaction,
                account.categories
            )
        )

    return ImportOutput(
        success=True
    )
