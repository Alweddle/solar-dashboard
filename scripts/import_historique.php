<?php
/**
 * ============================================================
 * IMPORT HISTORIQUE CSV → BASE JEEDOM
 * ============================================================
 * 
 * Scénario Jeedom (bloc PHP) — à exécuter via cron chaque soir
 * 
 * Fonction : Lit le fichier CSV d'historique d'une commande Jeedom
 *            et insère les données dans la table historyArch
 *            pour reconstituer l'historique de production/injection.
 * 
 * Auteur   : Alexandre CHRETIEN
 * Contexte : Monitoring solaire — Hoymiles + OpenDTU + Lixee ZLinky
 * ============================================================
 */

// ── CONFIGURATION ──────────────────────────────────────────
// ID de la commande Jeedom à importer
// (visible dans Jeedom → Outils → Commandes → colonne ID)
$cmd_id = 14740;

// Chemin vers le fichier CSV exporté par Jeedom
// Format attendu : date(d/m/Y) ; col1 ; col2 ; valeur(kWh)
$file_path = '/var/www/html/data/histo/14740.csv';
// ───────────────────────────────────────────────────────────

try {

    // Vérifier que le fichier CSV existe
    if (!file_exists($file_path)) {
        throw new Exception("Fichier introuvable : " . $file_path);
    }

    // Ouvrir le fichier en lecture
    if (($handle = fopen($file_path, 'r')) !== false) {

        // Ignorer la ligne d'en-tête
        $header = fgetcsv($handle, 1000, ';');

        // Parcourir chaque ligne de données
        while (($data = fgetcsv($handle, 1000, ';')) !== false) {

            $date_fr = $data[0]; // Format : dd/mm/YYYY
            $value   = $data[3]; // Valeur kWh (colonne D)

            // Convertir la date FR → format SQL
            $date_obj = DateTime::createFromFormat('d/m/Y', $date_fr);

            if ($date_obj) {
                $datetime = $date_obj->format('Y-m-d') . ' 00:00:00';

                // Insérer uniquement les valeurs numériques valides
                if ($value != '' && is_numeric($value)) {

                    $sql = "INSERT INTO `historyArch` 
                            (`cmd_id`, `datetime`, `value`) 
                            VALUES (:cmd_id, :datetime, :value)";

                    DB::Prepare($sql, array(
                        'cmd_id'   => $cmd_id,
                        'datetime' => $datetime,
                        'value'    => (float)$value
                    ), DB::FETCH_TYPE_ROW);

                    $scenario->setLog("✅ Inséré : cmd_id=$cmd_id | $datetime | $value kWh");

                } else {
                    $scenario->setLog("⚠️ Valeur ignorée (vide ou non numérique) : ligne $date_fr");
                }

            } else {
                $scenario->setLog("❌ Erreur format date : $date_fr");
            }
        }

        fclose($handle);
        $scenario->setLog("✅ Import terminé avec succès.");

    } else {
        throw new Exception("Impossible d'ouvrir le fichier : " . $file_path);
    }

} catch (Exception $e) {
    $scenario->setLog("❌ ERREUR : " . $e->getMessage());
}
