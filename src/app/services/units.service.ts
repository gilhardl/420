import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  private unitBaseTable = {};

  private value: number;
  private currentUnit: any;
  private targetUnit: any;

  constructor() { }

  async init() {
    this.initConverter();
  }

  setCurrent(currentUnit) {
    this.currentUnit = currentUnit;
    return this;
  }

  setTarget(targetUnit) {
      this.targetUnit = targetUnit;
      return this;
  }

  setValue(currentUnit) {
      this.currentUnit = currentUnit;
      return this;
  }

  convert(value?, target?, current?) {
    this.value = value || this.value;
    this.targetUnit = target || this.targetUnit;
    this.currentUnit = current || this.currentUnit;

    // first, convert from the current value to the base unit
    target = this.unitBaseTable[this.targetUnit];
    current = this.unitBaseTable[this.currentUnit];
    if (target.base !== current.base) {
      throw new Error('Incompatible units; cannot convert from "' + this.currentUnit + '" to "' + this.targetUnit + '"');
    }

    return this.value * (current.multiplier / target.multiplier);
  }

  toString(value?, target?, current?) {
    this.value = value || this.value;
    this.targetUnit = target || this.targetUnit;
    this.currentUnit = current || this.currentUnit;
    return this.convert(value, target, current) + ' ' + this.targetUnit;
  }

  debugConverter(value?, target?, current?) {
    this.value = value || this.value;
    this.targetUnit = target || this.targetUnit;
    this.currentUnit = current || this.currentUnit;
    return this.value + ' ' + this.currentUnit + ' is ' + this.toString(value, target, current);
  }

  private initConverter() {
    const prefixes = ['Y', 'Z', 'E', 'P', 'T', 'G', 'M', 'k', 'h', 'da', '', 'd', 'c', 'm', 'u', 'n', 'p', 'f', 'a', 'z', 'y'];
    const factors = [24, 21, 18, 15, 12, 9, 6, 3, 2, 1, 0, -1, -2, -3, -6, -9, -12, -15, -18, -21, -24];

    // SI units only, that follow the mg/kg/dg/cg type of format
    const units = ['g', 'b', 'l', 'm'];

    for (let j = 0; j < units.length; j++) {
      const base = units[j];
      for (let i = 0; i < prefixes.length; i++) {
        this.addUnit(base, prefixes[i] + base, Math.pow(10, factors[i]));
      }
    }

    // we use the SI gram unit as the base; this allows us to convert between SI and English units
    this.addUnit('g', 'ounce', 28.3495231);
    this.addUnit('g', 'oz', 28.3495231);
    this.addUnit('g', 'pound', 453.59237);
    this.addUnit('g', 'lb', 453.59237);
    // we use the SI metre unit as the base; this allows us to convert between SI and English units
    this.addUnit('m', 'in', 0.0254);
    this.addUnit('m', 'inch', 0.0254);
    this.addUnit('m', 'ft', 0.3048);
    this.addUnit('m', 'foot', 0.3048);
    this.addUnit('m', 'yd', 0.9144);
    this.addUnit('m', 'yard', 0.9144);
  }

  private addUnit(baseUnit, actualUnit, multiplier) {
    this.unitBaseTable[actualUnit] = { base: baseUnit, actual: actualUnit, multiplier: multiplier };
  }
}
