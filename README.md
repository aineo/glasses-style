# glasses-style
Glasses try on project with stylization

## Setup project

Clone the repository

```sh
  git clone https://github.com/aineo/glasses-style.git
```

Go to folder

```sh
  cd glasses-style
```

Install of dependencies

```sh
  npm i
```

Build

```sh
  npm run build
```

## Run
1. Run on desktop

```sh
  npm run start
```

And go to  [`http://localhost:2025/glasses-style`](http://localhost:2025/glasses-style)

2. Run on mobile (with https)

For run with https for camera on mobile devices create directory with name `.cert` and copy your generated certificate `cert.pem` and key `key.pem` to there. Run in terminal

```sh
  npm run start:https
```

To launch the widget on mobile devices, follow the `Network` link under `Local` in terminal

```
https://<ip_desktop>:2025/glasses-style
```

## Lint & prettify project
Lint

```sh
  npm run lint
```

Prettify

```sh
  npm run prettify
```

## Modes & features

Available next features for `<feature>` in `http://localhost:2025/glasses-style?<feature>` or running modes `mode=<mode>` in `http://localhost:2025/glasses-style?mode=<mode>`:

Running modes:
* `mode=glasses` or default without specifying - glasses virtual try on
* `mode=selfie` - selfie segmentation with background changing, hair and clothes colorization
* `mode=all` - simultaneous launch of modes `glasses` and `selfie`

Features:
* `stylization` - add stylization button on GUI for mediapipe selfie stylization (experimental)
* `video-filtering` - frontal video filtering by shaders
