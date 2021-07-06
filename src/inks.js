class Inks {
	constructor() {
		const self = this;
		const _shakingSprites = [];
		const _isPaused = false;

		const update = () => {
			if (_isPaused)
				return;

			if (_shakingSprites.length > 0) {
				for (let i = _shakingSprites.length - 1; i >= 0; i--) {
					let shakingSprite = _shakingSprites[i];
					if (shakingSprite.updateShake)
						shakingSprite.updateShake();
				}
			}

			requestAnimationFrame(update);
		}

		/*******************/
		/* math
		/*******************/

		const randomInt = (min, max) => {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		const toAngle = (radians) => {
			return radians * 180 / Math.PI;
		}

		/*******************/
		/* fx
		/*******************/

		const shake = (element, magnitude = 16, angular = false) => {
			return new Promise((resolve) => {
				let counter = 1,
					numberOfShakes = 50,
					style = getComputedStyle(element),
					startX = parseInt(style.left),
					startY = parseInt(style.top),
					startAngle = 0,
					tiltAngle = 1;

				let magnitudeUnit = magnitude / numberOfShakes;

				if (_shakingSprites.indexOf(element) === -1) {
					_shakingSprites.push(element);

					element.updateShake = function () {
						if (angular) {
							angularShake();
						}
						else {
							upAndDownShake();
						}
					}
				}

				const upAndDownShake = () => {
					if (counter < numberOfShakes) {
						element.style.left = startX + "px";
						element.style.top = startY + "px";

						magnitude -= magnitudeUnit;

						element.style.left = startX + randomInt(-magnitude, magnitude) + "px";
						element.style.top = startY + randomInt(-magnitude, magnitude) + "px";

						counter++;
					}

					if (counter >= numberOfShakes) {
						element.style.left = startX + "px";
						element.style.top = startY + "px";
						_shakingSprites.splice(_shakingSprites.indexOf(element), 1);
						resolve();
					}
				}

				const angularShake = () => {
					if (counter < numberOfShakes) {
						element.style.transform = "rotate(" + startAngle + "deg)";
						magnitude -= magnitudeUnit;
						element.style.transform = "rotate(" + (magnitude * tiltAngle) + "deg)";
						counter++;
						tiltAngle *= -1;
					}

					if (counter >= numberOfShakes) {
						element.style.transform = "rotate(" + startAngle + "deg)";
						_shakingSprites.splice(_shakingSprites.indexOf(element), 1);
						resolve();
					}
				}
			});
		}

		Object.defineProperties(self, {
			math: {
				enumerable: true,
				value: {
					randomInt,
					toAngle
				}
			},

			fx: {
				enumerable: true,
				value: {
					shake
				}
			},

			resume: {
				enumerable: true,
				value: () => {
					_isPaused = false;
				}
			},

			pause: {
				enumerable: true,
				value: () => {
					_isPaused = true;
				}
			},

			isPaused: {
				enumerable: true,
				get: () => {
					return _isPaused;
				}
			}
		});

		update();
	}
}

const inks = new Inks();