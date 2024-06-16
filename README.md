# Jeu de Football au Tour par Tour

Ce projet est une simulation de match de football au tour par tour. Le jeu permet aux joueurs de prendre des décisions tactiques en passant, tirant et dribblant pour marquer des buts et gagner le match.

## Fonctionnalités

- **Passer** : Passez la balle à un coéquipier.
- **Tirer** : Tentez de marquer un but.
- **Commentaire en direct** : Affiche un commentaire en temps réel des actions du jeu.
- **Animation de dé** : Affiche une animation de dé pour chaque action.
- **Score et Tours** : Suivi du score et du nombre de tours.

## Structure des fichiers

├── index.html <br/>
├── style.css <br/>
├── js <br/>
│ ├── main.js <br/>
│ ├── constants.js  <br/>
│ ├── models <br/>
│ │ ├── Ball.js <br/>
│ │ ├── Game.js <br/>
│ │ ├── Player.js <br/>
│ │ ├── Team.js <br/>
└── README.md <br/>


## Fichiers et Rôles

- **index.html** : Contient la structure de base du HTML pour le jeu.
- **style.css** : Contient les styles pour le jeu, y compris les positions des joueurs et les animations.
- **js/main.js** : Point d'entrée du JavaScript qui initialise le jeu et gère les événements de clic.
- **js/constants.js** : Contient les constantes utilisées dans le jeu, telles que les ordres des équipes.
- **js/models/Ball.js** : Définit la classe `Ball` qui gère la position de la balle et le joueur en possession.
- **js/models/Game.js** : Définit la classe `Game` qui gère la logique principale du jeu, les actions et les mises à jour de l'interface utilisateur.
- **js/models/Player.js** : Définit la classe `Player` qui gère les informations sur les joueurs.
- **js/models/Team.js** : Définit la classe `Team` qui gère les équipes et l'affectation des joueurs aux zones.

## Instructions pour exécuter le projet

1. Clonez le dépôt :
   ```sh
   git clone <URL_du_dépôt>
Ouvrez le fichier index.html dans votre navigateur.
Objectifs du Projet
L'objectif de ce projet est de créer un jeu de football au tour par tour où les joueurs peuvent simuler des matchs en prenant des décisions tactiques. Le jeu utilise des animations et des commentaires en direct pour améliorer l'expérience utilisateur.

Fonctionnalités Futures
Amélioration de l'IA des joueurs.
Ajout de différents types d' action spécial et dribble.
Mise en œuvre de formation d'équipe.