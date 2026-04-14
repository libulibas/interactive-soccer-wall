# Interactive Soccer Wall

A fullscreen, touch-friendly target-popping game built for **interactive projection LED walls**. Players tap or click glowing targets as fast as they can before the 30-second timer runs out.

---

## Demo

![Game screens: Start → Gameplay → End screen]

> Designed to run fullscreen on large projection walls with touch or mouse input.

---

## Gameplay

- Targets pop up randomly across the screen.
- **Click or tap** a target to score points and make it burst.
- **Regular targets** (red) → **+10 points**
- **Special golden targets** (20% spawn chance) → **+25 points**, but they disappear faster!
- The spawn rate increases as the clock winds down — the last 10 seconds get intense.
- Final score is shown on the end screen with options to retry or return to the start.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Shell    | Python + [pywebview](https://pywebview.flowrl.com/) |
| UI       | HTML5 / CSS3 / Vanilla JavaScript |
| Renderer | Chromium (via pywebview)          |

The game logic runs entirely in the browser layer. Python's only job is to open a fullscreen chromium window pointing at `index.html`, making the app portable and easy to package.

---

## Getting Started

### Prerequisites

- Python 3.8+
- pip

### Install dependencies

```bash
pip install pywebview
```

### Run

```bash
python main.py
```

The game launches immediately in fullscreen. Press **Alt+F4** (or the in-game Close button) to exit.

---

## Packaging as a standalone `.exe`

You can ship the game as a single executable using PyInstaller:

```bash
pip install pyinstaller
pyinstaller --onefile --windowed --add-data "index.html;." --add-data "style.css;." --add-data "app.js;." main.py
```

The `get_base_path()` helper in `main.py` handles the `sys._MEIPASS` path resolution automatically when running from a PyInstaller bundle.

---

## Project Structure

```
interactive_soccer_wall/
├── main.py        # Python entry point — opens fullscreen webview window
├── index.html     # Game layout and screen structure
├── style.css      # Glassmorphism UI, target animations, HUD styles
└── app.js         # All game logic: spawning, scoring, timer, events
```

---

## Configuration

All core game parameters are at the top of [app.js](app.js):

| Constant            | Default | Description                          |
|---------------------|---------|--------------------------------------|
| `GAME_DURATION`     | `30`    | Round length in seconds              |
| `INITIAL_SPAWN_RATE`| `800`   | Starting ms between target spawns    |
| `MAX_TARGETS`       | `7`     | Maximum simultaneous targets on screen |

---

## License

MIT
