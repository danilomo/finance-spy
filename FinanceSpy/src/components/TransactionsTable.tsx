import { useProperties } from "../context/ParametersContext";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get, put, post, del } from "../commons/http";
import DataTable from "./DataTable";

type Transaction = {
  id: string;
  value: number;
  date: string;
  description: string;
  categories: string[];
};

export default function TransactionsTable() {
  const { account } = useParams();
  const properties = useProperties();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const from = properties?.getProperty("from")?.value;
  const to = properties?.getProperty("to")?.value;
  const [reload, setReload] = useState(true);

  const editTransaction = async (changes?: Transaction) => {
    if (!changes) {
      return;
    }
    console.log(JSON.stringify(changes) + "+++++");
    
    if (changes.id == "new") {      
      const [year, month, day] = changes.date.split("-");

      await post(
        `api/accounts/${account}/transactions/${year}/${month}/${day}`, 
        changes
      );
    } else {
      await put(
        `api/accounts/${account}/transactions`, 
        changes,
        {id: changes.id}
      );
    }

    setReload(!reload);
  };

  const deleteTransaction = async (id: string) => {
    if (!id) {
      return;
    }

    await del(
      `api/accounts/${account}/transactions/${id}`
    );

    setReload(!reload);
  };

  useEffect(() => {
    if (!(from && to)) {
      return;
    }

    setTransactions([]);

    get<Transaction[]>(`api/accounts/${account}/transactions`, {
      from,
      to,
    }).then((response: Transaction[]) => {
      setTransactions(
        response.map((trans) => {
          return {
            ...trans,
            value: trans.value / 100,
          };
        }),
      );
    });
  }, [account, properties?.store, reload]);

  return <DataTable
    data={transactions}
    onEdit={editTransaction}
    onDelete={deleteTransaction}
  />;
}
