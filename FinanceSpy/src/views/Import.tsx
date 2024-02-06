import { ChangeEvent, useEffect, useState, useReducer } from 'react';
import { Button, Box } from '@mui/material';
import { post } from '../commons/http';
import { useParams } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { match } from "ts-pattern";

type LoadTransactions = {
    type: "load",
    values: TransactionModel[]
}

type EditTransaction = {
    type: "edit",
    changes: TransactionModel
}

type DeleteTransaction = {
    type: "delete",
    id?: number | string | null;
}

type Action = LoadTransactions | EditTransaction | DeleteTransaction;

function transactionsReducer(transactions: TransactionModel[], action: Action) {
    return match(action)
        .with({ type: "load" }, (action) => action.values)
        .with({ type: "edit" }, (action) => transactions.map(trans => trans.id === action.changes.id ? action.changes : trans))
        .otherwise((action) => transactions.filter((trans) => trans.id !== action.id));
}

interface TransactionModel {
    id?: number | string | null;
    value: number | string;
    date?: Date | null;
    description: string;
    categories: string[];
};

interface ImportOutput {
    success: boolean;
    message: string;
    output: TransactionModel[];
}

const uploadRequest = {
    "type": "csv",
    "dry_run": true,
    "parameters": {
        "column_mapping": {
            "date": "Date",
            "description": "Payee",
            "value": "Amount (EUR)"
        },
        "category_rules": [
            ["Payee", "netto", "netto"],
            ["Payee", "netto", "netto"],
            ["Payee", "apple.com", "apple_cloud"],
            ["Payee", "netflix", "netflix"],
            ["Payee", "american express", "american_express"],
            ["Payee", "Telefonica Germany", "o2"],
            ["Payee", "calzedonia", "restaurant"],
            ["Payee", "Five Guys", "five_guys"],
            ["Payee", "Parkhaus Luisenforum", "parking"],
            ["Payee", "DM-Drogerie", "dm"],
            ["Payee", "REWE", "rewe"],
            ["Payee", "hairfree", "hairfree"],
            ["Payee", "hyundai capital", "car_payment"],
            ["Payee", "suewag", "electricity"],
            ["Payee", "Spotify", "spotify"],
            ["Payee", "saturn", "saturn"],
            ["Payee", "PP Fitness", "gym"],
            ["Payee", "WUERTT.VERSICHERG.AG", "car_insurance"],
            ["Payee", "HighQSoft GmbH", "salary"],
            ["Payee", "Cafe Maldaner GmbH", "maldaner"],
            ["Transaction type", "MasterCard", "mastercard"],
            ["Transaction type", "Direct Debit", "direct_debit"]
        ]
    }
};

const CSVUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [csvData, setCsvData] = useState<string | null>(null);
    //const [transactions, setTransactions] = useState<TransactionModel[] | null>(null);
    const [transactions, transactionsDispatcher] = useReducer(transactionsReducer, []);
    const account = "leilane_n26"; //useParams();

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setFile(files[0]);
        }
    };

    useEffect(() => {
        async function importCsv() {
            const result: ImportOutput = await post(
                `api/accounts/${account}/transactions/import`,
                { ...uploadRequest, input: csvData }
            );

            for (let index = 0; index < result.output.length; index++) {
                result.output[index].id = "" + index;
            }

            //setTransactions(result.output);
            transactionsDispatcher({ type: "load", values: result.output });
        }
        if (!account || !csvData) {
            return;
        }
        importCsv();
    }, [csvData]);

    const handleUpload = () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target?.result;
            if (typeof data === 'string') {
                setCsvData(data);
            }
        };
        reader.readAsText(file);
    };

    const onEdit = (changes: TransactionModel) => {
        console.log(JSON.stringify(changes));
        transactionsDispatcher({ "type": "edit", changes });
    }

    const onDelete = (id: string) => {
        console.log(JSON.stringify(id));
        transactionsDispatcher({ "type": "delete", id });
    }

    return (
        <Box
            sx={{
                '& > :not(style)': { m: 1 },
            }}
        >
            {transactions.length == 0 && <>
                <input type="file" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} id="contained-button-file" />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span">
                        Select CSV
                    </Button>
                </label>
                <span>{file ? file.name : 'No file selected'}</span>
                <Button variant="contained" onClick={handleUpload} disabled={!file}>Upload</Button></>}

            {transactions.length > 0 && <>
                <h3>Edit transactions before importing</h3>
                <DataTable
                    data={transactions}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </>
            }

        </Box>
    );
};

export default CSVUploader;
