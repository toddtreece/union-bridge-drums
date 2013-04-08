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

function stave() {

  this.extra = 0.125;

  this.rip_kerf = 0.09375;
  this.crosscut_kerf = 0.09375;

  this.shell_diameter = 14.0;
  this.stave_count = 20;
  this.shell_depth = 5.5;

  this.board_thickness = 0.750;
  this.board_width = 5.00;
  this.cost_board_ft = 11.00;

  this.waste_factor = 15;

  this.finishedDiameter = function() {

    return this.shell_diameter - 0.125;

  };

  this.finishedRadius = function() {

    return this.finishedDiameter() / 2;

  };

  this.externalDiameter = function() {

    return this.shell_diameter + this.extra;

  };

  this.internalDiameter = function() {

    return this.externalDiameter() - (this.board_thickness * 2);

  };

  this.externalRadius = function() {

    return this.externalDiameter() / 2;

  };

  this.internalRadius = function() {

    return this.internalDiameter() / 2;

  };

  this.jointAngle = function() {

    return 360 / this.stave_count;

  };

  this.bevelAngle = function() {

    return this.jointAngle() / 2;

  };

  this.outerDimension = function() {

    return (2 * ( this.externalDiameter() / Math.cos( Math.PI / this.stave_count ) / 2 ) * Math.sin( Math.PI / this.stave_count ) );

  };

  this.innerDimension = function() {

    var hypotenuse = this.board_thickness / Math.sin( this.toRadians(90 - this.bevelAngle()) );

    var adjacent = hypotenuse * Math.cos( this.toRadians(90 - this.bevelAngle()) );

    return this.outerDimension() - ( 2 * adjacent);

  };

  this.roundedThickness = function() {

    var internal_sq = this.internalRadius() * this.internalRadius();

    var x_sq = (this.innerDimension() / 2) * (this.innerDimension() / 2);

    var diff = this.externalRadius() - Math.sqrt(internal_sq - x_sq) - this.board_thickness;

    return this.board_thickness - 0.125 - diff;

  };

  this.stavesPerWidth = function() {

    return Math.floor((this.board_width / this.outerDimension()) + this.rip_kerf);

  };

  this.stavesPerLength = function() {

    return Math.ceil(this.stave_count / this.stavesPerWidth());

  };

  this.boardLengthRequired = function() {

    return (this.shell_depth * this.stavesPerLength()) + ((this.stavesPerLength() - 1) * this.crosscut_kerf);

  };

  this.boardFeetRequired = function() {

    return ((this.board_width * this.boardLengthRequired() * this.board_thickness) / 144) * ((this.waste_factor / 100) + 1);

  };

  this.shellCost = function() {

    return this.boardFeetRequired() * this.cost_board_ft;

  };

  /** UTILITY FUNCTIONS **/
  this.toRadians = function(deg) {

    return deg * (Math.PI / 180);

  };

  this.toDegrees = function(rad) {

    return rad * (180 / Math.PI);

  };

}
