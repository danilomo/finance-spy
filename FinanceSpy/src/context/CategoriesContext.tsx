import { createContext, useContext } from "react";

type Category = string | { [Name: string]: Category[] };

const categories: Category[] = [
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
      },
      {
        travel: [
          "plane_ticket",
          "hotel_reservation",
          "train_ticket",
          "souvenirs",
        ],
      },
      {
        tax: ["tv_tax"],
      },
      {
        shopping: [
          "sports",
          "tk_maxx",
          "kaufhof",
          "karstadt",
          "purses",
          "jewlery",
          "zalando",
          {
            electronics: ["saturn", "real", "media_markt"],
          },
          {
            home_goods: ["action", "wohlwort", "tedi", "nanu_nana", "obi"],
          },
          "real",
          {
            clothing: ["peek_and_copenburg", "zara", "h_and_m", "calzedonia"],
          },
          {
            shoes: ["salamander", "deichmann", "globetrotter", "fink"],
          },
          {
            furniture: ["moemax", "ikea", "roller", "xxxlutz"],
          },
        ],
      },
      {
        education: [
          {
            course_fee: ["german_course", "inlingua", "vhs"],
          },
          "textbook",
          "school_supplies",
          "magazine",
          "book",
        ],
      },
      {
        body_and_hygiene: [
          "dm",
          "perfume",
          "hair_product",
          "apotheke",
          "mueller",
          "douglas",
          "hairdresser",
          "nails",
          "hairfree",
          "cosmetics",
        ],
      },
      {
        health: ["checkup", "gym"],
      },
      {
        commuting: [
          "monthly_ticket",
          "day_ticket",
          "single_ticket",
          {
            car: ["gas", "parking", "car_insurance", "car_tax", "car_payment"],
          },
        ],
      },
    ],
  },
];

function walkCategories(catlist: string[], catobj: Category[]) {
  catobj.forEach((cat) => {
    if (typeof cat === "string") {
      catlist.push(cat);
    }

    if (typeof cat === "object") {
      const [catname, children] = Object.entries(cat)[0];
      catlist.push(catname);
      walkCategories(catlist, children);
    }
  });
}

const CategoryList = createContext<string[]>([]);

function CategoryContext({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const categoryList: string[] = [];
  walkCategories(categoryList, categories);

  return (
    <CategoryList.Provider value={categoryList}>
      {children}
    </CategoryList.Provider>
  );
}

function useCategories() {
  return useContext(CategoryList);
}

export { CategoryContext, useCategories };
