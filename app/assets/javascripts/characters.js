var currentCharacter = {}
var showForm = false;
var editingCharacter;

$(document).ready( function() {

  function getCharacter(id) {
    $.ajax{(
      url: '/games/:game_id/characters' + id,
      type: 'GET'
    )}.done( function(character) {
      if (editingCharacter) {
        var li = $("[data-id'" + id + "'").parents('li');
        $(li).replaceWith(character);
        editingCharacter = null;
      } else {
        $('#characters-list').append(game);
      }
    });
  }

  function toggle() {
    showForm = !showForm;
    $('#game-form').remove();
    $('#games-list').toggle();

    if (showForm) {
      let data = {};
      if (editingCharacter)
        data.id = editingCharacter;
      $.ajax({
        url: "/character_form",
        type: 'GET',
        data: data
      }).done( function(html) {
        $('#toggle').after(html);
      });

    }
  }

  $(document).on('click', '#edit-character', function() {
    editingGame = $(this).siblings('.character-item').data().id;
    toggle();
  });

  $(document).on('click', '#delete-character', function() {
    var id = $(this).siblings('.character-item').data().id;
    $.ajax({
      url: '/games/:game_id/characters' + id,
      type: 'DELETE'
    }).done( function() {
      var row = $("[data-id='" + id + "'").parents('li');
      row.remove();
    });
  });

  $(document).on('submit', '#character-form form', function (e) {
    e.preventDefault();
    var params = $(this).serializeArray();
    var url = '/games/:game_id/characters';
    var method = 'POST';

    if(editingCharacter) {
      url = url + '/' + editingCharacter;
      method = 'PUT'
    }

    $.ajax({
      url: url,
      type: method,
      data: params
    }).done(function (character) {
      toggle();
      getCharacter(character.id);
    }).fail( function(err) {
      alert(err.responseJSON.errors);
    });
  });

  $('#toggle').on('click', function() {
    toggle();
  });

  $(document).on('click', .'character-item', function() {
    currentCharacter.id = this.dataset.id
    currentCharacter.name = this.dataset.name
    $.ajax({
      url: '/games/' + currentCharacter.id + '/characters',
      type: 'GET'
    }).done( function(characters) {
      $('#character').text('Characters in ' + currentCharacter.name);
      var list = $('#characters');
      list.empty();
      characters.forEach( function(char) {
        var li = '<li data-character-id="' + char.id + '">' + char.name + ' - ' + char.power + '</li>'
        list.append(li);
      })
    })
  })

})
