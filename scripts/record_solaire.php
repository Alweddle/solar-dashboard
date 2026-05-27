<?php
/**
 * ============================================================
 * SCÉNARIO RECORD DE PRODUCTION SOLAIRE
 * ============================================================
 *
 * Scénario Jeedom (bloc PHP) — à exécuter chaque soir à 23h00
 *
 * Fonction : Détecte si la production journalière dépasse le
 *            record absolu et envoie une notification Telegram.
 *
 * Auteur   : Alexandre CHRETIEN
 * Contexte : Monitoring solaire — Hoymiles + OpenDTU + ZLinky
 *
 * Déclencheur recommandé : 0 23 * * *
 * ============================================================
 *
 * IDs des commandes Jeedom :
 *   - Production J : 13966
 *   - Bot Telegram  : 6039
 *
 * Variables Jeedom utilisées :
 *   - Old_Max_Prod_Solaire     : Record absolu en kWh
 *   - Old_Date_Record_Solaire  : Date du record (texte lisible)
 *   - Old_Date_Record_Solaire2 : Date du record (timestamp technique)
 *   - New_Max_Prod_Solaire     : Nouvelle valeur record (temporaire)
 *   - New_Date_Record_Solaire  : Nouvelle date record (temporaire)
 *   - New_Date_Record_Solaire2 : Nouveau timestamp record (temporaire)
 *   - Ecart_Record_Solaire     : Écart entre ancien et nouveau record
 *   - nbjour_record            : Nb de jours depuis le dernier record
 * ============================================================
 */

// --- Helpers lecture/écriture variables Jeedom ---
function jeeGetVar($_name, $_default = '') {
    $ds = dataStore::byTypeLinkIdKey('scenario', -1, trim($_name));
    return is_object($ds) ? $ds->getValue($_default) : $_default;
}

function jeeSetVar($_name, $_value) {
    $ds = dataStore::byTypeLinkIdKey('scenario', -1, trim($_name));
    if (!is_object($ds)) {
        $ds = new dataStore();
        $ds->setType('scenario');
        $ds->setLink_id(-1);
        $ds->setKey(trim($_name));
    }
    $ds->setValue($_value);
    $ds->save();
}

try {
    $scenario->setLog("=== Vérification Record Production Solaire ===");

    // --- Lecture des valeurs ---
    $prod_j         = cmd::byId(13966)->execCmd();
    $old_max        = floatval(jeeGetVar('Old_Max_Prod_Solaire', 0));
    $old_date_texte = jeeGetVar('Old_Date_Record_Solaire', '');
    $old_date_ts    = jeeGetVar('Old_Date_Record_Solaire2', '');

    $scenario->setLog("Production du jour : $prod_j kWh | Ancien record : $old_max kWh");

    if (floatval($prod_j) > floatval($old_max)) {

        $scenario->setLog("Nouveau record détecté !");

        $new_max        = floatval($prod_j);
        $ecart          = round($new_max - floatval($old_max), 2);
        $new_date_texte = date('l j F Y');
        $new_date_ts    = cmd::byId(13966)->getCollectDate();

        $nb_jours = 0;
        if (!empty($old_date_ts) && !empty($new_date_ts)) {
            $dt_old   = new DateTime($old_date_ts);
            $dt_new   = new DateTime($new_date_ts);
            $nb_jours = intval($dt_old->diff($dt_new)->days);
        }

        $scenario->setLog("Écart : +$ecart kWh | Ancien record il y a $nb_jours jours");

        $message = "Nouveau Record de production solaire !\n"
                 . "La production du jour $new_max kWh dépasse de +$ecart kWh\n"
                 . "Ancien record à $old_max kWh le $old_date_texte, il y a $nb_jours jours.";

        cmd::byId(6039)->execCmd(['title' => '', 'message' => $message]);

        jeeSetVar('New_Max_Prod_Solaire',     $new_max);
        jeeSetVar('Ecart_Record_Solaire',     $ecart);
        jeeSetVar('New_Date_Record_Solaire',  $new_date_texte);
        jeeSetVar('New_Date_Record_Solaire2', $new_date_ts);
        jeeSetVar('nbjour_record',            $nb_jours);
        jeeSetVar('Old_Max_Prod_Solaire',     $new_max);
        jeeSetVar('Old_Date_Record_Solaire',  $new_date_texte);
        jeeSetVar('Old_Date_Record_Solaire2', $new_date_ts);

        $scenario->setLog("Variables mises à jour. Record enregistré.");

    } else {

        $scenario->setLog("Pas de record aujourd'hui.");

        $nb_jours    = 0;
        $new_date_ts = cmd::byId(13966)->getCollectDate();
        if (!empty($old_date_ts) && !empty($new_date_ts)) {
            $dt_old   = new DateTime($old_date_ts);
            $dt_new   = new DateTime($new_date_ts);
            $nb_jours = intval($dt_old->diff($dt_new)->days);
        }

        jeeSetVar('nbjour_record', $nb_jours);

        $message = "Pas de Record aujourd'hui !\n"
                 . "Histo : $old_max kWh le $old_date_texte, il y a $nb_jours jours.";

        cmd::byId(6039)->execCmd(['title' => '', 'message' => $message]);

        $scenario->setLog("Notification envoyée.");
    }

    $scenario->setLog("=== Fin du traitement ===");

} catch (Exception $e) {
    $scenario->setLog("ERREUR : " . $e->getMessage());
}
