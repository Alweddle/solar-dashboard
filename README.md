# ☀️ Solar Dashboard — Monitoring photovoltaïque temps réel

> Système complet de monitoring de production solaire, autoconsommation et injection réseau,  
> construit avec des outils open-source sur Raspberry Pi.

[![Dashboard](https://img.shields.io/badge/Dashboard-Looker%20Studio-4285F4?style=flat&logo=googleanalytics&logoColor=white)](https://datastudio.google.com/reporting/83718eaa-c527-4e4a-a45c-089a4e793b75)
[![Jeedom](https://img.shields.io/badge/Domotique-Jeedom-00b050?style=flat&logoColor=white)](https://www.jeedom.com)
[![OpenDTU](https://img.shields.io/badge/Onduleurs-OpenDTU-orange?style=flat&logoColor=white)](https://github.com/tbnobody/OpenDTU)

---

## 📊 Dashboard en direct

🔗 **[Voir le dashboard Looker Studio](https://datastudio.google.com/reporting/83718eaa-c527-4e4a-a45c-089a4e793b75)**

![Dashboard Preview](assets/dashboard_preview.png)

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
│   Google Sheet (source de données)                      │
│        ↓                                                │
│   Looker Studio Dashboard                               │
│   ├── Production J-3 / J-2 / Hier / Semaine / Mois     │
│   ├── Taux d'autoconsommation & couverture              │
│   ├── Gains journaliers & ROI                           │
│   └── iFrame intégré dans Jeedom                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Matériel utilisé

| Composant | Rôle |
|---|---|
| **Panneaux solaires + Micro-onduleurs Hoymiles** | Production d'énergie |
| **OpenDTU (ESP32)** | Passerelle WiFi vers Jeedom via protocole DTU |
| **Lixee ZLinky** | Lecture du compteur Linky (injection / conso) via Zigbee |
| **Raspberry Pi** | Serveur Jeedom — cerveau du système |

---

## 🧠 Stack logicielle

| Outil | Usage |
|---|---|
| **Jeedom** | Domotique, collecte et historisation des données |
| **JeeZigbee** | Plugin Zigbee pour Jeedom (ZLinky + OpenDTU) |
| **PHP (scénario Jeedom)** | Export des données CSV → base SQL → Google Sheet |
| **Google Sheet** | Stockage structuré des données journalières |
| **Looker Studio** | Dashboard de visualisation multi-pages |

---

## 📈 Données collectées

| Métrique | Source | Fréquence |
|---|---|---|
| Production (kWh) | OpenDTU → Hoymiles | Temps réel |
| Consommation (kWh) | Lixee ZLinky → Linky | Temps réel |
| Injection réseau (kWh) | Lixee ZLinky → Linky | Temps réel |
| Gains (€) | Calculé dans Looker | Journalier |
| ROI | Calculé dans Looker | Cumulatif |

---

## 📁 Structure du projet

```
solar-dashboard/
├── README.md                  # Ce fichier
├── scripts/
│   └── import_historique.php  # Import CSV → base Jeedom
├── google-sheet/
│   └── structure_sheet.md     # Structure du Google Sheet
└── assets/
    └── dashboard_preview.png  # Capture du dashboard
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
