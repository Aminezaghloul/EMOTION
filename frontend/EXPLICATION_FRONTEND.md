# Explication complète du frontend — pour débutant

Ce document explique **chaque fichier** créé dans le dossier `frontend/`, **à quoi il sert**,
et **comment tout fonctionne ensemble**. Lis-le dans l'ordre, c'est conçu comme un cours.

---

## 1. Vue d'ensemble : qu'est-ce qu'on a construit ?

On a construit l'**interface utilisateur (UI)** d'une application web qui :

1. Permet à l'utilisateur d'**uploader un fichier audio `.wav`**.
2. Envoie ce fichier à ton **backend FastAPI** (déjà existant dans `main.py`, `predict.py`).
3. Reçoit la prédiction (`Happy`, `Sad`, `Angry`, `Neutral` + score de confiance).
4. Affiche le résultat de manière **belle et animée**.

> 📌 L'application accepte **uniquement les fichiers `.wav`** d'une taille maximale de **5 Mo**.
> Tout autre format ou fichier trop lourd est refusé avec un message d'erreur clair côté frontend.

### Les trois technologies principales

| Technologie | Rôle |
|---|---|
| **React** | Bibliothèque JavaScript pour construire des interfaces avec des composants réutilisables. |
| **Vite** | Outil qui lance un serveur de développement ultra-rapide et qui "compile" ton code pour le navigateur. |
| **Tailwind CSS** | Système de CSS où tu écris des classes courtes (`bg-red-500`, `flex`, `p-4`) au lieu d'écrire du CSS classique. |

À côté, on utilise :
- **Axios** : pour envoyer les requêtes HTTP au backend (alternative moderne à `fetch`).
- **Framer Motion** : pour faire les **animations** (apparition, scale, etc.).
- **Lucide React** : une bibliothèque d'**icônes** SVG (upload, sparkles, etc.).

---

## 2. Structure du projet

```
frontend/
├── public/
│   └── favicon.svg                  ← icône de l'onglet du navigateur
├── src/
│   ├── api/
│   │   └── client.js                ← gère les appels au backend FastAPI
│   ├── components/                  ← tous les "morceaux" de l'interface
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── AnalyzeSection.jsx
│   │   ├── Dropzone.jsx
│   │   ├── AudioPlayer.jsx
│   │   ├── Loader.jsx
│   │   ├── ResultCard.jsx
│   │   ├── HowItWorks.jsx
│   │   └── Footer.jsx
│   ├── utils/
│   │   └── emotions.js              ← infos sur chaque émotion (couleur, emoji…)
│   ├── App.jsx                      ← compose la page entière
│   ├── main.jsx                     ← point d'entrée : injecte React dans la page
│   └── index.css                    ← styles globaux (Tailwind + classes custom)
├── index.html                       ← page HTML de base
├── package.json                     ← liste des dépendances + scripts (npm run dev…)
├── vite.config.js                   ← config Vite (proxy vers le backend)
├── tailwind.config.js               ← config Tailwind (couleurs, animations custom)
├── postcss.config.js                ← config PostCSS (utilisé par Tailwind)
├── .gitignore                       ← fichiers ignorés par Git
├── .env.example                     ← exemple de variables d'environnement
└── README.md                        ← instructions courtes (en anglais)
```

---

## 3. Comment lancer le projet

```bash
# Terminal 1 — lance le backend FastAPI (déjà existant)
uvicorn main:app --host 0.0.0.0 --port 8000

# Terminal 2 — installe et lance le frontend
cd frontend
npm install        # télécharge React, Vite, Tailwind, etc. (juste la 1re fois)
npm run dev        # lance le serveur de développement
```

Puis ouvre **http://localhost:5173** dans ton navigateur.

---

## 4. Explication détaillée de chaque fichier

### 4.1 — `package.json`

C'est la **carte d'identité** du projet. Il contient :

- `"dependencies"` : les bibliothèques nécessaires en production (React, axios…).
- `"devDependencies"` : les outils utilisés uniquement pour développer (Vite, Tailwind…).
- `"scripts"` : les commandes que tu peux lancer avec `npm run <nom>`.

