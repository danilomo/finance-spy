import { createContext, useContext, useReducer, Dispatch } from "react";

type Value = string;

export type Property = {
  name: string;
  type?: "int" | "string" | "money" | "category" | "date";
  value?: Value;
  default?: Value;
};

type Action = {
  action: "set_value" | "set_properties";
  payload: Property[];
};

type Store = {
  properties: Property[];
};

const DEFAULT_PROPERTIES: Property[] = [
  { name: "from", type: "date" },
  { name: "to", type: "date" }
];

function reducer(state: Store, action: Action) {
  if (action.action == "set_properties") {
    return { properties: [...state.properties.filter(p => p.name == "from" || p.name == "to"), ...action.payload] };
  } else if (action.action == "set_value") {
    const [{ name, value }] = action.payload;
    const newProperties = state.properties.map((item) => {
      if (item.name === name) {
        return {
          ...item, 
          name,
          value,
        };
      }

      return item;
    });

    return {
      properties: newProperties,
    };
  }

  return state;
}

class PropertiesHandler {
  store: Store;
  private dispatch: Dispatch<Action>;

  constructor(dispatch: Dispatch<Action>, store: Store) {
    this.dispatch = dispatch;
    this.store = store;
  }

  getProperty(name: string) {
    return this.store.properties.find((p) => p.name === name);
  }

  properties() {
    return [... this.store.properties];
  }

  propertyMap() {
    const entries = this
      .store
      .properties
      .filter(prop => prop.value)
      .map(prop => [prop.name, prop.value]);

    return Object.fromEntries(entries);
  }

  setProperties(properties: Property[]) {
    this.dispatch({ action: "set_properties", payload: properties });
  }

  setValue(name: string, value: Value) {
    this.dispatch({ action: "set_value", payload: [{ name, value }] });
  }
}

const PropertiesProvider = createContext<PropertiesHandler | null>(null);

function useProperties() {
  return useContext(PropertiesProvider);
}

function PropertiesContext({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [state, dispatch] = useReducer(reducer, {
    properties: [
      ...DEFAULT_PROPERTIES
    ],
  });

  return (
    <PropertiesProvider.Provider value={new PropertiesHandler(dispatch, state)}>
      {children}
    </PropertiesProvider.Provider>
  );
}

export { PropertiesContext, useProperties };
