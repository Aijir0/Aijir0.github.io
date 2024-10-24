/*
	Read Only by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$titleBar = null,
		$nav = $('#nav'),
		$wrapper = $('#wrapper');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['1025px', '1280px'],
		medium: ['737px', '1024px'],
		small: ['481px', '736px'],
		xsmall: [null, '480px'],
	});

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Tweaks/fixes.

	// Polyfill: Object fit.
	if (!browser.canUse('object-fit')) {

		$('.image[data-position]').each(function () {

			var $this = $(this),
				$img = $this.children('img');

			// Apply img as background.
			$this
				.css('background-image', 'url("' + $img.attr('src') + '")')
				.css('background-position', $this.data('position'))
				.css('background-size', 'cover')
				.css('background-repeat', 'no-repeat');

			// Hide img.
			$img
				.css('opacity', '0');

		});

	}

	// Header Panel.

	// Nav.
	var $nav_a = $nav.find('a');

	$nav_a
		.addClass('scrolly')
		.on('click', function () {

			var $this = $(this);

			// External link? Bail.
			if ($this.attr('href').charAt(0) != '#')
				return;

			// Deactivate all links.
			$nav_a.removeClass('active');

			// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
			$this
				.addClass('active')
				.addClass('active-locked');

		})
		.each(function () {

			var $this = $(this),
				id = $this.attr('href'),
				$section = $(id);

			// No section for this link? Bail.
			if ($section.length < 1)
				return;

			// Scrollex.
			$section.scrollex({
				mode: 'middle',
				top: '5vh',
				bottom: '5vh',
				initialize: function () {

					// Deactivate section.
					$section.addClass('inactive');

				},
				enter: function () {

					// Activate section.
					$section.removeClass('inactive');

					// No locked links? Deactivate all links and activate this section's one.
					if ($nav_a.filter('.active-locked').length == 0) {

						$nav_a.removeClass('active');
						$this.addClass('active');

					}

					// Otherwise, if this section's link is the one that's locked, unlock it.
					else if ($this.hasClass('active-locked'))
						$this.removeClass('active-locked');

				}
			});

		});

	// Title Bar.
	$titleBar = $(
		'<div id="titleBar">' +
		'<a href="#header" class="toggle"></a>' +
		'<span class="title">' + $('#logo').html() + '</span>' +
		'</div>'
	)
		.appendTo($body);

	// Panel.
	$header
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'header-visible'
		});

	// Scrolly.
	$('.scrolly').scrolly({
		speed: 1000,
		offset: function () {

			if (breakpoints.active('<=medium'))
				return $titleBar.height();

			return 0;

		}
	});

})(jQuery);

// Trailing Cursor
const cursor = document.getElementById("cursor");
const clickCircle = document.getElementById("click-circle");

// Variables pour stocker la position actuelle de la souris
let mouseX = 0;
let mouseY = 0;

// Suivi du curseur
document.addEventListener("mousemove", (e) => {
	mouseX = e.clientX; // Mettre à jour la position X de la souris
	mouseY = e.clientY; // Mettre à jour la position Y de la souris

	updateCursorPosition(); // Mettre à jour la position du curseur
});

// Effet de clic
document.addEventListener("mousedown", () => {
	cursor.style.width = "8.5px";  // Proportionnellement réduit
	cursor.style.height = "8.5px";

	clickCircle.style.width = "69px"; // Ajusté proportionnellement
	clickCircle.style.height = "69px";
	clickCircle.style.opacity = "1";
});

document.addEventListener("mouseup", () => {
	cursor.style.width = "13px";
	cursor.style.height = "13px";

	clickCircle.style.width = "0";
	clickCircle.style.height = "0";
	clickCircle.style.opacity = "0";
});

// Gestion du défilement (scroll) pour ajuster la position du curseur
document.addEventListener("scroll", () => {
	updateCursorPosition(); // Mettre à jour la position du curseur lors du défilement
});

// Fonction pour mettre à jour la position du curseur et du cercle d'effet
function updateCursorPosition() {
	const scrollX = window.scrollX;
	const scrollY = window.scrollY;

	cursor.style.top = mouseY + scrollY + "px";
	cursor.style.left = mouseX + scrollX + "px";

	clickCircle.style.top = mouseY + scrollY + "px";
	clickCircle.style.left = mouseX + scrollX + "px";
}

document.querySelectorAll('.tilt-container').forEach(container => {
	container.addEventListener('mousemove', function (e) {
		const img = container.querySelector('img');

		// Récupérer les dimensions et la position de l'élément
		const containerRect = container.getBoundingClientRect();
		const containerWidth = containerRect.width;
		const containerHeight = containerRect.height;

		// Calculer la position de la souris à l'intérieur de l'élément
		const mouseX = e.clientX - containerRect.left;
		const mouseY = e.clientY - containerRect.top;

		// Calculer les angles de rotation en fonction de la position de la souris
		const rotateX = ((mouseY / containerHeight) - 0.5) * 30; // Ajuste la sensibilité
		const rotateY = ((mouseX / containerWidth) - 0.5) * -30;

		// Appliquer les rotations à l'image
		img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
	});

	// Remettre l'image à zéro quand la souris sort de l'élément
	container.addEventListener('mouseleave', function () {
		const img = container.querySelector('img');
		img.style.transform = 'rotateX(0deg) rotateY(0deg)';
	});
});
