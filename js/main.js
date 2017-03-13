$(function() {

	var profiles = {
		linguiste: 0,
		analyste: 0,
		action: 0,
		crypto: 0
	};

	// Lorsque l'on click sur n'importe quel bouton, on gèle tous les boutons présent dans la même <section>
	$('button').click(function() {
		$(this).parents('section').find('button').prop('disabled', true);
	});

	// Lorsque l'on click sur un bouton avec un attribut data-error, affiche un toast avec le contenu de l'attribut
	$('button[data-error]').click(function() {
		toastr.error($(this).data('error'))	;
	});

	// Lorsque l'on click sur un bouton avec un attribut data-success, affiche un toast avec le contenu de l'attribut
	$('button[data-success]').click(function() {
		toastr.success($(this).data('success'))	;
	});

	// Lorsque l'on click sur un bouton sur un attribut data-warning, affiche un toast avec le contenu de l'attribut
	$('button[data-info]').click(function() {
		toastr.info($(this).data('info')) ;
	});

	// Lorsque l'on click sur un buton avec un attribut data-points, ajoute un nombre de point à chaque profile
	$('button[data-points]').click(function() {
		// Créait un tableau avec le nombre de points attribués à chaque profile
		var lines = $(this).data('points').split(',');
		// Lit chaque point
		$(lines).each(function(index, profile) {
			var points = profile.split(':');
			profiles[points[0]] += Number(points[1]);
		});
		//
		console.log(profiles);
	});
});
