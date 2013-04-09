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

function illustration(el, sc) {

  this.background = 'whiteSmoke';
  this.width = 600;
  this.height = this.width;
  this.unit = 'in';

  this.paper = new Raphael(el, this.width, this.height);
  this.stave = sc;
  this.ruler = new ruler();

  this.draw = function() {

    this.paper.clear();

    for (var i = 0; i < this.stave.stave_count; i++) {

      var angle = this.stave.jointAngle() * i;

      this.drawStave(angle);

    }

    this.drawRoundedShell();

    this.drawMeasurements();

    this.paper.text(this.scale(0.2), this.scale(0.02), 'Shell Dimensions').attr({
      'font-size': this.scale(0.04),
      'font-weight': 'bold',
      'fill': '#333'
    });

  };

  this.drawStave = function(rotation_angle) {

    var base1_width_scaled = (this.scaleFactor() * this.stave.outerDimension());
    var base2_width_scaled = (this.scaleFactor() * this.stave.innerDimension());

    var base1_start_x = (this.centerWidth() - (base1_width_scaled / 2));
    var base1_end_x = base1_start_x + base1_width_scaled;

    var base1_y = this.centerHeight();

    var base2_start_x = (base1_start_x + ((base1_width_scaled - base2_width_scaled) / 2));
    var base2_end_x = base2_start_x + base2_width_scaled;

    var base2_y = (base1_y + (this.scaleFactor() * this.stave.board_thickness));

    var path  = 'M' + base1_start_x + ' ' + base1_y;
        path += 'L' + base1_end_x + ' ' + base1_y;
        path += 'M' + base2_end_x + ' ' + base2_y;
        path += 'L' + base2_start_x + ' ' + base2_y;
        path += 'L' + base1_start_x + ' ' + base1_y;

    var stave = this.paper.path(path).attr({
      'stroke-width': '2px'
    });

    var transform_command = 't0,-' + (this.scaleFactor() * this.stave.externalRadius());
    transform_command += 'R' + rotation_angle + ',' + this.centerWidth() + ',' + this.centerHeight();

    stave.transform(transform_command);

  };

  this.drawRoundedShell = function() {

    var outer = (this.scaleFactor() * (this.stave.finishedDiameter() / 2));

    var inner = outer - (this.scaleFactor() * this.stave.roundedThickness());

    var outer_shell = this.paper.circle(this.centerWidth(), this.centerHeight(), outer).attr({
      stroke: '#E15454'
    });

    var inner_shell = this.paper.circle(this.centerWidth(), this.centerHeight(), inner).attr({
      stroke: '#E15454'
    });

  };

  this.drawMeasurements = function() {

    this.drawAngleDimension();

    this.drawJointAngle();

    this.drawBevelAngle();

    this.drawOuterDimension();

    this.drawInnerDimension();

    this.drawDiameterDimension();

  };

  this.drawDiameterDimension = function() {

    var scaled_extra = this.scaleFactor() * this.stave.extra;

    var outer = (this.scaleFactor() * this.stave.finishedRadius()) - 1;

    var dia  = 'M' + this.centerWidth() + ' ' + this.centerHeight();
        dia += 'L' + this.centerWidth() + ' ' + (this.centerHeight() - outer);
        dia += 'M' + this.centerWidth() + ' ' + this.centerHeight();
        dia += 'L' + this.centerWidth() + ' ' + (this.centerHeight() + outer);

    this.paper.path(dia);

    var arrow1 = this.drawArrow(this.centerWidth(), (this.centerHeight() - outer), this.scale(0.0125));
    var arrow2 = this.drawArrow(this.centerWidth(), (this.centerHeight() + outer), this.scale(0.0125));

    arrow1.transform('r90,' + this.centerWidth() + ',' + (this.centerHeight() - outer));
    arrow2.transform('r270,' + this.centerWidth() + ',' + (this.centerHeight() + outer));

    var circle = this.paper.circle(this.centerWidth(), this.centerHeight(), this.scale(0.075));

    circle.attr({
      fill: this.background,
      stroke: this.background,
    });

    var text = this.stave.finishedDiameter().toFixed(3) + '"';

    if(this.unit == 'cm')
      text = this.ruler.toCentimeters(this.stave.finishedDiameter()).toFixed(2) + 'cm';

    this.paper.text(this.centerWidth(), this.centerHeight(), text).attr({
      'font-size': this.scale(0.04),
      'font-weight': 'bold'
    });

  };

  this.drawOuterDimension = function() {

    var transform = 'r-' + ((Math.round(this.stave.stave_count / 4)) * this.stave.jointAngle()) + ',' + this.centerWidth() + ',' + this.centerHeight();

    var base_width_scaled = (this.scaleFactor() * this.stave.outerDimension());

    var base_start_x = (this.centerWidth() - (base_width_scaled / 2));
    var base_end_x = base_start_x + base_width_scaled;

    var base_y = this.centerHeight() - (this.scaleFactor() * this.stave.externalRadius());
    var base_y_mid =  base_y - this.scale(0.025);

    var path  = 'M' + base_start_x + ' ' + base_y;
        path += 'L' + base_start_x + ' ' + base_y_mid;
        path += 'M' + base_end_x + ' ' + base_y;
        path += 'L' + base_end_x + ' ' + base_y_mid;
        path += 'L' + base_start_x + ' ' + base_y_mid;

    var stave_dim = this.paper.path(path).attr({
      'stroke-dasharray': '- '
    });

    stave_dim.transform(transform);

    var deg_cir = this.paper.circle(this.centerWidth(), base_y_mid, this.scale(0.022)).attr({
      fill: this.background,
      stroke: this.background
    });

    var text = this.stave.outerDimension().toFixed(2) + '"';

    if(this.unit == 'cm')
      text = this.ruler.toCentimeters(this.stave.outerDimension()).toFixed(2) + 'cm';

    var deg_txt = this.paper.text(this.centerWidth(), base_y_mid, text).attr({
      'font-size': this.scale(0.02),
      'font-weight': 'bold'
    });

    deg_cir.transform(transform);
    deg_txt.transform(transform);

  };

  this.drawInnerDimension = function() {

    var transform = 'r-' + ((Math.round(this.stave.stave_count / 4)) * this.stave.jointAngle()) + ',' + this.centerWidth() + ',' + this.centerHeight();

    var base1_width_scaled = (this.scaleFactor() * this.stave.outerDimension());
    var base2_width_scaled = (this.scaleFactor() * this.stave.innerDimension());

    var base1_start_x = (this.centerWidth() - (base1_width_scaled / 2));
    var base1_end_x = base1_start_x + base1_width_scaled;

    var base1_y = this.centerHeight() - (this.scaleFactor() * this.stave.externalRadius());

    var base2_start_x = (base1_start_x + ((base1_width_scaled - base2_width_scaled) / 2));
    var base2_end_x = base2_start_x + base2_width_scaled;

    var base2_y = (base1_y + (this.scaleFactor() * this.stave.board_thickness));
    var base2_y_mid = base2_y + this.scale(0.025);

    var path  = 'M' + base2_start_x + ' ' + base2_y;
        path += 'L' + base2_start_x + ' ' + base2_y_mid;
        path += 'M' + base2_end_x + ' ' + base2_y;
        path += 'L' + base2_end_x + ' ' + base2_y_mid;
        path += 'L' + base2_start_x + ' ' + base2_y_mid;

    var stave_dim = this.paper.path(path).attr({
      'stroke-dasharray': '- '
    });

    stave_dim.transform(transform);

    var deg_cir = this.paper.circle(this.centerWidth(), base2_y_mid, this.scale(0.022)).attr({
      fill: this.background,
      stroke: this.background
    });

    var text = this.stave.innerDimension().toFixed(2) + '"';

    if(this.unit == 'cm')
      text = this.ruler.toCentimeters(this.stave.innerDimension()).toFixed(2) + 'cm';

    var deg_txt = this.paper.text(this.centerWidth(), base2_y_mid, text).attr({
      'font-size': this.scale(0.02),
      'font-weight': 'bold'
    });

    deg_cir.transform(transform);
    deg_txt.transform(transform);

  };

  this.drawAngleDimension = function() {

    var base1_width_scaled = (this.scaleFactor() * this.stave.outerDimension());
    var transform = 'r' + ((Math.round(this.stave.stave_count / 4)) * this.stave.jointAngle()) + ',' + this.centerWidth() + ',' + this.centerHeight();

    var base1_y = this.centerHeight() - (this.scaleFactor() * this.stave.externalRadius());

    var base1_start_x = (this.centerWidth() - (base1_width_scaled / 2));
    var base1_end_x = base1_start_x + base1_width_scaled;

    var angle  = 'M' + this.centerWidth() + ' ' + this.centerHeight();
        angle += 'L' + base1_start_x + ' ' + base1_y;
        angle += 'M' + this.centerWidth() + ' ' + this.centerHeight();
        angle += 'L' + this.centerWidth() + ' ' + base1_y;
        angle += 'M' + this.centerWidth() + ' ' + this.centerHeight();
        angle += 'L' + base1_end_x + ' ' + base1_y;

    var angle_path = this.paper.path(angle).attr({
      'stroke-dasharray': '- '
    });

    angle_path.transform(transform);

  };

  this.drawJointAngle = function() {

    var transform = 'r' + ((Math.round(this.stave.stave_count / 4)) * this.stave.jointAngle()) + ',' + this.centerWidth() + ',' + this.centerHeight();

    var base1_width_scaled = (this.scaleFactor() * this.stave.outerDimension()) - this.scale(0.015);

    var base1_y = (this.centerHeight() - (this.scaleFactor() * (this.stave.externalRadius() / 2)));

    var base1_start_x = (this.centerWidth() - (base1_width_scaled / 4));
    var base1_end_x = base1_start_x + (base1_width_scaled / 2);

    var angle  = 'M' + base1_start_x + ' ' + base1_y;
        angle += 'Q' + this.centerWidth() + ' ' + (base1_y - this.scale(0.025)) + ' ' + base1_end_x + ' ' + base1_y;

    this.paper.path(angle).transform(transform);

    var arrow1 = this.drawArrow(base1_start_x, base1_y, this.scale(0.005));
    var arrow2 = this.drawArrow(base1_end_x, base1_y, this.scale(0.005));

    arrow1.transform(transform + 'r-' + this.arrowAngle((base1_width_scaled / 2), this.scale(0.025)) + ',' + base1_start_x + ',' + base1_y);
    arrow2.transform(transform + 'r' + (180 + this.arrowAngle((base1_width_scaled / 2), this.scale(0.025))) + ',' + base1_end_x + ',' + base1_y);

    var deg_cir = this.paper.circle(this.centerWidth(), base1_y - this.scale(0.035), this.scale(0.02)).attr({
      fill: this.background,
      stroke: this.background
    });

    var deg_txt = this.paper.text(this.centerWidth() + this.scale(0.005), base1_y - this.scale(0.035), this.stave.jointAngle().toFixed(1) + '°').attr({
      'font-size': this.scale(0.025),
      'font-weight': 'bold'
    });

    deg_cir.transform(transform);
    deg_txt.transform(transform);

  };

  this.drawBevelAngle = function() {

    var transform = 'r' + ((Math.round(this.stave.stave_count / 4)) * this.stave.jointAngle()) + ',' + this.centerWidth() + ',' + this.centerHeight();

    var base1_width_scaled = (this.scaleFactor() * this.stave.outerDimension()) - this.scale(0.015);

    var base1_y = (this.centerHeight() - (this.scaleFactor() * (this.stave.externalRadius() / 1.5)));

    var base1_start_x = this.centerWidth() + this.scale(0.00125);
    var base1_end_x = base1_start_x + (base1_width_scaled / 3);
    var base1_mid_x = base1_start_x + (base1_width_scaled / 6);

    var angle  = 'M' + base1_start_x + ' ' + base1_y;
        angle += 'Q' + base1_mid_x + ' ' + (base1_y - this.scale(0.01)) + ' ' + base1_end_x + ' ' + base1_y;

    this.paper.path(angle).transform(transform);

    var arrow1 = this.drawArrow(base1_start_x, base1_y, this.scale(0.005));
    var arrow2 = this.drawArrow(base1_end_x, base1_y, this.scale(0.005));

    arrow1.transform(transform + 'r-' + this.arrowAngle((base1_width_scaled / 2), this.scale(0.01)) + ',' + base1_start_x + ',' + base1_y);
    arrow2.transform(transform + 'r' + (180 + this.arrowAngle((base1_width_scaled / 2), this.scale(0.01))) + ',' + base1_end_x + ',' + base1_y);

    var deg_cir = this.paper.circle(base1_mid_x, base1_y - this.scale(0.022), this.scale(0.015)).attr({
      fill: this.background,
      stroke: this.background
    });

    var deg_txt = this.paper.text(base1_mid_x + this.scale(0.005), base1_y - this.scale(0.022), this.stave.bevelAngle().toFixed(1) + '°').attr({
      'font-size': this.scale(0.02),
      'font-weight': 'bold'
    });

    deg_cir.transform(transform);
    deg_txt.transform(transform);

  };

  this.drawArrow = function(x, y, size) {

    var arrow  = 'M' + x + ' ' + y;
        arrow += 'l ' + size + ' ' + size;
        arrow += 'M' + x + ' ' + y;
        arrow += 'l ' + size + ' -' + size;

    return this.paper.path(arrow);

  };

  this.arrowAngle = function(adjacent, opposite) {

    var hypotenuse = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2));

    var sin = opposite / hypotenuse;

    return this.stave.toDegrees(Math.asin(sin));

  };

  this.centerWidth = function() {

    return (this.width / 2);

  };

  this.centerHeight = function() {

    return (this.height / 2);

  };

  this.scale = function(percent) {

    return Math.round(this.width * percent);

  };

  this.scaleFactor = function() {

    return ((this.width - this.scale(0.1)) / this.stave.externalDiameter());

  };

  this.resize = function(width) {

    this.width = width;

    this.height = width;

    this.paper.setSize(this.width, this.height);

    this.draw();

  };

}

