/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/connection.js":
/*!******************************!*\
  !*** ./client/connection.js ***!
  \******************************/
/*! exports provided: onRequestPlay */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"onRequestPlay\", function() { return onRequestPlay; });\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./client/game.js\");\n/* harmony import */ var _shared_settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shared/settings */ \"./shared/settings.js\");\n/* harmony import */ var _shared_settings__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_shared_settings__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _shared_keycodes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/keycodes */ \"./shared/keycodes.js\");\n/* harmony import */ var _shared_keycodes__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shared_keycodes__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n/** @type {ClientGame} */\nlet game = null;\n/** @type {GameState} */\nlet gameState = getInitialState();\nconst canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(\n  \"game\"\n));\nconst gamePage = document.getElementById(\"gamePage\");\n\nconst socket = new WebSocket(`ws://${window.location.host}`);\n\n/** @returns {GameState} */\nfunction getInitialState() {\n  return {\n    players: [],\n    currentPlayerId: null,\n    projectiles: []\n  };\n}\n\n/**\n * Called immediately after user logs in successfully.\n * @param {string} token\n */\nfunction onRequestPlay(token) {\n  socket.send(`USER_CONNECTED#${token}`);\n  let isPressed = {};\n  addEventListener(\"keydown\", evt => {\n    if (!isPressed[evt.keyCode]) {\n      isPressed[evt.keyCode] = true;\n      socket.send(\"KEYDOWN#\" + evt.keyCode);\n    }\n  });\n  addEventListener(\"keyup\", evt => {\n    socket.send(\"KEYUP#\" + evt.keyCode);\n    isPressed[evt.keyCode] = false;\n  });\n  const handlers = {\n    ADD_CURRENT_PLAYER: content => {\n      const player = JSON.parse(content);\n      gameState.players.push(player);\n      gameState.currentPlayerId = player.id;\n      gamePage.style.display = \"flex\";\n      const gameContainer = /** @type {HTMLElement} */ (document.querySelector(\n        \".game-container\"\n      ));\n      gameContainer.style.display = \"flex\";\n      gameContainer.style.maxHeight = _shared_settings__WEBPACK_IMPORTED_MODULE_1__[\"cameraHeight\"] + \"px\";\n      game = new _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas, gameState);\n    },\n    ADD_PLAYER: content => {\n      gameState.players.push(JSON.parse(content));\n    },\n    UPDATE_PLAYER: content => {\n      const { id } = JSON.parse(content);\n      const playerIdx = gameState.players.findIndex(p => p.id === id);\n      gameState.players[playerIdx] = JSON.parse(content);\n    },\n    REMOVE_PLAYER: content => {\n      const id = parseInt(content);\n      if (id === gameState.currentPlayerId) {\n        const respawnMenu = document.getElementById(\"respawnMenu\");\n        const respawnButton = document.getElementById(\"respawnBtn\");\n        respawnMenu.style.display = \"block\";\n        respawnButton.addEventListener(\"click\", () => onRequestPlay(token));\n        game.stop();\n      }\n      gameState.players = gameState.players.filter(p => p.id !== id);\n    },\n    ADD_PROJECTILE: content => {\n      const projectile = JSON.parse(content);\n      gameState.projectiles.push(projectile);\n    },\n    REMOVE_PROJECTILE: content => {\n      const id = parseInt(content);\n      gameState.projectiles = gameState.projectiles.filter(p => p.id !== id);\n    }\n  };\n  socket.onmessage = message => {\n    const splitted = message.data.split(\"#\");\n    const code = splitted[0];\n    const content = splitted[1];\n    handlers[code](content);\n  };\n}\n\n\n//# sourceURL=webpack:///./client/connection.js?");

/***/ }),