Quand tu fais `npm install`, npm lit ce fichier et télécharge tout dans `node_modules/`.

```json
"scripts": {
  "dev": "vite",          // lance le serveur de dev
  "build": "vite build",  // crée la version production
  "preview": "vite preview"
}
```

---

### 4.2 — `vite.config.js`

Configure Vite. Le bloc important :

```js
proxy: {
  "/api": {
    target: "http://localhost:8000",
    rewrite: (path) => path.replace(/^\/api/, ""),
  },
}
```

Ça veut dire : **toutes les requêtes vers `/api/...` seront redirigées vers `http://localhost:8000/...`**.

Pourquoi ? Parce que le frontend tourne sur le **port 5173** et le backend sur **8000**. Sans proxy,
le navigateur bloquerait les requêtes (problème de **CORS** = sécurité entre origines différentes).

Donc dans le code on appelle `/api/predict` et Vite le transforme en `http://localhost:8000/predict`.

---

### 4.3 — `tailwind.config.js`

Configure Tailwind. On y a ajouté :

- Une **palette de couleurs custom** `ink` (les noirs/bleus très foncés du thème dark).
- Des **animations custom** (`float`, `pulse-glow`, `gradient-shift`, `shimmer`).
- La police **Inter** comme police par défaut.

Ces noms (`bg-ink-900`, `animate-float`, etc.) deviennent utilisables partout dans le code.

---

### 4.4 — `index.html`

Le **squelette HTML** servi au navigateur. Il contient juste :

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

React va prendre la `<div id="root">` et y injecter toute l'application.
On charge aussi la police Google Fonts "Inter" depuis cette page.

---

### 4.5 — `src/main.jsx` — le point d'entrée

C'est le **premier fichier JavaScript exécuté**. Il fait 3 choses :

