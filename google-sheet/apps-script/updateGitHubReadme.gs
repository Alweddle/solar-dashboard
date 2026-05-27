/**
 * ============================================================
 * UPDATE GITHUB README — Stats solaires dynamiques
 * ============================================================
 *
 * Script Google Apps Script — Chargement_Data_Solaire
 *
 * Fonction : Lit les dernières statistiques depuis le Google
 *            Sheet et met à jour automatiquement le README
 *            du repo GitHub solar-dashboard chaque matin.
 *
 * Auteur   : Alexandre CHRETIEN
 * Contexte : Monitoring solaire — Hoymiles + OpenDTU + ZLinky
 *
 * Déclencheur : tous les jours à 10h (via createTrigger())
 *
 * ⚠️  CONFIGURATION REQUISE :
 *   1. Remplacer VOTRE_TOKEN_GITHUB par un token GitHub
 *      (Settings → Developer settings → Personal access tokens → Classic)
 *      Permissions requises : repo
 *   2. Remplacer VOTRE_NOM_UTILISATEUR par votre username GitHub
 *   3. Vérifier que SHEET_NAME correspond au nom de votre onglet
 * ============================================================
 */

// ── CONFIGURATION ──────────────────────────────────────────
const GITHUB_TOKEN = 'VOTRE_TOKEN_GITHUB';         // ← ghp_...
const GITHUB_REPO  = 'VOTRE_NOM_UTILISATEUR/solar-dashboard'; // ← ex: Alweddle/solar-dashboard
const GITHUB_FILE  = 'README.md';
const SHEET_NAME   = 'Data_Solaire';               // ← Nom de l'onglet principal
// ───────────────────────────────────────────────────────────

