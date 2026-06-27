# ☀️ Solar Dashboard

> Monitoring photovoltaïque temps réel — OpenDTU + Jeedom + Looker Studio

[![Made with Jeedom](https://img.shields.io/badge/Jeedom-4.0-green?style=flat&logo=homeassistant)](https://www.jeedom.com)
[![Looker Studio](https://img.shields.io/badge/Looker_Studio-Dashboard-blue?style=flat&logo=google)](https://datastudio.google.com)
[![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi_4-4Go-red?style=flat&logo=raspberrypi)](https://www.raspberrypi.com)
[![Mis à jour](https://img.shields.io/badge/Mis_à_jour_le-26_06_2026-lightgrey)](https://github.com/Alweddle/solar-dashboard)

---

## 📊 Statistiques — *Mises à jour automatiquement chaque matin*

### ☀️ Le 26/06/2026
| Métrique | Valeur |
|---|---|
| ⚡ Production | **21.9 kWh** |
| 💶 Gain | **4.47 €** |
| ♻️ Taux d'autoconsommation | **50 %** |

### 📈 Depuis le 01/08/2024
| Métrique | Valeur |
|---|---|
| ⚡ Production cumulée | **8 130 kWh** |
| 💶 Gains cumulés | **1 498 €** |
| 🏆 Record journalier | **28.9 kWh** — 3 juillet 2025 |

---

## 🏗 Architecture

```
Panneaux solaires
      ↓
Micro-onduleurs Hoymiles
      ↓
OpenDTU (ESP32 WiFi)
      ↓
Jeedom (Raspberry Pi 4)
      ↓
Historique CSV → Google Sheet → Looker Studio
```

---

## 📁 Structure du repo

```
solar-dashboard/
├── README.md
├── scripts/
│   ├── import_historique.php       ← Export CSV → Google Sheet
│   └── record_solaire.php          ← Scénario record de production ☀️
└── google-sheet/
    ├── import_script.md            ← Documentation du script d'import
    ├── structure_sheet.md          ← Structure CSV
    └── apps-script/
        ├── importTxtToSheetAndCopyFormulas.gs  ← Import CSV → Google Sheet
        └── updateGitHubReadme.gs               ← README dynamique GitHub
```

---

## ⚙️ Scénarios Jeedom

### 📈 Export historique (`scripts/import_historique.php`)
Scénario PHP qui tourne chaque soir et exporte l'historique des commandes Jeedom vers un fichier CSV.

### 🏆 Record de production (`scripts/record_solaire.php`)
Scénario PHP qui détecte chaque soir si un nouveau record de production journalière est battu et envoie une notification Telegram.

**Variables Jeedom utilisées :**

| Variable | Rôle |
|---|---|
| `Old_Max_Prod_Solaire` | Record absolu en kWh |
| `Old_Date_Record_Solaire` | Date du record (texte lisible) |
| `Old_Date_Record_Solaire2` | Date du record (timestamp technique) |
| `nbjour_record` | Nb de jours depuis le dernier record |

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

*README généré automatiquement le 26/06/2026 via Google Apps Script* 🤖