```jsx
import App from "./App";
import "./index.css";  // charge les styles Tailwind + custom

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

Traduction : "Trouve la `<div id='root'>` dans la page, et affiche dedans le composant `App`."

---

### 4.6 — `src/index.css` — les styles globaux

Ce fichier contient :

1. Les **3 directives Tailwind** :
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
   Elles injectent toutes les classes Tailwind (`bg-red-500`, `flex`…).

2. Des **styles de base** : police, scrollbar custom, sélection de texte colorée.

3. Des **classes custom réutilisables** dans `@layer components` :
   - `.glass` → effet **glassmorphism** (verre dépoli) : fond translucide + flou.
   - `.glass-strong` → version plus opaque.
   - `.gradient-text` → texte avec un dégradé violet/rose/cyan.
   - `.btn-primary` → bouton avec dégradé animé.
   - `.btn-secondary` → bouton secondaire.
   - `.chip` → petite étiquette ronde.

4. Deux classes décoratives importantes :
   - `.bg-aurora` → l'effet "**aurore boréale**" en arrière-plan (les blobs colorés flous).
   - `.bg-grid` → la **grille subtile** en fond pour donner un look "tech".

---

### 4.7 — `src/App.jsx` — la composition de la page

C'est le composant **principal**. Il assemble tous les morceaux dans l'ordre :

```jsx
<Navbar />        // barre du haut
<Hero />          // section d'accroche
<AnalyzeSection /> // upload + résultat
<HowItWorks />    // explication du pipeline
<Footer />        // pied de page
```

Très simple : il importe les composants, et les place les uns après les autres.

---

### 4.8 — `src/api/client.js` — la communication avec le backend

C'est ici qu'on **parle au backend FastAPI**. Le fichier expose deux fonctions :

```js
export async function predictEmotion(file, { onProgress } = {}) {
  const form = new FormData();
  form.append("file", file, file.name);

  const { data } = await api.post("/predict", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => { ... }
  });

  return data;
}
```

**Comment ça marche** :

1. On crée un objet `FormData` (le format pour envoyer un fichier en HTTP).
2. On ajoute le fichier sous le nom **`file`** (c'est ce que ton backend attend dans `main.py`).
3. Axios envoie un `POST` à `/api/predict`.
4. Le navigateur ajoute automatiquement le `Content-Type` correct.
5. On reçoit la réponse JSON : `{ class_name: "Happy", confidence: 0.85 }`.

`onUploadProgress` permet d'afficher la progression de l'upload (utile pour gros fichiers).

---

### 4.9 — `src/utils/emotions.js` — les infos par émotion

Un simple **dictionnaire** qui contient les infos d'affichage de chaque émotion :

```js
Happy: {
  emoji: "😄",
  accent: "#fbbf24",            // couleur principale
  gradient: "from-amber-400 ..." // dégradé Tailwind
  ...
}
```

Plus quelques fonctions utiles :

- `getEmotionMeta(name)` → récupère les infos d'une émotion par son nom (gère majuscule/minuscule).
- `isWavFile(file)` → **vérifie qu'un fichier est bien `.wav`** (par extension ET par MIME type).
- `formatBytes(bytes)` → formate `1024` en `"1 KB"` pour affichage.

C'est un fichier "bibliothèque" — pas d'UI, juste des données et des helpers.

---

### 4.10 — Les composants React

Avant d'expliquer chaque composant, **rappel sur React** :

> Un **composant** est une fonction qui retourne du JSX (du HTML mélangé à du JavaScript).
> Tu peux le réutiliser comme une balise : `<MonComposant />`.
> Tu peux lui passer des **props** (paramètres) : `<MonComposant titre="Salut" />`.
> Il peut avoir un **état interne** avec `useState`.
> Il peut réagir aux changements avec `useEffect`.

#### 4.10.1 — `Navbar.jsx` — la barre du haut

- Logo à gauche, liens au milieu, bouton "Try it now" à droite.
- `motion.header` de Framer Motion → animation d'apparition (slide depuis le haut).
- `sticky top-0` → la barre reste collée en haut quand on scrolle.

#### 4.10.2 — `Hero.jsx` — la section d'accroche

C'est la grande section avec le titre **"Hear the emotion inside every voice"**.

Contient :
- Un **chip** (étiquette) en haut.
- Le **titre** en grand avec le mot "emotion" en dégradé.
- Un **paragraphe descriptif**.
- Deux **boutons** d'action (Start analyzing / How it works).
- Quatre **cartes flottantes** pour les 4 émotions (avec animation `float` qui les fait monter/descendre).

L'arrière-plan utilise les classes `bg-aurora` (blobs colorés) et `bg-grid` (grille fine).

#### 4.10.3 — `AnalyzeSection.jsx` — le cœur de l'application

C'est le composant **principal d'interaction**. Il gère :

```jsx
const [file, setFile] = useState(null);       // le fichier sélectionné
const [loading, setLoading] = useState(false); // chargement en cours ?
const [progress, setProgress] = useState(0);   // progression de l'upload
const [result, setResult] = useState(null);    // le résultat de la prédiction
const [error, setError] = useState("");        // message d'erreur éventuel
```

**Flux utilisateur** :

1. L'utilisateur dépose un fichier dans le `Dropzone` → `handleFile()` est appelé.
2. `handleFile()` valide que c'est bien `.wav`, puis stocke dans `setFile()`.
3. Le fichier apparaît dans le `AudioPlayer` (l'utilisateur peut l'écouter avant de l'envoyer).
4. L'utilisateur clique sur **"Analyze emotion"** → `analyze()` est appelé.
5. `analyze()` met `loading = true`, appelle `predictEmotion(file)`, attend la réponse.
6. Si succès → `setResult(data)` → le `ResultCard` apparaît.
7. Si erreur → `setError(message)` → un encart rouge s'affiche.

`AnimatePresence` (Framer Motion) gère les transitions douces entre Loader / Erreur / Résultat.

#### 4.10.4 — `Dropzone.jsx` — la zone de drag & drop

- **Drag & drop** : on écoute `onDragOver`, `onDragLeave`, `onDrop` sur la div.
- **Click to browse** : un `<input type="file">` caché, déclenché par un click sur la zone.
- **Validation** : deux vérifications sont faites dans l'ordre (voir ci-dessous).
- Si invalide → on affiche une erreur, on n'appelle pas `onFile`.
- Si valide → on appelle la prop `onFile(file)` reçue du parent.

**Logique de validation dans `handleFiles()` :**

```jsx
// Limite de taille : 5 Mo en octets
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // = 5 242 880 octets

