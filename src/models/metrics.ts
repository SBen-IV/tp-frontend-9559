export interface Metric {
  name: string;
  total: number;
}

export interface ConfigItemMetric {
  total: number;
  byEstado: Metric[];
  byCategoria: Metric[];
}

export interface ChangeMetric {
  total: number;
  byEstado: Metric[];
  byPrioridad: Metric[];
}
