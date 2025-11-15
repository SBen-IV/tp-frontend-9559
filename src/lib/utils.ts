import { getAllUsers } from "@/api/users";
import {
  BLUE,
  GREEN,
  LIGHT_BLUE,
  ORANGE,
  PINK,
  RED,
  VIOLET,
  YELLOW,
  type Color,
} from "@/models/colors";
import type { Metric } from "@/models/metrics";
import type { User } from "@/models/users";
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

export const colorsByPrioridad: Record<string, Color> = {
  BAJA: BLUE,
  MEDIA: YELLOW,
  ALTA: ORANGE,
  URGENTE: RED,
};

export const colorsByImpacto: Record<string, Color> = {
  MENOR: GREEN,
  SIGNIFICATIVO: ORANGE,
  MAYOR: RED,
};

export const getPrioridadColor = (prioridad: string): string => {
  return colorsByPrioridad[prioridad].tw;
};

export const getImpactoColor = (impacto: string): string => {
  return colorsByImpacto[impacto].tw;
};

export const colorsByIncidenteEstado: Record<string, Color> = {
  NUEVO: PINK,
  EN_PROGRESO: VIOLET,
  RESUELTO: BLUE,
  CERRADO: LIGHT_BLUE,
};

export const colorsByIncidenteCategoria: Record<string, Color> = {
  SOFTWARE: PINK,
  HARDWARE: VIOLET,
  SOLICITUD_DE_SERVICIO: BLUE,
  SEGURIDAD: LIGHT_BLUE,
};

export const colorsByCambioEstado: Record<string, Color> = {
  RECIBIDO: PINK,
  ACEPTADO: VIOLET,
  RECHAZADO: BLUE,
  EN_PROGRESO: LIGHT_BLUE,
  CERRADO: GREEN,
};

export const colorsByProblemaEstado: Record<string, Color> = {
  EN_ANALISIS: PINK,
  DETECTADO: VIOLET,
  RESUELTO: BLUE,
  CERRADO: LIGHT_BLUE,
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

export const prettyUser = (user: User): string => {
  return `${user.nombre} ${user.apellido} - ${user.email}`;
};

export const mapToMetric = (data: Map<string, number>): Metric[] => {
  return Array.from(data, ([k, v]: [string, number]): Metric => {
    return { name: k, total: v };
  });
};

export const formatAverageResolutionTime = (averageMs: number): string => {
  if (averageMs == 0) return "No hay datos";

  const seconds = Math.floor(averageMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ${days === 1 ? "día" : "días"}`;
  if (hours > 0) return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  if (minutes > 0) return `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;

  return `${seconds} ${seconds === 1 ? "segundo" : "segundos"}`;
};

export const fetchEmpleados = async (): Promise<User[]> => {
  try {
    const empleados = await getAllUsers("EMPLEADO");
    return empleados;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const daysBetweenDates = (a: Date, b: Date): number => {
  const dateA = new Date(a);
  const dateB = new Date(b);

  const _MS_PER_DAY = 1000 * 60 * 60 * 24;

  const utc1 = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate());
  const utc2 = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
