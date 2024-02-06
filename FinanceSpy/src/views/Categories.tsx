import { ChevronRight, ExpandMore } from "@mui/icons-material";
//import { makeStyles } from "@mui/styles";
import { TreeItem, TreeView } from "@mui/x-tree-view";
import { Category } from "../context/CategoriesContext";
import { match, Pattern } from "ts-pattern";
/*
const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});*/

const data: Category[] = [
    {
        expenses: [
            "uncategorized",
            "random",
            "withdrawal",
            "wise",
            "n26_fee",
            {
                church: ["tithes", "offering"],
            },
            {
                food: [
                    {
                        groceries: [
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
                            "hit",
                            "norma",
                            "kik",
                        ],
                    },
                    {
                        fast_food: ["kfc", "mc_donalds", "burger_king", "starbucks"],
                    },
                    {
                        restaurant: ["sushi", "italian", "alex", "burger", "der_becker"],
                    },
                    "sweets",
                ],
            },
            {
                utilities: ["internet", "electricity", "lebara", "o2", "spotify"],
            }
        ]
    }
]

function Node({ value }: { value: Category }) {
    return match(value)
        .with(Pattern.string, str => <TreeItem key={str} nodeId={str} label={str} />)
        .otherwise(catWithChildren => {
            const cat = Object.keys(catWithChildren)[0];
            return (<TreeItem key={cat} nodeId={cat} label={cat}>
                {renderTree(catWithChildren[cat])}
            </TreeItem>)
        });
}

const renderTree = (nodes: Category[]) => {
    return nodes.map((node) => <Node value={node} />);
};

export default function MyTreeView() {
    //const classes = useStyles;

    return (
        <TreeView
            //className={classes}
            defaultCollapseIcon={<ExpandMore />}
            defaultExpandIcon={<ChevronRight />}
        >
            {renderTree(data)}
        </TreeView>
    );
}
