import type { Metric } from "@/models/metrics";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortByDate = (fecha1: Date, fecha2: Date) => {
  if (fecha1 < fecha2) {
    return 1;
  }

  if (fecha1 > fecha2) {
    return -1;
  }

  return 0;
};

export const sortByName = (nombre1: string, nombre2: string) => {
  if (nombre1 < nombre2) {
    return 1;
  }

  if (nombre1 > nombre2) {
    return -1;
  }

  return 0;
};

export const getPrioridadColor = (prioridad: string): string => {
  switch (prioridad) {
    case "BAJA":
      return "bg-blue-400";
    case "MEDIA":
      return "bg-yellow-300";
    case "ALTA":
      return "bg-orange-500";
    case "URGENTE":
      return "bg-red-600";
    default:
      return "";
  }
};

export const prettyDate = (date: Date): string => {
  // For some reason `date` is not a `Date`
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${day.toString().padStart(2, "0")}-${month
    .toString()
    .padStart(2, "0")}-${year}`;
};

export const mapToMetric = (data: Map<string, number>): Metric[] => {
  return Array.from(data, ([k, v]: [string, number]): Metric => {
    return { name: k, total: v };
  });
};
