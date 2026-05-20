# ☀️ Solar Dashboard — Monitoring photovoltaïque temps réel

> Système complet de monitoring de production solaire, autoconsommation et injection réseau,
> construit avec des outils open-source sur Raspberry Pi — **660+ jours de données**.

[![Dashboard](https://img.shields.io/badge/Dashboard-Looker%20Studio-4285F4?style=flat&logo=googleanalytics&logoColor=white)](https://datastudio.google.com/reporting/83718eaa-c527-4e4a-a45c-089a4e793b75)
[![Jeedom](https://img.shields.io/badge/Domotique-Jeedom-00b050?style=flat&logoColor=white)](https://www.jeedom.com)
[![OpenDTU](https://img.shields.io/badge/Onduleurs-OpenDTU-orange?style=flat&logoColor=white)](https://github.com/tbnobody/OpenDTU)
[![Depuis](https://img.shields.io/badge/Depuis-Août%202024-yellow?style=flat)]()

---

## 📊 Dashboard en direct

🔗 **[Voir le dashboard Looker Studio](https://datastudio.google.com/reporting/83718eaa-c527-4e4a-a45c-089a4e793b75)**

> Le dashboard est multi-pages : Accueil · Trim/Sais/Ans · Sem/Mens · Record

---

## ⚡ Chiffres clés (au 20/05/2026)

| Indicateur | Valeur |
|---|---|
| 🌞 Production cumulée | **7 352 kWh** |
| 🏠 Autoconsommation cumulée | **2 837 kWh** |
| 🔌 Injection réseau cumulée | **4 516 kWh** |
| 💶 Gains totaux cumulés | **1 353 €** |
| 📈 Taux d'autoconso moyen | **40%** |
| 🏡 Taux de couverture moyen | **30%** |
| 💰 Prix kWh moyen | **0,184 €** |
| 📅 ROI estimé | **~2048** (22 ans) |

---

## 🏗 Architecture du système

```
┌─────────────────────────────────────────────────────────┐
│              PRODUCTION SOLAIRE                         │
│                                                         │
│   Panneaux solaires                                     │
│        ↓                                                │
│   Micro-onduleurs Hoymiles                              │
│        ↓                                                │
│   OpenDTU (ESP32) ──── WiFi ────→ Jeedom               │
│                                      ↑                  │
│   Compteur Linky                     │                  │
│        ↓                             │                  │
│   Lixee ZLinky (Zigbee) ────────────┘                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              TRAITEMENT & STOCKAGE                      │
│                                                         │
│   Raspberry Pi                                          │
│   └── Jeedom                                            │
│       ├── Plugin JeeZigbee (OpenDTU + ZLinky)           │
│       ├── Historique CSV (production / injection)       │
│       └── Scénario PHP → export SQL → Google Sheet      │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              VISUALISATION                              │
│                                                         │
│   Google Sheet (34 colonnes, 660+ lignes)               │
│   ├── 4 colonnes sources (Conso / Prod / Injection)     │
│   ├── Cumuls kWh & gains €                              │
│   ├── Taux autoconso / couverture / injection           │
│   ├── ROI & amortissement dynamique                     │
│   └── Segmentation semaine / mois / saison / année      │
│        ↓                                                │
│   Looker Studio Dashboard (5 pages)                     │
│   ├── Accueil — synthèse J-3/J-2/Hier/Sem/Mois/An      │
│   ├── Trim / Sais / Ans                                 │
│   ├── Sem / Mens                                        │
│   ├── Records                                           │
│   └── iFrame intégré dans Jeedom                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Matériel utilisé

| Composant | Rôle |
|---|---|
| **Panneaux solaires + Micro-onduleurs Hoymiles** | Production d'énergie |
| **OpenDTU (ESP32 — firmware v24.6.29)** | Passerelle WiFi vers Jeedom |
| **Lixee ZLinky** | Lecture compteur Linky via Zigbee (conso + injection) |
| **Raspberry Pi** | Serveur Jeedom — cerveau du système |

---

## 🧠 Stack logicielle

| Outil | Usage |
|---|---|
| **Jeedom** | Domotique, collecte et historisation |
| **JeeZigbee** | Plugin Zigbee (ZLinky + OpenDTU) |
| **PHP (scénario Jeedom)** | Export CSV → SQL → Google Sheet chaque soir |
| **Google Sheet** | 34 colonnes de données calculées, 660+ jours |
| **Looker Studio** | Dashboard 5 pages, intégré en iFrame dans Jeedom |

---

## 📁 Structure du projet

```
solar-dashboard/
├── README.md                        # Ce fichier
├── scripts/
│   └── import_historique.php        # Import CSV → base Jeedom
└── google-sheet/
    └── structure_sheet.md           # Documentation des 34 colonnes
```

---

## 🚀 Reproduire ce projet

### Prérequis
- Raspberry Pi avec Jeedom installé
- Plugin JeeZigbee
- Compte Google (Google Sheet + Looker Studio)
- OpenDTU flashé sur un ESP32
- Lixee ZLinky

### Étapes
1. Flasher OpenDTU sur un ESP32 et le connecter aux micro-onduleurs
2. Installer JeeZigbee dans Jeedom et appairer le ZLinky
3. Laisser Jeedom historiser les commandes (production + injection)
4. Déployer le script `import_historique.php` dans un scénario Jeedom
5. Connecter Google Sheet comme source dans Looker Studio
6. Dupliquer le dashboard et adapter les métriques

---

## 📬 Contact

[![CV](https://img.shields.io/badge/CV-alweddle.github.io-00d4aa?style=flat&logo=github)](https://alweddle.github.io)
[![Email](https://img.shields.io/badge/Email-alexandre.chretien60%40gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:alexandre.chretien60@gmail.com)

