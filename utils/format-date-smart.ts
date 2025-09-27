import { format, formatDistanceToNow, parseISO, parse } from "date-fns";
import { fr } from "date-fns/locale";

/**
 * Formate une date selon les règles suivantes :
 * - Si la date est à moins de 2 heures, retourne une durée relative (ex: "il y a 30 minutes")
 * - Sinon, retourne la date formatée (ex: "27 mai 2025 à 09:30")
 *
 * @param dateString - La date à formater (au format ISO ou Date)
 * @returns La date formatée selon les règles spécifiées
 */
/**
 * Formate une date au format 'MM YYYY' en 'Mois YYYY' en français
 * @param dateStr - La date au format 'MM YYYY' (ex: '03 2021')
 * @returns La date formatée (ex: 'mars 2021')
 */
export function formatMonthYear(dateStr: string): string {
  try {
    const date = parse(dateStr, 'MM yyyy', new Date());
    return format(date, 'MMMM yyyy', { locale: fr });
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return dateStr; // Retourne la chaîne originale en cas d'erreur
  }
}

export function formatDateSmart(dateString: string | Date): string {
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    const now = new Date();

    // Calculer la différence en millisecondes
    const diffInMs = now.getTime() - date.getTime();
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    // Si la date est à moins de 2 heures, on utilise le format relatif
    if (diffInMs < twoHoursInMs) {
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: fr,
      }).replace(/^environ\s+/, ""); // Retire le "environ" du début si présent
    }

    // Sinon, on utilise le format complet
    return format(date, "d MMMM yyyy 'à' HH'h'mm", { locale: fr });
  } catch (error) {
    console.error("Erreur lors du formatage de la date:", error);
    return "Date invalide";
  }
}