// Vérification 1 — format du fichier
if (!isWavFile(file)) {
  setError(t('drop_error'));   // "Seuls les fichiers .wav sont acceptés."
  return;
}

// Vérification 2 — taille du fichier
if (file.size > MAX_SIZE_BYTES) {
  setError(t('drop_size_error')); // "La taille du fichier doit être inférieure à 5 Mo."
  return;
}

onFile(file); // les deux vérifications sont passées → on accepte le fichier
```

```jsx
<input
  type="file"
  accept=".wav,audio/wav,..."  // limite la sélection aux .wav dans la fenêtre OS
  className="hidden"
  ref={inputRef}
/>
```

#### 4.10.5 — `AudioPlayer.jsx` — le lecteur audio

- Utilise la balise HTML5 `<audio>` (cachée).
- `URL.createObjectURL(file)` → crée une URL temporaire pour lire le fichier en mémoire.
- Boutons play/pause/restart, barre de progression custom (stylée avec Tailwind).
- `onTimeUpdate` met à jour la barre en temps réel.
- À la destruction du composant, on appelle `URL.revokeObjectURL` pour libérer la mémoire.

#### 4.10.6 — `Loader.jsx` — l'animation pendant l'analyse

Un loader décoratif qui combine :
- Deux **cercles concentriques** qui pulsent vers l'extérieur (`motion.span` avec scale + opacity).
- 4 **petites barres** qui montent et descendent (façon égaliseur).
- Si on a une `progress` (upload en cours) → barre de progression numérique en plus.

Pas de logique métier, c'est juste visuel.

#### 4.10.7 — `ResultCard.jsx` — l'affichage du résultat

C'est la partie **payante visuellement**. Contient :

- Un **carré coloré** (avec dégradé qui change selon l'émotion) contenant l'emoji.
- Le **nom de l'émotion** en grand, dans la couleur correspondante.
- Une **barre de confiance** animée (de 0% à `confidence%` en 1.1s).
- Un bouton "Try another" qui réinitialise tout.

Astuce : on utilise `getEmotionMeta(result.class_name)` pour récupérer la couleur, l'emoji, le dégradé.
Le composant **change automatiquement de couleur** selon l'émotion sans `if/else` partout.

#### 4.10.8 — `HowItWorks.jsx` — l'explication du pipeline

Section informative avec **4 cartes** : Send WAV → STFT → ResNet-18 → Verdict.

Utilise `whileInView` (Framer Motion) pour faire apparaître les cartes **au scroll** (quand elles
arrivent dans la zone visible).

#### 4.10.9 — `Footer.jsx` — le pied de page

Très simple : logo, copyright, "Built with ❤". Aucune logique.

---

## 5. Comment les données circulent (très important)

```
┌─────────────────────────────────────────────────────────┐
│ Utilisateur                                             │
└────────────────────────┬────────────────────────────────┘
                         │
                  upload un .wav
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Dropzone.jsx                                            │
│  → valide que c'est un .wav (isWavFile)                 │
│  → appelle onFile(file) (prop)                          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ AnalyzeSection.jsx (parent)                             │
│  → setFile(file)                                        │
│  → l'utilisateur clique "Analyze emotion"               │
│  → setLoading(true)                                     │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ api/client.js — predictEmotion(file)                    │
│  → POST /api/predict avec FormData                      │
└────────────────────────┬────────────────────────────────┘
                         │
                  (proxy Vite)
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ Backend FastAPI — main.py @ /predict                    │
│  → predict.py traite l'audio                            │
│  → renvoie { class_name, confidence }                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ AnalyzeSection.jsx                                      │
│  → setResult(data)                                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ ResultCard.jsx                                          │
│  → affiche emoji, label, confiance, dégradé             │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Concepts React à retenir

