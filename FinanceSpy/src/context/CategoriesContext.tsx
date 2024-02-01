import { createContext, useContext } from "react";
import * as chroma from 'chroma-js';

function generateColors(n: number) {
  let colors = chroma.scale(["#ccbdff", "#fef1ac"]).colors(n);
  return colors;
}

function debug(obj: any) {
  console.log(JSON.stringify(obj, null, 2));
}

type Categories = {
  categoryList: string[],
  categoryMap: Record<string, string>
  topLevelCategories: string[],
  colorMap: Record<string, string>,
  categoryTree: Category[]
};

type CategoryWithChildren = { [Name: string]: Category[] };

type Category = string | CategoryWithChildren;

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

function walkCategories(catobj: Category[], consumer: (a: string) => void) {
  catobj.forEach((cat) => {
    if (typeof cat === "string") {
      consumer(cat)
    }

    if (typeof cat === "object") {
      const [catname, children] = Object.entries(cat)[0];
      consumer(catname);
      walkCategories(children, consumer);
    }
  });
}

const CategoryList = createContext<Categories | null>(null);

function CategoryContext({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const categoryList: string[] = [];
  walkCategories(
    categories, 
    (x: string) => { 
      if (categoryList.includes(x)) {
        return;
      }
      
      categoryList.push(x);
    }
  );

  const categoryMap: Record<string, string> = {};
  const topLevelCategories: string[] = [];

  (categories[0] as CategoryWithChildren)["expenses"].forEach((cat) => {
    if (typeof (cat) == "string") {
      const catName = cat as string;
      categoryMap[cat as string] = catName;
      topLevelCategories.push(catName);
      return;
    }
    const catName = Object.keys(cat)[0];
    topLevelCategories.push(catName);
    walkCategories([cat], (c) => { categoryMap[c] = catName });
  });

  const colorMap: Record<string, string> = {};
  const colors = generateColors(topLevelCategories.length);

  for (let i = 0; i < colors.length; i++) {
    colorMap[topLevelCategories[i]] = colors[i];
  }

  const categoriesObject: Categories = {
    categoryList,
    categoryMap,
    topLevelCategories,
    colorMap,
    categoryTree: categories
  };

  return (
    <CategoryList.Provider value={categoriesObject}>
      {children}
    </CategoryList.Provider>
  );
}

function useCategories() {
  return useContext(CategoryList);
}

export { CategoryContext, useCategories };