function updateGitHubReadme() {
  try {
    Logger.log("=== Début mise à jour README ===");

    const ss      = SpreadsheetApp.getActiveSpreadsheet();
    const sheet   = ss.getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();

    // Lecture de l'avant-dernière ligne = données d'hier (script tourne à 10h)
    const lastData = sheet.getRange(lastRow - 1, 1, 1, 33).getValues()[0];

    // Colonnes du sheet (index 0 = colonne A)
    const date_maj       = lastData[0];   // A  - Date
    const prod_hier      = lastData[2];   // C  - Production J kWh
    const gain_hier      = lastData[13];  // N  - Gain J €
    const autoconso_hier = lastData[21];  // V  - Taux AutoConso J
    const prod_cumul     = lastData[5];   // F  - Production Cumul kWh
    const gain_cumul     = lastData[14];  // O  - Gain Cumul €

    // Record — à mettre à jour manuellement si nouveau record
    const record_val  = 28.9;
    const record_date = '3 juillet 2025';

    // Formatage des valeurs
    const date_fmt       = Utilities.formatDate(new Date(date_maj), 'Europe/Paris', 'dd/MM/yyyy');
    const prod_hier_fmt  = parseFloat(prod_hier).toFixed(1);
    const gain_hier_fmt  = parseFloat(gain_hier).toFixed(2);
    const auto_hier_fmt  = Math.round(parseFloat(autoconso_hier) * 100);
    const prod_cumul_fmt = Math.round(prod_cumul).toLocaleString('fr-FR');
    const gain_cumul_fmt = Math.round(gain_cumul).toLocaleString('fr-FR');

    Logger.log("Date : "                + date_fmt);
    Logger.log("Production hier : "     + prod_hier_fmt  + " kWh");
    Logger.log("Gain hier : "           + gain_hier_fmt  + " €");
    Logger.log("Autoconso hier : "      + auto_hier_fmt  + " %");
    Logger.log("Production cumulée : "  + prod_cumul_fmt + " kWh");
    Logger.log("Gains cumulés : "       + gain_cumul_fmt + " €");

    // --- Construction du README ---
    const readme = `# ☀️ Solar Dashboard

> Monitoring photovoltaïque temps réel — OpenDTU + Jeedom + Looker Studio

[![Made with Jeedom](https://img.shields.io/badge/Jeedom-4.0-green?style=flat&logo=homeassistant)](https://www.jeedom.com)
[![Looker Studio](https://img.shields.io/badge/Looker_Studio-Dashboard-blue?style=flat&logo=google)](https://datastudio.google.com)
[![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi_4-4Go-red?style=flat&logo=raspberrypi)](https://www.raspberrypi.com)
[![Mis à jour](https://img.shields.io/badge/Mis_à_jour_le-${date_fmt.replace(/\//g, '_')}-lightgrey)](https://github.com/${GITHUB_REPO})

---

## 📊 Statistiques — *Mises à jour automatiquement chaque matin*

### ☀️ Hier — ${date_fmt}
| Métrique | Valeur |
|---|---|
| ⚡ Production | **${prod_hier_fmt} kWh** |
| 💶 Gain | **${gain_hier_fmt} €** |
| ♻️ Taux d'autoconsommation | **${auto_hier_fmt} %** |

### 📈 Depuis le 01/08/2024
| Métrique | Valeur |
|---|---|
| ⚡ Production cumulée | **${prod_cumul_fmt} kWh** |
| 💶 Gains cumulés | **${gain_cumul_fmt} €** |
| 🏆 Record journalier | **${record_val} kWh** — ${record_date} |

---

## 🏗 Architecture

\`\`\`
Panneaux solaires
      ↓
Micro-onduleurs Hoymiles
      ↓
OpenDTU (ESP32 WiFi)
      ↓
Jeedom (Raspberry Pi 4)
      ↓
Historique CSV → Google Sheet → Looker Studio
\`\`\`

---

## 📁 Structure du repo

\`\`\`
solar-dashboard/
├── README.md
├── scripts/
│   ├── import_historique.php       ← Export CSV → Google Sheet
│   └── record_solaire.php          ← Scénario record de production ☀️
└── google-sheet/
    ├── import_script.md            ← Documentation du script d'import
    └── apps-script/
        ├── importTxtToSheetAndCopyFormulas.gs  ← Import CSV
        └── updateGitHubReadme.gs               ← README dynamique
\`\`\`

---

## ⚙️ Scénarios Jeedom

### 📈 Export historique (\`scripts/import_historique.php\`)
Scénario PHP qui tourne chaque soir et exporte l'historique des commandes Jeedom vers un fichier CSV.

### 🏆 Record de production (\`scripts/record_solaire.php\`)
Scénario PHP qui détecte chaque soir si un nouveau record de production journalière est battu et envoie une notification Telegram.

**Variables Jeedom utilisées :**

| Variable | Rôle |
|---|---|
| \`Old_Max_Prod_Solaire\` | Record absolu en kWh |
| \`Old_Date_Record_Solaire\` | Date du record (texte lisible) |
| \`Old_Date_Record_Solaire2\` | Date du record (timestamp technique) |
| \`nbjour_record\` | Nb de jours depuis le dernier record |

---

## 🔗 Liens

- 📊 [Dashboard Looker Studio](https://datastudio.google.com/reporting/83718eaa-c527-4e4a-a45c-089a4e793b75)
- 💻 [CV interactif](https://alweddle.github.io)
- 🌡️ [Repo Canicule](https://github.com/Alweddle/jeedom-canicule)

---

## 📝 Changelog

| Date | Version | Changements |
|---|---|---|
| Mai 2026 | v2.0 | README dynamique + scénario record solaire |
| Mars 2026 | v1.1 | Wiki complet + documentation Google Sheet |
| Août 2024 | v1.0 | Mise en place initiale |

---

*README généré automatiquement le ${date_fmt} via Google Apps Script* 🤖
`;

    // --- Récupération du SHA du fichier actuel sur GitHub ---
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
    const getResponse = UrlFetchApp.fetch(apiUrl, {
      method: 'get',
      headers: {
        'Authorization': 'token ' + GITHUB_TOKEN,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    const fileData = JSON.parse(getResponse.getContentText());
    const sha = fileData.sha;
    Logger.log("SHA récupéré : " + sha);

    // --- Push du nouveau README sur GitHub ---
    const content = Utilities.base64Encode(readme, Utilities.Charset.UTF_8);
    const putResponse = UrlFetchApp.fetch(apiUrl, {
      method: 'put',
      headers: {
        'Authorization': 'token ' + GITHUB_TOKEN,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({
        message: `📊 Stats solaires du ${date_fmt}`,
        content: content,
        sha: sha
      })
    });

    const result = JSON.parse(putResponse.getContentText());
    Logger.log("README mis à jour : " + result.content.html_url);
    Logger.log("=== Fin mise à jour README ===");

  } catch(e) {
    Logger.log("ERREUR : " + e.message);
  }
}

// ============================================================
// DÉCLENCHEUR — Exécuter UNE SEULE FOIS pour programmer à 10h
// ============================================================
function createTrigger() {
  ScriptApp.newTrigger('updateGitHubReadme')
    .timeBased()
    .everyDays(1)
    .atHour(10)
    .create();
  Logger.log("Déclencheur créé : tous les jours à 10h ✅");
}