/***/ "./client/game.js":
/*!************************!*\
  !*** ./client/game.js ***!
  \************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return ClientGame; });\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types */ \"./types.js\");\n/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_types__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _sprite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sprite */ \"./client/sprite.js\");\n/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/utils */ \"./shared/utils.js\");\n/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_shared_utils__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _shared_settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/settings */ \"./shared/settings.js\");\n/* harmony import */ var _shared_settings__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_shared_settings__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/keycodes */ \"./shared/keycodes.js\");\n/* harmony import */ var _shared_keycodes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_shared_keycodes__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _shared_update__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../shared/update */ \"./shared/update.js\");\n/* harmony import */ var _shared_update__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_shared_update__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\n\nclass ClientGame {\n  /**\n   * @param {HTMLCanvasElement} canvas\n   * @param {GameState} initialState\n   * @param {GameSettings} settings\n   */\n  constructor(canvas, initialState, settings = _shared_settings__WEBPACK_IMPORTED_MODULE_3__) {\n    this.gameState = initialState;\n    this.settings = settings;\n    this.stopped = false;\n\n    addEventListener(\"keydown\", evt => {\n      const currentPlayer = this.gameState.players.find(\n        p => p.id === this.gameState.currentPlayerId\n      );\n      const keycode = evt.keyCode;\n      const { acc, rotationAcc } = settings;\n\n      if (keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"UP\"]) currentPlayer.acc = acc;\n      if (keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"DOWN\"]) currentPlayer.acc = -acc;\n      if (keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"RIGHT\"]) currentPlayer.rotationAcc = rotationAcc;\n      if (keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"LEFT\"]) currentPlayer.rotationAcc = -rotationAcc;\n    });\n\n    addEventListener(\"keyup\", evt => {\n      const currentPlayer = this.gameState.players.find(\n        p => p.id === this.gameState.currentPlayerId\n      );\n      const keycode = evt.keyCode;\n      const { acc, rotationAcc } = settings;\n\n      if (keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"UP\"] || keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"DOWN\"])\n        currentPlayer.acc = 0;\n      if (keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"RIGHT\"] || keycode === _shared_keycodes__WEBPACK_IMPORTED_MODULE_4__[\"LEFT\"])\n        currentPlayer.rotationAcc = 0;\n    });\n\n    this.canvas = canvas;\n    this.canvas.width = settings.cameraWidth;\n    this.canvas.height = settings.cameraHeight;\n    this.ctx = canvas.getContext(\"2d\");\n\n    this.lastRender = 0;\n    requestAnimationFrame(this.loop.bind(this));\n\n    this.sprites = {\n      ship: new _sprite__WEBPACK_IMPORTED_MODULE_1__[\"default\"](\"/assets/ship.svg\")\n    };\n  }\n\n  /**\n   * @param {GameState} state The current game state.\n   * @param {number} progress Time ellapsed since last render in milliseconds.\n   */\n  update(state, progress) {\n    const progressInSeconds = progress / 1000;\n    const { settings } = this;\n    const currentPlayer = state.players.find(\n      p => p.id === state.currentPlayerId\n    );\n\n    _shared_update__WEBPACK_IMPORTED_MODULE_5___default()(state, progress, this.settings);\n  }\n\n  /**\n   * @param {GameState} state\n   */\n  draw(state) {\n    const { settings } = this;\n    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\n    if (this.sprites.ship.loaded) {\n      state.players.forEach(player => {\n        const { playerWidth, playerHeight } = settings;\n        const playerCenterX = player.x + playerWidth / 2;\n        const playerCenterY = player.y + playerHeight / 2;\n        this.ctx.translate(playerCenterX, playerCenterY);\n        this.ctx.rotate(player.rotation);\n        this.ctx.drawImage(\n          this.sprites.ship.image,\n          -playerWidth / 2,\n          -playerHeight / 2,\n          playerWidth,\n          playerHeight\n        );\n        this.ctx.rotate(-player.rotation);\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.fillText(String(player.id), 0, -15);\n        this.ctx.fillStyle = \"#000\";\n        this.ctx.translate(-playerCenterX, -playerCenterY);\n      });\n    }\n    this.ctx.beginPath();\n    state.projectiles.forEach(projectile => {\n      const { projectileRadius } = settings;\n      this.ctx.fillStyle = \"#9c2020\";\n      this.ctx.moveTo(projectile.x, projectile.y);\n      this.ctx.arc(\n        projectile.x,\n        projectile.y,\n        projectileRadius,\n        0,\n        Math.PI * 2\n      );\n      this.ctx.fill();\n      this.ctx.fillStyle = \"#000\";\n    });\n  }\n\n  loop(timestamp) {\n    if (!this.stopped) {\n      const progress = timestamp - this.lastRender;\n      this.update(this.gameState, progress);\n      this.draw(this.gameState);\n      this.lastRender = timestamp;\n\n      requestAnimationFrame(this.loop.bind(this));\n    }\n  }\n\n  stop() {\n    this.stopped = true;\n  }\n}\n\n\n//# sourceURL=webpack:///./client/game.js?");

/***/ }),

/***/ "./client/index.js":
/*!*************************!*\
  !*** ./client/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _login__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login */ \"./client/login.js\");\n/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connection */ \"./client/connection.js\");\n\n\n\n\n//# sourceURL=webpack:///./client/index.js?");

/***/ }),

