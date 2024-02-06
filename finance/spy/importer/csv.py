from financespy import Account, Money
from financespy.transaction import TransactionModel
from .models import ImportInput, ImportOutput
from pydantic import BaseModel, Field
from typing import Tuple
import pandas as pd
import io


class ColumnMapping(BaseModel):
    date: str = ""
    description: str = ""
    value: str = ""


class CategoryRule(BaseModel):
    field: str = ""
    value: str = ""
    category: str = ""
    operator: str = "contains"

    def __iter__(self):
        yield self.field
        yield self.operator
        yield self.value

    def process_row(self, row) -> str | None:
        match self.operator:
            case "matches":
                return self._matches(row)
            case "contains":
                return self._contains(row)
            case "matches_cs":
                return self._matches(row, case_sensitive=True)
            case "contains_cs":
                return self._contains(row, case_sensitive=True)
            case _:
                return None

    def _matches(self, row, case_sensitive=False):
        pass

    def _contains(self, row, case_sensitive=False):
        row_value = row[self.field]
        target_value = self.value

        if not case_sensitive:
            row_value = row_value.lower()
            target_value = target_value.lower()

        if row_value.find(target_value) >= 0:
            return self.category


class CsvImportParameters(BaseModel):
    column_mapping: ColumnMapping = Field(default_factory=ColumnMapping)
    category_rules: list[CategoryRule | Tuple[str, str, str]] = Field(default_factory=CategoryRule)
    importer_profile: str = ""
    date_format: str = "%Y-%m-%d"
    separator: str = ","


def process_rule(row, rule):
    match rule:
        case [field, value, category, operator]:
            return CategoryRule(
                field=field,
                value=value,
                category=category,
                operator=operator
            ).process_row(row)
        case [field, value, category]:
            return CategoryRule(
                field=field,
                value=value,
                category=category
            ).process_row(row)
        case cat:
            return cat.process_row(row)


def process_categories(parameters: CsvImportParameters, row) -> list[str]:
    categories = (
        process_rule(row, rule)
        for rule in parameters.category_rules
    )
    return list(cat for cat in categories if cat)


def process_row(parameters: CsvImportParameters, row):
    mapping = parameters.column_mapping
    value = row[mapping.value]
    description = row[mapping.description] if mapping.description else ""
    date = row[mapping.date] if mapping.date else ""
    categories = process_categories(parameters, row)

    if not categories:
        categories = ["uncategorized"]

    return TransactionModel(
        value=value,
        description=description,
        categories=categories,
        date=date
    )


def import_transactions(account: Account, importer_input: ImportInput):
    input_as_csv = pd.read_csv(
        io.StringIO(importer_input.input_contents()),
        dtype=str
    )
    parameters = CsvImportParameters.model_validate(
        importer_input.parameters
    )
    return (
        process_row(parameters, row)
        for index, row in input_as_csv.iterrows()
    )
