from typing import Dict, List, ByteString
from pydantic import BaseModel, Field, Json
from financespy.models import TransactionModel
import base64


class ImportInput(BaseModel):
    type_str: str = Field("", alias="type")
    profile: str = ""
    dry_run: bool = False
    base_64: bool = False
    parameters: dict = Field(default_factory=dict)
    input: str = ""

    def input_contents(self) -> str | ByteString:
        if self.base_64:
            return base64.b64decode(self.input)

        return self.input


class ImportOutput(BaseModel):
    success: bool = False
    message: str = ""
    output: List[TransactionModel] = Field(default_factory=list)
