# Dofus Memory Helper - Spécifications

## Concept
Outil d'assistance pour les jeux de type "Memory" (recherche de paires). L'application se présente sous la forme d'une interface web capable de capturer l'écran de jeu, de détecter une grille de cases, et de mémoriser les symboles dévoilés pour les afficher en temps réel.

## Fonctionnalités Clés
- **Capture Vidéo** : Utilisation de l'API `getDisplayMedia` pour récupérer le flux de la fenêtre du jeu sans installation logicielle.
- **Détection de Grille** : Configuration manuelle ou semi-automatique des zones de la grille sur le canvas.
- **Analyse de Changement** : Surveillance des modifications de pixels dans chaque cellule (détection par variation de couleur ou de contraste).
- **Mémoire Persistante** : Une fois qu'une case est révélée, l'image du symbole est stockée et affichée en surimpression sur l'interface d'aide, même si la case se referme dans le jeu.
- **Modes de Capture** : 
    - Mode Automatique (Polling) : Analyse toutes les X millisecondes.
    - Mode Manuel : Capture déclenchée par une touche.

## Architecture Technique
- **Frontend** : React.js pour l'interface utilisateur.
- **Traitement d'Image** : HTML5 Canvas API pour extraire les frames du flux vidéo et comparer les données de pixels.
- **Logique de Détection** : Algorithme de comparaison de hash d'image simple ou calcul de différence de couleur (Delta E) pour identifier l'ouverture d'une case.

## Workflow de l'Application
1. **Source** : L'utilisateur sélectionne la fenêtre de jeu via le navigateur.
2. **Calibration** : L'utilisateur définit le nombre de lignes/colonnes et ajuste les coins de la grille.
3. **Scan** : L'application boucle sur le flux vidéo. Si une cellule change d'état (couleur différente du fond habituel), elle "photographie" le contenu.
4. **Affichage** : Les symboles trouvés sont affichés sur une grille virtuelle synchronisée.
