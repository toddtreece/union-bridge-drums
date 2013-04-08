/**
 *
 * Union Bridge Drum Co. Stave Calculator
 * Copyright 2012 Todd Treece
 * todd@unionbridge.org
 *
 * This file is part of the Union Bridge Drum Co. Stave Calculator.
 *
 * The Union Bridge Drum Co. Stave Calculator is free software:
 * you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published bythe Free
 * Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * The Union Bridge Drum Co. Stave Calculator is distributed
 * in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
 * Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with The Union Bridge Drum Co. Stave Calculator.  If not,
 * see <http://www.gnu.org/licenses/>.
 *
 */

$(document).ready(function() {

  var s = new stave();
  var r = new ruler();

  var si = new illustration('illustration', s);

  var init = false;

  $('input.info').popover({trigger: 'focus'})

  $('#staveform').submit(function(event) {

    event.preventDefault();

    /** CHECK VALIDITY **/
    $(this).find('input').each(function() {

      if(this.validity.valid == false)
        $(this).closest('div.control-group').addClass('error');
      else
        $(this).closest('div.control-group').removeClass('error');

    });

    if(this.checkValidity() == false)
      return false;

    var unit = $('select[name=unit]').val();

    $(this).find('input').each(function() {

      var val;

      // convert cm to inches for calculations
      if($(this).data('unit') == 'cm')
        val = r.toInches(parseFloat($(this).val()));
      else
        val = parseFloat($(this).val());

      s[$(this).attr('name')] = val;

    });

    var results = {
      'stave_count': s.stave_count,
      'staves_per_width': s.stavesPerWidth(),
      'staves_per_length': s.stavesPerLength(),
      'joint_angle': s.jointAngle().toFixed(2),
      'bevel_angle': s.bevelAngle().toFixed(2),
      'cost': s.shellCost().toFixed(2),
      'board_feet': s.boardFeetRequired().toFixed(2),
      'decimal': {},
      'fraction': {},
      'cm': {}
    };

    results.decimal = {
      'rough_diameter': s.externalDiameter().toFixed(4),
      'finished_diameter': s.finishedDiameter().toFixed(4),
      'shell_depth': s.shell_depth.toFixed(2),
      'board_thickness': s.board_thickness.toFixed(3),
      'rounded_thickness': s.roundedThickness().toFixed(3),
      'outer_dimension': s.outerDimension().toFixed(3),
      'inner_dimension': s.innerDimension().toFixed(3),
      'board_length': s.boardLengthRequired().toFixed(3)
    };

    $.each(results.decimal, function(key, val) {
      results.fraction[key] = r.toFraction(val);
      results.cm[key] = r.toCentimeters(val).toFixed(2);
    });

    var temp = $('#result_template').html(),
        rendered = $.mustache(temp, results);

    $('#results').html(rendered);

    if (init) {
      si.resize($('#illustration').width());
    } else {

      $('#logo').fadeOut('slow', function() {
        $('#illustration').show();
        $('#results').show();
        si.resize($('#illustration').width());
        init = true;
      });

    }

  });

  $('select[name=unit]').change(function() {

    var unit = $(this).val();

    $('input.unit').each(function(i, el) {

      var converted;

      if($(this).data('unit') == 'in' && unit != 'in')
        converted = r.toCentimeters( parseFloat( $(this).val() ) );
      else if ($(this).data('unit') == 'cm' && unit != 'cm')
        converted = r.toInches( parseFloat( $(this).val() ) );

      converted = converted.toFixed($(this).data('precision'));

      $(this).data('unit', unit);
      $(this).val(converted);

      $(this).next().html(unit);

    });

    si.unit = unit;

  });

  $('span.unit').click(function() {

    var unit = $(this).prev().data('unit');

    if(unit == 'in') {

      var input = $(this).prev(),
          converted = r.toCentimeters( parseFloat( input.val() ) );

      input.data('unit', 'cm');
      input.val( converted.toFixed( input.data('precision') ) );

      $(this).html('cm');

    } else {

      var input = $(this).prev(),
          converted = r.toInches( parseFloat( input.val() ) );

      input.data('unit', 'in');
      input.val( converted.toFixed( input.data('precision') ) );

      $(this).html('in');

    }

  });

  $(window).bind("resize", function() {
    si.resize($('#illustration').width());
  });

});