### 6.1 — Les **props**

Une prop est un paramètre qu'on passe à un composant.

```jsx
<Dropzone onFile={handleFile} disabled={loading} />
```

Dans `Dropzone.jsx`, on les reçoit comme ça :

```jsx
export default function Dropzone({ onFile, disabled }) { ... }
```

### 6.2 — `useState`

Permet de stocker une valeur qui peut **changer dans le temps**, et **redéclencher l'affichage** quand elle change.

```jsx
const [file, setFile] = useState(null);
// file = la valeur actuelle
// setFile = la fonction pour la changer
```

Quand on appelle `setFile(monFichier)`, React **redessine** automatiquement le composant.

### 6.3 — `useEffect`

Permet de lancer du code **quand quelque chose change** (ou au montage du composant).

```jsx
useEffect(() => {
  if (!file) return;
  const url = URL.createObjectURL(file);
  // ...
  return () => URL.revokeObjectURL(url); // nettoyage
}, [file]); // ← exécuté à chaque fois que `file` change
```

### 6.4 — `useRef`

Permet de garder une référence vers un élément du DOM ou une valeur qui ne déclenche pas de re-render.

```jsx
const inputRef = useRef(null);
// ...
<input ref={inputRef} />
// ...
inputRef.current.click(); // accès direct à l'élément HTML
```

### 6.5 — `async/await`

Pour appeler une API qui prend du temps :

```jsx
const analyze = async () => {
  setLoading(true);
  try {
    const data = await predictEmotion(file);
    setResult(data);
  } catch (e) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};
```

`try/catch/finally` capture les erreurs et garantit qu'on enlève le loader, même si ça plante.

---

## 7. Concepts CSS / Tailwind à retenir

### 7.1 — Les utility classes

Au lieu de :

```css
.mon-bouton { padding: 16px; background: blue; border-radius: 9999px; }
```

Avec Tailwind, dans le HTML :

```jsx
<button className="px-4 py-4 bg-blue-500 rounded-full">
```

Les classes signifient :
- `px-4` → padding-x = 16px
- `py-4` → padding-y = 16px
- `bg-blue-500` → background couleur bleue niveau 500
- `rounded-full` → border-radius infini (cercle/pilule)

### 7.2 — Le glassmorphism

Effet "verre dépoli" :

```css
background: rgba(255, 255, 255, 0.04);   /* blanc très transparent */
backdrop-filter: blur(18px);             /* flou ce qu'il y a derrière */
border: 1px solid rgba(255, 255, 255, 0.08); /* fine bordure claire */
```

C'est la classe `.glass` qu'on a définie dans `index.css`.

### 7.3 — Les gradients

```jsx
bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400
```

→ dégradé qui va du **haut-gauche vers bas-droite** (`to-br` = to bottom-right),
violet → fuchsia → cyan.

### 7.4 — Le responsive

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

- 1 colonne par défaut (mobile).
- 2 colonnes à partir de **sm** (≥ 640px).
- 4 colonnes à partir de **lg** (≥ 1024px).

---

## 8. Modification du backend

Un **seul** changement a été fait dans le backend, dans `main.py` :

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Pourquoi ?** Le navigateur bloque par défaut les requêtes vers un autre domaine/port (sécurité CORS).
On dit ici à FastAPI : "tu peux accepter les requêtes venant de n'importe quelle origine".

En production, tu remplaceras `["*"]` par la vraie URL de ton frontend pour plus de sécurité.

---

## 9. Restrictions sur les fichiers uploadés

### 9.1 — Règles appliquées

| Règle | Valeur |
|---|---|
| **Format accepté** | `.wav` uniquement |
| **Taille maximale** | **5 Mo** (5 242 880 octets) |

### 9.2 — Pourquoi ces restrictions ?