/***/ "./client/login.js":
/*!*************************!*\
  !*** ./client/login.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../shared/utils */ \"./shared/utils.js\");\n/* harmony import */ var _shared_utils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_shared_utils__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _connection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./connection */ \"./client/connection.js\");\n\n\nconst loginForm = document.getElementById(\"loginForm\");\n\nloginForm.onsubmit = async evt => {\n  evt.preventDefault();\n\n  const submitButton = /** @type {HTMLButtonElement} */ (document.getElementById(\n    \"loginForm_submit\"\n  ));\n  const email = /** @type {HTMLInputElement} */ (document.getElementById(\n    \"loginForm_email\"\n  ));\n  const password = /** @type {HTMLInputElement} */ (document.getElementById(\n    \"loginForm_password\"\n  ));\n\n  submitButton.classList.add(\"btn-loading\");\n  try {\n    const { token, user } = await fetch(`/api/login`, {\n      method: \"POST\",\n      headers: { \"Content-Type\": \"application/json\" },\n      body: JSON.stringify({ email: email.value, password: password.value })\n    })\n      .then(_shared_utils__WEBPACK_IMPORTED_MODULE_0__[\"checkStatus\"])\n      .then(_shared_utils__WEBPACK_IMPORTED_MODULE_0__[\"parseJSON\"]);\n    \n    const loginPage = document.getElementById(\"loginPage\");\n    loginPage.classList.add(\"fade\");\n    sessionStorage.setItem(\"token\", token);\n    sessionStorage.setItem(\"user\", JSON.stringify(user));\n    //@ts-ignore\n    Object(_connection__WEBPACK_IMPORTED_MODULE_1__[\"onRequestPlay\"])(token);\n\n  } catch (err) {\n    alert(err.response.message);\n  }\n  submitButton.classList.remove(\"btn-loading\");\n  return false;\n};\n\n//# sourceURL=webpack:///./client/login.js?");

/***/ }),

/***/ "./client/sprite.js":
/*!**************************!*\
  !*** ./client/sprite.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Sprite; });\nclass Sprite {\n  /** @param {string} path The path of the sprite. */\n  constructor(path) {\n    this.loaded = false;\n    this.image = new Image();\n    this.image.src = path;\n    this.image.onload = () => (this.loaded = true);\n  }\n}\n\n\n//# sourceURL=webpack:///./client/sprite.js?");

/***/ }),

/***/ "./shared/keycodes.js":
/*!****************************!*\
  !*** ./shared/keycodes.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = {\n  LEFT: 37,\n  UP: 38,\n  RIGHT: 39,\n  DOWN: 40,\n  SPACE: 32\n};\n\n\n//# sourceURL=webpack:///./shared/keycodes.js?");

/***/ }),

/***/ "./shared/settings.js":
/*!****************************!*\
  !*** ./shared/settings.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/** @type {GameSettings} */\nmodule.exports = {\n  cameraWidth: 600,\n  cameraHeight: 600,\n  worldWidth: 600,\n  worldHeight: 600,\n  playerWidth: 25,\n  playerHeight: 25,\n  friction: 1,\n  maxSpeed: 100,\n  acc: 150,\n  rotationAcc: 10,\n  maxRotationSpeed: 2,\n  rotationFriction: 2.5,\n  projectileSpeed: 525,//125\n  projectileRadius: 5\n};\n\n\n//# sourceURL=webpack:///./shared/settings.js?");

/***/ }),

/***/ "./shared/update.js":
/*!**************************!*\
  !*** ./shared/update.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ../types */ \"./types.js\");\nconst { clamp, pointInRect } = __webpack_require__(/*! ./utils */ \"./shared/utils.js\");\n\n/**\n * @param {GameState} state The current game state.\n * @param {number} progress Time ellapsed since last render in milliseconds.\n * @param {GameSettings} settings Game Settings\n */\n\nmodule.exports = (state, progress, settings) => {\n  const progressInSeconds = progress / 1000;\n\n  state.players.forEach(player => {\n    const { friction, maxSpeed, rotationFriction, maxRotationSpeed } = settings;\n    player.x += player.xSpeed * progressInSeconds;\n    player.y += player.ySpeed * progressInSeconds;\n\n    const xAcc = Math.cos(player.rotation) * player.acc * progressInSeconds;\n    const yAcc = Math.sin(player.rotation) * player.acc * progressInSeconds;\n    player.xSpeed = clamp(player.xSpeed + xAcc, -maxSpeed, maxSpeed);\n    player.ySpeed = clamp(player.ySpeed + yAcc, -maxSpeed, maxSpeed);\n\n    if (player.xSpeed !== 0)\n      player.xSpeed += player.xSpeed > 0 ? -friction : friction;\n    if (player.ySpeed !== 0)\n      player.ySpeed += player.ySpeed > 0 ? -friction : friction;\n\n    player.rotation += player.rotationSpeed * progressInSeconds;\n\n    if (player.rotationSpeed !== 0)\n      player.rotationSpeed +=\n        (player.rotationSpeed > 0 ? -rotationFriction : rotationFriction) *\n        progressInSeconds;\n    player.rotationSpeed = clamp(\n      player.rotationSpeed + player.rotationAcc * progressInSeconds,\n      -maxRotationSpeed,\n      maxRotationSpeed\n    );\n  });\n\n  state.projectiles.filter(p => !p.dead).forEach(projectile => {\n    const { worldWidth, worldHeight } = settings;\n    projectile.x += projectile.xSpeed * progressInSeconds;\n    projectile.y += projectile.ySpeed * progressInSeconds;\n    projectile.dead = !pointInRect(\n      { x: projectile.x, y: projectile.y },\n      { x: 0, y: 0, width: worldWidth, height: worldHeight }\n    );\n    state.players.filter(p => !p.dead).forEach(player => {\n      const { playerWidth, playerHeight } = settings;\n      player.dead =\n        pointInRect(\n          {\n            x: projectile.x,\n            y: projectile.y\n          },\n          {\n            x: player.x,\n            y: player.y,\n            width: playerWidth,\n            height: playerHeight\n          }\n        ) && player.id !== projectile.playerId;\n    });\n  });\n};\n\n\n//# sourceURL=webpack:///./shared/update.js?");

