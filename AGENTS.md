<!-- BEGIN:project-environment-routing -->
## Dépôt GitHub et environnement Vercel

Contrat local établi le 16 octobre 2026 ; les cibles restent à vérifier en direct avant chaque écriture distante.

- Référence locale sur le poste de Robin : `C:/Users/lacombr/Projects/lacomberobin-rgb/perso/pjano`. Sur un autre poste ou après clonage, la racine effective du checkout fait référence ; ces chemins locaux ne sont pas un prérequis.
- Dépôt GitHub attendu : **`lacomberobin-rgb/pjano`**.
- Remote à contrôler pour cette cible : `origin` ; le nom seul ne vaut pas validation.
- État : Aucune cible Vercel établie ici. Ce constat ne prouve pas l’absence d’un hébergement : toute publication nécessite d’abord un projet et une équipe confirmés.

### Vérifications avant chaque push

1. Lire ce contrat, identifier le dépôt et la copie de travail réels avec `git rev-parse --show-toplevel`, puis contrôler `git status --short --branch`, la branche courante et son upstream. Un ancien chemin de compatibilité ou une copie d'audit ne constitue pas une nouvelle cible.
2. Contrôler les URL de lecture **et d'écriture** du remote choisi : `git remote get-url --all <remote>` et `git remote get-url --push --all <remote>`. Vérifier aussi les pushurl, pushInsteadOf/insteadOf et overrides éventuels. Comparer le propriétaire et le nom exacts avec la cible ci-dessus ; ni le nom du dossier, ni celui du remote ne prouvent sa destination. Pour un alias SSH, vérifier son hôte et l'identité réellement reconnue.
3. Vérifier le compte authentifié (`gh api user --jq .login`) et l'accès au dépôt exact (`gh api repos/<propriétaire>/<dépôt>` : full_name et permission push). Pour SSH ou un compte de service différent de la CLI GitHub, vérifier aussi cette identité de transport. L'auteur Git user.name/user.email ne prouve pas le compte authentifié. Ne jamais afficher un jeton.
4. Vérifier la branche distante et le refspec explicite de l'opération ; utiliser si approprié un dry-run vers le même remote et la même branche. Pas de push implicite multi-remote, `--mirror`, `--all`, tags globaux ou force-push déduit de cette consigne. Ne pousser que les commits et fichiers autorisés pour la tâche, après les contrôles proportionnés du projet.
5. Un écart de propriétaire, dépôt, permissions ou branche bloque **uniquement le push** : continuer les préparatifs locaux utiles et résoudre l'écart avant publication. Ne pas retargeter un remote ou changer de compte globalement pour faire passer une commande.

### Vérifications avant chaque déploiement ou changement Vercel

1. Une liaison locale `.vercel/project.json` est un indice, pas une preuve d'autorisation. Vérifier l'équipe (slug **et** team ID), le project ID, le dépôt source réel et la branche de production en direct. Pour une cible identifiée : `vercel whoami --format json`, `vercel project inspect <project-id> --scope <équipe> --non-interactive`, puis contrôler la résolution locale depuis le dossier qui sera réellement utilisé. Employer une lecture API si la CLI ne fournit pas le lien Git. Aucun linking automatique. Pour un projet explicitement décrit ici comme un déploiement technique sans liaison Git, ne pas exiger des champs Git absents côté Vercel : prouver le dépôt et le commit du checkout local, le dossier source et la procédure manuelle de référence. Cette exception ne s'applique pas aux projets dont la liaison Git est simplement inconnue.
2. Vérifier le dossier d'application/rootDirectory (notamment les monorepos), le commit à publier, l'environnement demandé (Preview ou Production) et les domaines/alias du projet exact. Contrôler les overrides VERCEL_ORG_ID/VERCEL_PROJECT_ID et la portée des credentials sans révéler VERCEL_TOKEN ni les secrets. Toujours préciser `--scope <équipe>` ; ce flag ne remplace pas le contrôle du project ID.
3. Un état inconnu, une erreur 403, un projet homonyme ou une provenance issue d'un ancien déploiement ne permettent pas de choisir une autre équipe par défaut. Bloquer la publication jusqu'à confirmation en direct ; ne pas créer de projet, transférer, relier, récupérer des variables ou copier un `.env` d'un autre projet pour contourner l'écart.
4. Appliquer les règles de livraison existantes. Un push peut déclencher un déploiement Git : ne pas le doubler d'un déploiement CLI sans besoin explicite. Une preview n'est pas la production. Ne promouvoir que le commit et la cible autorisés, puis vérifier le SHA publié, l'état du déploiement et l'alias attendu.

Ces contrôles ne demandent pas une nouvelle approbation lorsque l'utilisateur a déjà autorisé l'action et que la cible est vérifiée. Ils ne constituent pas, à eux seuls, une autorisation de pousser, de déployer en production, de supprimer ou de transférer un projet. Les consignes métier existantes restent applicables. En cas de contradiction avec une ancienne identité de template, un ancien compte ou un domaine historique, utiliser ce contrat pour identifier la cible technique et vérifier les faits actuels avant publication.
<!-- END:project-environment-routing -->