**Pourquoi uniquement `.wav` ?**
Le modèle ResNet-18 côté backend (`predict.py`) est entraîné sur des spectrogrammes STFT
générés à partir de fichiers WAV bruts. D'autres formats (mp3, ogg…) auraient besoin d'une
conversion supplémentaire que le backend ne fait pas.

**Pourquoi 5 Mo maximum ?**
- **Performance** : un fichier trop grand prend plus de temps à uploader et à traiter.
- **Mémoire du backend** : le modèle charge tout le fichier en RAM pour calculer le spectrogramme.
- **UX** : pour la reconnaissance d'émotion, un clip court (< 10 secondes à 16kHz) suffit.
  Un fichier WAV de 10 secondes en mono 16kHz pèse environ **320 Ko** — bien en dessous de 5 Mo.

### 9.3 — Comment fonctionne la validation côté frontend ?

La validation se passe dans `src/components/Dropzone.jsx`, dans la fonction `handleFiles()`.
Elle est exécutée **avant** d'envoyer quoi que ce soit au serveur, ce qui évite des requêtes inutiles.

```
Fichier reçu (drag & drop ou clic)
        │
        ▼
┌─────────────────────────────┐
│ isWavFile(file) = false ?   │ → oui → Erreur : "Seuls les fichiers .wav sont acceptés."
└──────────────┬──────────────┘
               │ non
               ▼
┌─────────────────────────────┐
│ file.size > 5 242 880 ?     │ → oui → Erreur : "La taille du fichier doit être inférieure à 5 Mo."
└──────────────┬──────────────┘
               │ non
               ▼
        onFile(file) ✓   ← le fichier est accepté et transmis à AnalyzeSection
```

### 9.4 — Comment changer la limite de taille ?

Ouvre [src/components/Dropzone.jsx](src/components/Dropzone.jsx) et modifie cette ligne :

```js
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo
//                    ↑
//         Change ce chiffre pour une autre limite
//         Ex: 10 * 1024 * 1024  →  10 Mo
```

N'oublie pas aussi de mettre à jour le message affiché dans l'UI (`max 5 MB`) dans le JSX
du même fichier, et les messages d'erreur dans `src/utils/translations.js`.

---

## 10. Si tu veux modifier quelque chose…

| Tu veux… | Va dans… |
|---|---|
| Changer le titre de la page d'accueil | `src/components/Hero.jsx` |
| Ajouter une émotion | `src/utils/emotions.js` (côté front) **ET** `predict.py` (côté back) |
| Changer les couleurs | `tailwind.config.js` + `src/index.css` |
| Changer l'URL du backend | crée `frontend/.env` avec `VITE_API_BASE_URL=https://...` |
| Ajouter un nouveau composant | crée un `.jsx` dans `src/components/` et importe-le où tu veux |
| Modifier l'animation du loader | `src/components/Loader.jsx` |
| Changer le message d'erreur "Only .wav files" | `src/components/Dropzone.jsx` et `src/components/AnalyzeSection.jsx` |

---

## 11. Mots-clés à retenir (glossaire)

- **JSX** : la syntaxe HTML-dans-JS de React.
- **Composant** : une fonction qui retourne du JSX.
- **Props** : les paramètres d'un composant.
- **State** : la "mémoire" interne d'un composant (`useState`).
- **Hook** : une fonction commençant par `use` (`useState`, `useEffect`, `useRef`).
- **FormData** : objet pour envoyer des fichiers en HTTP.
- **Blob / File** : objets pour représenter du contenu binaire (fichiers, audio).
- **CORS** : règle de sécurité du navigateur entre origines différentes.
- **Proxy** : redirection automatique de requêtes (Vite le fait pour `/api`).
- **Glassmorphism** : effet visuel "verre dépoli".
- **Spectrogramme** : image qui représente les fréquences d'un son dans le temps (ce que ton modèle voit).
- **STFT** : Short-Time Fourier Transform → l'algo qui crée le spectrogramme.

---

Voilà ! Tu as maintenant une vue complète du frontend. Si tu veux approfondir un point, ouvre le
fichier correspondant — chaque morceau est court et lisible.