/***/ }),

/***/ "./shared/utils.js":
/*!*************************!*\
  !*** ./shared/utils.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ../types */ \"./types.js\");\n\n/** Math */\n/**\n * @param {number} value\n * @param {number} min\n * @param {number} max\n * @returns {number}\n */\nmodule.exports.clamp = (value, min, max) => {\n  if (value < min) return min;\n  if (value > max) return max;\n  return value;\n};\n\n/**\n * Check if the point is inside the rectangle.\n * @param {Point} point\n * @param {Rectangle} rect\n * @returns {boolean}\n */\nmodule.exports.pointInRect = (point, rect) => {\n  const { x, y } = point;\n  const topLeft = { x: rect.x, y: rect.y };\n  const bottomRight = { x: rect.x + rect.width, y: rect.y + rect.width };\n  return (\n    point.x > topLeft.x &&\n    point.y > topLeft.y &&\n    point.x < bottomRight.x &&\n    point.y < bottomRight.y\n  );\n};\n\n/** Fetch */\nmodule.exports.checkStatus = async function checkStatus(response) {\n  if (response.status >= 200 && response.status < 300) {\n    return response;\n  } else {\n    const error = new Error(response.statusText);\n    //@ts-ignore\n    error.response = await response.json();\n    throw error;\n  }\n};\n\nmodule.exports.parseJSON = function parseJSON(response) {\n  return response.json();\n};\n\n\n//# sourceURL=webpack:///./shared/utils.js?");

/***/ }),

/***/ "./types.js":
/*!******************!*\
  !*** ./types.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/** Type definitions\n * @typedef {Object} Player\n * @property {number} id\n * @property {number} x\n * @property {number} y\n * @property {number} xSpeed\n * @property {number} ySpeed\n * @property {number} acc The player acceleration.\n * @property {number} rotation Player rotation in radians.\n * @property {number} rotationSpeed\n * @property {number} rotationAcc\n * @property {boolean} [dead=false] Whether the player can be destroyed.\n *\n * @typedef {Object} Projectile\n * @property {number} id\n * @property {number} x\n * @property {number} y\n * @property {number} xSpeed\n * @property {number} ySpeed\n * @property {number} playerId The id of the player that created the projectile.\n * @property {boolean} [dead=false] Whether the projectile can be destroyed.\n *\n * @typedef {Object} GameState\n * @property {number} currentPlayerId\n * @property {Player[]} players\n * @property {Projectile[]} projectiles\n *\n * @typedef {Object} GameSettings\n * @property {number} cameraWidth\n * @property {number} cameraHeight\n * @property {number} worldWidth\n * @property {number} worldHeight\n * @property {number} playerWidth\n * @property {number} playerHeight\n * @property {number} friction\n * @property {number} maxSpeed\n * @property {number} acc The acceleration the player imparts to the ship by pressing KEYCODES.UP or KEYCODES.DOWN.\n * @property {number} rotationAcc The acceleration the player imparts to the ship's rotation by pressing KEYCODES.RIGHT or KEYCODES.LEFt.\n * @property {number} maxRotationSpeed\n * @property {number} rotationFriction\n * @property {number} projectileSpeed\n * @property {number} projectileRadius\n *\n * @typedef {Object} Point\n * @property {number} x\n * @property {number} y\n *\n * @typedef {Object} Rectangle\n * @property {number} x\n * @property {number} y\n * @property {number} width\n * @property {number} height\n *\n * @typedef {Object} GameEvent\n * @property {string} type\n * @property {*} payload\n */\n\n\n//# sourceURL=webpack:///./types.js?");

/***/ })

/******/ });