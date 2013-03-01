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

  var si = new illustration('illustration', s);

  var init = false;

  $('#staveform').submit(function(event) {

    event.preventDefault();

    /** CHECK VALIDITY **/
    $(this).find('input').each(function() {

      if (this.validity.valid == false)
        $(this).closest('div.control-group').addClass('error');
      else
        $(this).closest('div.control-group').removeClass('error');

    });

    if (this.checkValidity() == false)
      return false;

    /** GET FORM VALUES **/
    s.stave_count = parseInt($.trim($('#stave_count').val()));
    s.shell_diameter = parseFloat($.trim($('#shell_diameter').val()));
    s.shell_depth = parseFloat($.trim($('#shell_depth').val()));
    s.board_thickness = parseFloat($.trim($('#board_thickness').val()));
    s.board_width = parseFloat($.trim($('#board_width').val()));
    s.cost_board_ft = parseFloat($.trim($('#board_cost').val()));
    s.crosscut_kerf = parseFloat($.trim($('#crosscut_kerf').val()));
    s.rip_kerf = parseFloat($.trim($('#rip_kerf').val()));
    s.waste_factor = (parseFloat($.trim($('#waste_factor').val())) / 100) + 1;

    if ($('#lumber').is(':visible')) {
      $('.advanced').show();
      $('#lumber').slideToggle();
    } else {
      $('.advanced').hide();
    }

    /** SET DISPLAY VALUES **/
    $('#display_shell_diameter').html(s.shell_diameter.toFixed(3) + $('#unit').val());
    $('#display_finished_diameter').html(s.shell_diameter.toFixed(3) + $('#unit').val());
    $('#display_shell_depth').html(s.shell_depth.toFixed(1) + $('#unit').val());
    $('#display_stave_count').html(s.stave_count);
    $('#display_board_thickness').html(s.board_thickness.toFixed(3) + $('#unit').val());
    $('#display_rounded_thickness').html(s.roundedThickness().toFixed(3) + $('#unit').val());
    $('#display_staves_per_width').html(s.stavesPerWidth());
    $('#display_staves_per_length').html(s.stavesPerLength());

    $('#display_outer_dimension').html(s.outerDimension().toFixed(3) + $('#unit').val());
    $('#display_inner_dimension').html(s.innerDimension().toFixed(3) + $('#unit').val());
    $('#display_joint_angle').html(s.jointAngle().toFixed(2) + '&deg;');
    $('#display_bevel_angle').html(s.bevelAngle().toFixed(2) + '&deg;');
    $('#display_board_length').html(s.boardLengthRequired().toFixed(3) + $('#unit').val());
    $('#display_board_feet').html(s.boardFeetRequired().toFixed(3) + $('#unit').val());
    $('#display_cost').html('$' + s.shellCost().toFixed(2));

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

  $('#unit').change(function() {

    var unit = $(this).val();

    if(unit == '"') {

      $('span.unit').html('in');

      $('input.unit').each(function(i, el) {

        var converted = s.toInches( parseFloat( $(el).val() ) );

        if($(el).is('#crosscut_kerf') || $(el).is('#rip_kerf'))
          converted = converted.toFixed(5);
        else
          converted = converted.toFixed(3);

        $(el).val(converted);

      });

      s.extra = s.toInches(s.extra);
      si.unit = unit;

    } else if (unit == 'cm') {

      $('span.unit').html('cm');

      $('input.unit').each(function(i, el) {

        var converted = s.toCentimeters( parseFloat( $(el).val() ) );

        if($(el).is('#crosscut_kerf') || $(el).is('#rip_kerf'))
          converted = converted.toFixed(5);
        else
          converted = converted.toFixed(3);

        $(el).val(converted);

      });

      s.extra = s.toCentimeters(s.extra);
      si.unit = '';

    }

  });

  $(window).bind("resize", function() {
    si.resize($('#illustration').width());
  });

});

