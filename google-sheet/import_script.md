# 📥 Script d'import — `importTxtToSheetAndCopyFormulas`

## 🎯 Objectif

Ce script est le **cœur de la chaîne de données** du système de monitoring solaire.

Chaque soir, Jeedom collecte les données de production, consommation et injection depuis les équipements (Hoymiles via OpenDTU, Linky via ZLinky) et les exporte dans un fichier CSV sur le Raspberry Pi.

Ce fichier CSV est ensuite synchronisé vers Google Drive, et ce script Apps Script prend le relais chaque matin pour :

1. **Importer** les nouvelles données dans le Google Sheet `Import_Base`
2. **Propager** automatiquement les 34 formules de calcul sur toutes les lignes (cumuls kWh, gains €, taux d'autoconsommation, ROI, amortissement, segmentation par semaine/mois/saison/année...)
3. **Alimenter** ainsi en temps réel le dashboard **Looker Studio** qui se connecte au sheet `Data_Solaire`

Sans ce script, le dashboard Looker Studio afficherait des données figées et jamais mises à jour.

---

## Vue d'ensemble

Script Google Apps Script qui tourne automatiquement et importe
le fichier CSV généré par Jeedom dans le Google Sheet `Data_Solaire`.

---

## Déclencheurs configurés

| Événement | Heure | Fonction |
|---|---|---|
| Basé sur l'heure | 06h50 | `importTxtToSheetAndCopyFormulas` |
| Basé sur l'heure | 10h53 | `importTxtToSheetAndCopyFormulas` |
| À l'ouverture | — | `importTxtToSheetAndCopyFormulas` |

---

## Fonctionnement

```
Jeedom (chaque soir)
→ Scénario PHP génère le fichier CSV
→ Dépose dans /var/www/html/data/histo/solaire/
→ Synchronisé vers Google Drive

Google Apps Script (chaque matin)
→ Lit le fichier depuis Google Drive
→ Efface l'onglet Import_Base
→ Recharge toutes les données
→ Copie les formules de la ligne 3 vers toutes les lignes
```

---

## Configuration

```javascript
const TEXT_FILE_NAME = "historique_global_solaire_synthese.txt"; // Nom du fichier dans Google Drive
const SHEET_ID       = ""; // ID du Google Sheet
const SHEET_NAME     = "Import_Base"; // Onglet cible
const START_ROW      = 3;  // Ligne contenant les formules à recopier
const START_COL      = 5;  // Colonne de départ des formules (colonne E)
```

---

## Étapes du script

**Étape 1 — Import du fichier texte**

1. Recherche le fichier `historique_global_solaire_synthese.txt` dans Google Drive
2. Détecte le séparateur automatiquement (`;` ou tabulation)
3. Convertit les points en virgules (format numérique français)
4. Efface les anciennes données de l'onglet `Import_Base`
5. Charge les nouvelles données

**Étape 2 — Copie des formules**

1. Récupère les formules de la ligne `START_ROW` (ligne 3) à partir de la colonne `START_COL` (colonne E)
2. Copie ces formules sur toutes les lignes suivantes jusqu'à la dernière ligne de données
3. Les formules calculent automatiquement tous les indicateurs (cumuls, taux, gains, ROI...)

---

## Format du fichier CSV source

Généré par le scénario PHP Jeedom chaque soir à 23h32 :

```
Datetime ; 2875 - Conso J ; 13966 - Production J ; 14517 - Injection J
27/05/2026 23:32:00 ; 7,3 ; 9,2 ; 3,3
28/05/2026 23:32:00 ; 6,2 ; 18,0 ; 12,4
```

| Colonne | ID commande | Description |
|---|---|---|
| Datetime | — | Date et heure de la mesure |
| Conso J | 2875 | Consommation journalière (kWh) |
| Production J | 13966 | Production solaire journalière (kWh) |
| Injection J | 14517 | Injection réseau journalière (kWh) |

---

## Onglets du Google Sheet

| Onglet | Rôle |
|---|---|
| `Import_Base` | Données brutes importées depuis le CSV |
| `Data_Solaire` | Données calculées avec les 34 colonnes de métriques |

---

## Dépannage

**Le fichier n'est pas trouvé**
→ Vérifier que `historique_global_solaire_synthese.txt` est bien dans Google Drive
→ Vérifier que le script Jeedom a bien tourné la veille

**Les formules ne se copient pas**
→ Vérifier que `START_ROW = 3` correspond bien à la ligne contenant les formules
→ Vérifier que `START_COL = 5` correspond bien à la colonne E

**Les données sont vides**
→ Vérifier le format du fichier CSV (séparateur `;` ou tabulation)
→ Vérifier que le fichier n'est pas vide côté Jeedom
