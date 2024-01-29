export type ChartType = {
  id: string;
  title: string;
  size: string;
  type: string;
  formula: {
    columns: string[];
    categories: string[];
    categories_exclude: string[];
    filter_string?: string;
  };
  columns: string;
  properties: Record<string, any>;
};

export type RowType = {
  charts: ChartType[];
};

export type TemplateType = {
  template: RowType[];
  parameters: Record<string, any>;
  account: string;
};

export type ChartDataType = [number, string][];

export type ChartDataProps = {
  chartData: ChartDataType;
};

export type ChartTemplateProps = {
  template: ChartType;
};
