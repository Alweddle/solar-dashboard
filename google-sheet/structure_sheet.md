# 📊 Structure du Google Sheet — Data_Solaire

## Vue d'ensemble

Le sheet contient **~660 jours** de données journalières depuis le **01/08/2024**.
Chaque ligne = 1 jour. 34 colonnes calculées automatiquement.

---

## 📥 Colonnes sources (données brutes remontées par Jeedom)

| Col | Nom | Unité | Source |
|---|---|---|---|
| A | Date | dd/mm/YYYY | Jeedom |
| B | Conso J | kWh | Linky via Lixee ZLinky |
| C | Production J | kWh | Hoymiles via OpenDTU |
| D | Injection J | kWh | Linky via Lixee ZLinky |

---

## 🧮 Colonnes calculées (dérivées des données brutes)

### Temps & référence
| Col | Nom | Formule / Description |
|---|---|---|
| E | DateTime | Date au format SQL `YYYY-MM-DD 23:32:00` |

### Production & cumuls (kWh)
| Col | Nom | Formule |
|---|---|---|
| F | Production Cumul kWh | Somme cumulée de la production |
| G | AutoConso J kWh | `Production J - Injection J` |
| H | AutoConso Cumul kWh | Somme cumulée autoconso |
| K | Injection Cumul kWh | Somme cumulée injection réseau |

### Gains financiers (€)
| Col | Nom | Formule |
|---|---|---|
| I | AutoConso J € | `AutoConso J kWh × prix kWh` |
| J | AutoConso Cumul € | Somme cumulée gains autoconso |
| L | Injection J € | `Injection J × tarif injection` |
| M | Injection Cumul € | Somme cumulée gains injection |
| N | Gain J € | `AutoConso J € + Injection J €` |
| O | Gain Cumul € | Somme cumulée gains totaux |
| P | Gain J Moyen € | `Gain Cumul € / Nb jours` |
| Q | Gain Cumul Moyen € | Moyenne glissante |

### Consommation totale
| Col | Nom | Formule |
|---|---|---|
| R | Conso Total J kWh | `Conso J + AutoConso J` (consommation réelle) |
| S | Conso Total Cumul kWh | Somme cumulée conso totale |

### Taux & ratios
| Col | Nom | Formule | Lecture |
|---|---|---|---|
| T | Taux de couverture J | `Production J / Conso Total J` | Part du besoin couverte par le solaire |
| U | Taux de couverture Cumul | Cumul du taux couverture | |
| V | Taux D'AutoConso J | `AutoConso J / Production J` | Part de la prod consommée sur place |
| W | Taux d'injection J | `Injection J / Production J` | Part de la prod revendue/injectée |
| X | Taux D'AutoConso Cumul | Cumul autoconso | |
| Y | Taux d'injection Cumul | Cumul injection | |

### ROI & amortissement
| Col | Nom | Formule |
|---|---|---|
| Z | Taux Amortissement J | Gain J / Coût total installation |
| AA | Taux Amortissement Cumul | Gain Cumul / Coût total installation |
| AB | Nb Jour restant | Jours restants avant amortissement complet |
| AC | Date de fin | Date estimée de remboursement total |
| AD | Nb année | Durée restante en années |

### Segmentation temporelle
| Col | Nom | Valeurs |
|---|---|---|
| AE | SEMAINE | Numéro de semaine (1-52) |
| AF | MENSU | Mois format `mois-YYYY` |
| AG | SAISON | `1 Printemps`, `2 Été`, `3 Automne`, `4 Hiver` |
| AH | ANNEE | Année |

### Autres
| Col | Nom |
|---|---|
| AI | Couverture (label date) |
| AJ | Couverture cumul |
| AK | Euro / kWh (prix du kWh en vigueur ce jour) |

---

## 📈 Indicateurs clés au 20/05/2026

| Indicateur | Valeur |
|---|---|
| Production cumulée | **7 352 kWh** |
| Autoconso cumulée | **2 837 kWh** |
| Injection cumulée | **4 516 kWh** |
| Gains totaux cumulés | **1 353 €** |
| Taux d'autoconso moyen | **40%** |
| Taux de couverture moyen | **30%** |
| Prix kWh moyen | **0,184 €** |
| ROI estimé | **2048** (~22 ans) |

---

## 🔗 Connexion Looker Studio

1. Looker Studio → **Ajouter une source** → **Google Sheets**
2. Sélectionner `Data_Solaire`
3. Activer **"Utiliser la première ligne comme en-tête"**
4. Les 34 colonnes apparaissent comme dimensions/métriques
5. Configurer les types : dates en `Date`, kWh et € en `Nombre`, taux en `Pourcentage`

---

## ⚠️ Notes importantes

- Le prix du kWh varie chaque jour (colonne AK) — il a évolué de **0,1683 → 0,184 €** sur la période
- La dernière ligne (20/05/2026) contient des `#DIV/0!` car la journée n'est pas encore terminée
- Le tarif d'injection peut être différent du tarif d'achat selon ton contrat
- L'alimentation est automatique chaque soir via le scénario Jeedom

