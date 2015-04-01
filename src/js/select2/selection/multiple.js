define([
  'jquery',
  './base',
  '../utils'
], function ($, BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection.addClass('select2-selection--multiple');

    $selection.html(
      '<ul class="select2-selection__rendered"></ul>'
    );

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    var _isValidEvent = function(evt) {
      return evt.type === 'click' ||
        (evt.type === 'keydown' && evt.which === 13);
    };

    var _handleChoiceRemoval = function (evt) {
      if(_isValidEvent(evt)) {
        var $remove = $(this);
        var $selection = $remove.parent();

        var data = $selection.data('data');

        self.trigger('unselect', {
          originalEvent: evt,
          data: data
        });
      }
    };

    // handle multiple selection item ADDITION by keypress
    this.$selection.on('keydown', function (evt) {
      if(evt.which === 13) {
        self.trigger('toggle', {
          originalEvent: evt
        });
        evt.stopPropagation();
      }
    });

    // handle multiple selection item ADDITION by click
    this.$selection.on('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    // handle multiple selection item REMOVAL by click and keyup
    this.$selection.on('click', '.select2-selection__choice__remove',
                        _handleChoiceRemoval);
    this.$selection.on('keydown', '.select2-selection__choice__remove',
                        _handleChoiceRemoval);
  };

  MultipleSelection.prototype.clear = function () {
    this.$selection.find('.select2-selection__rendered').empty();
  };

  MultipleSelection.prototype.display = function (data) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data));
  };

  MultipleSelection.prototype.selectionContainer = function (selection) {
    var $container = $(
      '<li class="select2-selection__choice">' +
        '<span class="select2-selection__choice__remove "' +
            'role="presentation" tabindex="0">' +
          '&times;' +
        '</span>' +
      '</li>'
    );

    // provide aria attributes to handle choice removal button
    $('.select2-selection__choice__remove', $container)
      .attr({
        'aria-label': 'Remove ' + selection.text
      });

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = $();

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var formatted = this.display(selection);
      var $selection = this.selectionContainer(selection);

      $selection.append(formatted);
      $selection.prop('title', selection.title || selection.text);

      $selection.data('data', selection);

      $selections = $selections.add($selection);
    }

    this.$selection.find('.select2-selection__rendered').append($selections);
  };

  return MultipleSelection;
});
