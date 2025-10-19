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

export interface IncidentMetric {
  total: number;
  byEstado: Metric[];
  byPrioridad: Metric[];
  byCategoria: Metric[];
  tiempoPromedioCierre: number;
}

export interface ProblemMetric {
  total: number;
  byEstado: Metric[];
  byPrioridad: Metric[];
}
