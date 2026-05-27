/**
 * ============================================================
 * IMPORT CSV → GOOGLE SHEET
 * ============================================================
 *
 * Script Google Apps Script — Chargement_Data_Solaire
 *
 * Fonction : Lit le fichier CSV généré par Jeedom depuis
 *            Google Drive et l'importe dans l'onglet Import_Base
 *            puis copie les formules sur toutes les lignes.
 *
 * Auteur   : Alexandre CHRETIEN
 * Contexte : Monitoring solaire — Hoymiles + OpenDTU + ZLinky
 *
 * Déclencheurs configurés :
 *   - Basé sur l'heure : 06h50
 *   - Basé sur l'heure : 10h53
 *   - À l'ouverture du sheet
 *
 * ⚠️  CONFIGURATION REQUISE :
 *   Remplacer VOTRE_SHEET_ID par l'ID de votre Google Sheet
 *   (visible dans l'URL : docs.google.com/spreadsheets/d/VOTRE_SHEET_ID/edit)
 * ============================================================
 */

function importTxtToSheetAndCopyFormulas() {

  // ── CONFIGURATION ──────────────────────────────────────────
  const TEXT_FILE_NAME = "historique_global_solaire_synthese.txt"; // Nom du fichier dans Google Drive
  const SHEET_ID       = "VOTRE_SHEET_ID";  // ← Remplacer par l'ID de votre Google Sheet
  const SHEET_NAME     = "Import_Base";     // Nom de l'onglet cible
  const START_ROW      = 3;                 // Ligne contenant les formules à recopier
  const START_COL      = 5;                 // Colonne de départ des formules (colonne E)
  // ───────────────────────────────────────────────────────────

  try {
    // --- Étape 1 : Importation du fichier texte ---
    Logger.log("Début de l'importation du fichier texte.");

    // Recherche du fichier texte dans Google Drive
    const files = DriveApp.getFilesByName(TEXT_FILE_NAME);
    if (!files.hasNext()) {
      throw new Error(`Le fichier "${TEXT_FILE_NAME}" est introuvable dans Google Drive.`);
    }
    const file        = files.next();
    const fileContent = file.getBlob().getDataAsString();

    // Division du contenu en lignes et détection du séparateur
    const lines     = fileContent.split("\n");
    const separator = lines[0].includes(";") ? ";" : "\t";
    const data      = lines.map(line => line.split(separator).map(value => value.replace(/\./g, ",")));

    // Vérification des données
    if (data.length === 0 || data[0].length === 0) {
      throw new Error("Le fichier est vide ou ne contient pas de données valides.");
    }
    const maxColumns = Math.max(...data.map(row => row.length));

    // Ouvrir la feuille Google Sheets
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error(`L'onglet "${SHEET_NAME}" est introuvable dans le fichier Google Sheets.`);
    }

    // Effacer les anciennes données
    sheet.getRange(1, 1, sheet.getMaxRows(), maxColumns).clearContent();

    // Charger les nouvelles données
    sheet.getRange(1, 1, data.length, maxColumns).setValues(
      data.map(row => {
        while (row.length < maxColumns) row.push("");
        return row;
      })
    );

    Logger.log(`Importation terminée : ${data.length} lignes et ${maxColumns} colonnes chargées.`);

    // --- Étape 2 : Copier les formules de la ligne START_ROW ---
    Logger.log("Début de la copie des formules.");

    const lastRow = sheet.getLastRow();
    if (lastRow > START_ROW) {
      const lastCol   = sheet.getLastColumn();
      const sourceRange = sheet.getRange(START_ROW, START_COL, 1, lastCol - START_COL + 1);
      const targetRange = sheet.getRange(START_ROW + 1, START_COL, lastRow - START_ROW, lastCol - START_COL + 1);
      sourceRange.copyTo(targetRange);
      Logger.log("Les formules ont été copiées avec succès.");
    } else {
      Logger.log("Aucune ligne à étendre en dessous de la ligne " + START_ROW + ".");
    }

    Logger.log("Processus terminé avec succès.");

  } catch (error) {
    Logger.log(`Erreur : ${error.message}`);
  }
}
