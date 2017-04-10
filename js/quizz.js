$(function() {
    var profiles = {
        linguiste: 0,
        analyste: 0,
        action: 0,
        crypto: 0
    };

    var minPointsByProfile = {
        linguiste: 28,
        analyste: 29,
        action: 37,
        crypto: 34,
    };

    var overlay = {
      selectedSection: null,
      setSection: function(val) {
        this.selectedSection = val;
      },
      findNextSection: function() {
        var currentIdx = $('section[id]').index($('section[id]:visible'));
        return $('section[id]').eq(currentIdx + 1).attr('id');
      },
      default: function(msg, cls, next) {
        next = next || this.selectedSection || this.findNextSection();
        $(".overlay .content").html(msg);
        $(".overlay").attr('class', 'overlay overlay--' + cls).fadeIn();
        $(".overlay .btn").off('click').on('click', function() {
          // Display the rright section
          if(next) displaySection(next);
          // Hide the overlay
          $(".overlay").fadeOut();
        });
      },
      error: function(msg, next) {
        this.default(msg, 'error', next);
      },
      success: function(msg, next) {
        this.default(msg, 'success', next);
      }
    };

    $('form').submit(function(evt) {
        evt.preventDefault();
        var sectionId = $(this).closest('section').attr('id');
        var next = $(this).data('next');
        switch (sectionId) {
            case 'choix-langues':
              if(!evt.target.cancelled) {
                answers.languages = $('#choix-langues select').val();
              }

              if (answers.languages.length == 0) return selectSection('geographie');
              return selectSection(next);
              break;
            case 'test-langues':
                var lang = evt.target.parentElement.id.split('-')[1];
                var idLang = answers.languages.indexOf(lang);
                answers.languages.splice(idLang,1);
                if(answers.languages.length === 0) return selectSection('geographie');
                return selectSection('test-langues');
                break;
            default:
                console.log('default')
                return selectSection(next);
        }
    });

    // Lorsque l'on click sur n'importe quel bouton, on gèle tous les boutons présent dans la même <section>
    // $('button:not(.dropdown-toggle)').click(function() {
    //     $(this).parents('section').find('button').prop('disabled', true);
    // });

    // Lorsque l'on click sur un bouton avec un attribut data-error, affiche un toast avec le contenu de l'attribut
    $('button[data-error]').click(function() {
      setTimeout(function() {
        overlay.error($(this).data('error'));
      }.bind(this), 50);
    });

    // Lorsque l'on click sur un bouton avec un attribut data-success, affiche un toast avec le contenu de l'attribut
    $('button[data-success]').click(function() {
      setTimeout(function() {
        overlay.success($(this).data('success'));
      }.bind(this), 50);
    });

    //////CARTE
    // Lorsqu'on clique sur un pays de la carte qui n'est pas le Kenya, on a perdu
    $('#carte-quizz path:not(#Kenia)').click(function() {
        if (answers.wrongCountries === 0) {
          overlay.error('Nous vous accordons exceptionnellement une deuxième chance. Ne la gaspillez pas !', null);
          // Augmente le compteur de mauvais pays
          answers.wrongCountries++;
        } else {
          overlay.error('Vous êtes nul en géographie, ou vos doigts sont trop gros pour viser dans le mille ?', 'histoire');
        }
    });
    // Lorsqu'on clique sur le Kenya, on a gagné
    $('#carte-quizz path#Kenia').click(function() {
        if (answers.wrongCountries === 0) {
          overlay.success('Bravo, en plein dans le mille!', 'histoire');
        } else {
          overlay.success('C\'est beaucoup mieux. Tâchez de rester concentré(e) !', 'histoire');
        }
    });
    ////////

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

    function selectSection(id) {
      overlay.setSection(id);
    }

    function updateFinalResult() {
      var validated = '';
      // Trouve le profile qui a le plus de points et qui est valide
      $.each(profiles, function(key, points) {
        if(points >= minPointsByProfile[key]) {
          if(validated === '' || points >= profiles[validated]) {
            validated = key;
          }
        }
      });
      // Affiche le bon profile à la fin
      $("#finale [data-profile='" + validated + "']").removeClass('hidden');
    }

    function displaySection(id) {
        $('section').hide();
        $('section#' + id).show();
        updateFinalResult();

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
