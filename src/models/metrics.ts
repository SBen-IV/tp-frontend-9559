import type { UUID } from "crypto";

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
  byImpacto: Metric[];
  tiempoPromedioCierre: number;
}

export interface IncidentMetric {
  total: number;
  byEstado: Metric[];
  byPrioridad: Metric[];
  byCategoria: Metric[];
  tiempoPromedioCierre: number;
  cantidadSinResponsable: number;
}

export interface ProblemMetric {
  total: number;
  byEstado: Metric[];
  byPrioridad: Metric[];
  tiempoPromedioCierre: number;
  cantidadSinResponsable: number;
}

export interface EmployeeMetric {
  nombre: string;
  byEstado: Metric[];
}

export interface ByHourMetric {
  hora: number;
  cantidad: number;
}

export interface ByDayMetric {
  dia: string;
  cantidad: number;
}
