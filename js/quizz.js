$(function() {
    var profiles = {
        linguiste: 0,
        analyste: 0,
        action: 0,
        crypto: 0
    };

    // Affiche le toastr 5 secondes (avant toute interaction)
    toastr.options.timeOut = 5 * 1000;
    // Affiche le toastr 5 secondes après une interaction
    toastr.options.extendedTimeOut = toastr.options.timeOut;
    // Affiche une progress bar dans le toastr
    toastr.options.progressBar = true;

    // Lorsque l'on click sur n'importe quel bouton, on gèle tous les boutons présent dans la même <section>
    // $('button:not(.dropdown-toggle)').click(function() {
    //     $(this).parents('section').find('button').prop('disabled', true);
    // });

    // Lorsque l'on click sur un bouton avec un attribut data-error, affiche un toast avec le contenu de l'attribut
    $('button[data-error]').click(function() {
        toastr.error($(this).data('error'));
    });

    // Lorsque l'on click sur un bouton avec un attribut data-success, affiche un toast avec le contenu de l'attribut
    $('button[data-success]').click(function() {
        toastr.success($(this).data('success'));
    });

    //////CARTE
    // Lorsqu'on clique sur un pays de la carte qui n'est pas le Kenya, on a perdu
    $('#carte-quizz path:not(#Kenia)').click(function() {
        if (answers.wrongCountries === 0) {
          toastr.error('Nous vous accordons exceptionnellement une deuxième chance. Ne la gaspillez pas !');
          // Augmente le compteur de mauvais pays
          answers.wrongCountries++;
        } else {
          toastr.error('Vous êtes nul en géographie, ou vos doigts sont trop gros pour viser dans le mille ?');
          displaySection('histoire');
        }
    });
    // Lorsqu'on clique sur le Kenya, on a gagné
    $('#carte-quizz path#Kenia').click(function() {
        if (answers.wrongCountries === 0) {
            toastr.success('Bravo, en plein dans le mille!');
            displaySection('histoire');
        } else {
            toastr.success('C\'est beaucoup mieux. Tâchez de rester concentré(e) !');
            displaySection('histoire');
        }
    });
    ////////

    // Lorsque l'on click sur un bouton sur un attribut data-warning, affiche un toast avec le contenu de l'attribut
    $('button[data-info]').click(function() {
        toastr.info($(this).data('info'));
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

    // Bootstrap select
    $('.selectpicker').selectpicker({
        style: 'btn-info',
        size: 4
    });

    //Réponses sauvegardées
    var answers = {
        'languages': [],
        'wrongCountries': 0
    }

    displaySection('choix-langues');

    $('form').submit(function(evt) {
        evt.preventDefault();
        var sectionId = $(this).closest('section').attr('id');
        var next = $(this).data('next');
        switch (sectionId) {
            case 'choix-langues':
              if(!evt.target.cancelled) {
                answers.languages = $('#choix-langues select').val();
              }
              if (answers.languages.length == 0) return displaySection('geographie');
              return displaySection(next);
              break;
            case 'test-langues':
                var lang = evt.target.parentElement.id.split('-')[1];
                var idLang = answers.languages.indexOf(lang);
                answers.languages.splice(idLang,1);
                if(answers.languages.length === 0) return displaySection('geographie');
                return displaySection('test-langues');
                break;
            default:
                console.log('default')
                return displaySection(next);
        }
    });

    function displaySection(id) {
        $('section').hide();
        $('section#' + id).show();

        switch (id) {
            case 'test-langues':
                $('#test-langues div').hide();
                answers.languages.forEach(function(val) {
                    $('div#test-' + val).show();
                });
                break;
            default:
                break;
        }

        var url = $('section#' + id).data('background');
        if (url) {
          $('.main-background').css("background-image", "url(" + url + ")");
        }
    }
});
