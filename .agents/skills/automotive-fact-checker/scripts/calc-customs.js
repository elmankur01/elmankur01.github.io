#!/usr/bin/env node
/**
 * Automotive Customs & Utilization Fee Calculator (РФ 2026)
 * Usage:
 *   node calc-customs.js --volume 1998 --age 3-5 --price 20000 --personal
 *   node calc-customs.js --volume 2995 --age 0-3 --price 45000 --commercial
 *   node calc-customs.js --ev --age 0-3 --price 35000
 */

const fs = require('fs');
const path = require('path');

const refPath = path.join(__dirname, '../references/customs-and-util-fees-2026.json');
const refData = JSON.parse(fs.readFileSync(refPath, 'utf8'));

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    volume: 1998,
    age: '3-5',
    price: 20000,
    currency: 'EUR',
    isPersonal: true,
    isEv: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--volume' || arg === '-v') options.volume = parseFloat(args[++i]);
    else if (arg === '--age' || arg === '-a') options.age = args[++i];
    else if (arg === '--price' || arg === '-p') options.price = parseFloat(args[++i]);
    else if (arg === '--currency' || arg === '-c') options.currency = args[++i].toUpperCase();
    else if (arg === '--commercial') options.isPersonal = false;
    else if (arg === '--personal') options.isPersonal = true;
    else if (arg === '--ev') options.isEv = true;
  }
  return options;
}

function calculateCustoms(opts) {
  const eurRate = refData.currency_default_rates.EUR;
  const priceEur = opts.currency === 'EUR' ? opts.price : (opts.price * (refData.currency_default_rates[opts.currency] || 1) / eurRate);

  let dutyEur = 0;
  let dutyExplanation = '';

  // 1. Customs Duty (Пошлина)
  if (opts.isEv) {
    // 15% for EVs
    dutyEur = priceEur * 0.15;
    dutyExplanation = '15% единая ставка на электромобили (ЕАЭС)';
  } else if (opts.age === '0-3') {
    const brackets = refData.customs_duty_rates_individuals.under_3_years.brackets_eur;
    let bracket = brackets.find(b => b.max_price === null || priceEur <= b.max_price);
    if (!bracket) bracket = brackets[brackets.length - 1];

    const percentPart = priceEur * (bracket.rate_percent / 100);
    const volumePart = opts.volume * bracket.min_eur_per_cc;
    dutyEur = Math.max(percentPart, volumePart);
    dutyExplanation = `${bracket.rate_percent}% от стоимости, но не менее €${bracket.min_eur_per_cc}/см³`;
  } else if (opts.age === '3-5') {
    const brackets = refData.customs_duty_rates_individuals['3_to_5_years'].brackets_cc;
    let bracket = brackets.find(b => b.max_cc === null || opts.volume <= b.max_cc);
    if (!bracket) bracket = brackets[brackets.length - 1];
    dutyEur = opts.volume * bracket.eur_per_cc;
    dutyExplanation = `Фиксированная ставка €${bracket.eur_per_cc} за 1 см³ (авто 3–5 лет)`;
  } else {
    // over 5 years
    const brackets = refData.customs_duty_rates_individuals.over_5_years.brackets_cc;
    let bracket = brackets.find(b => b.max_cc === null || opts.volume <= b.max_cc);
    if (!bracket) bracket = brackets[brackets.length - 1];
    dutyEur = opts.volume * bracket.eur_per_cc;
    dutyExplanation = `Заградительная ставка €${bracket.eur_per_cc} за 1 см³ (авто старше 5 лет)`;
  }

  const dutyRub = Math.round(dutyEur * eurRate);

  // 2. Utilization Fee (Утилизационный сбор)
  let utilFeeRub = 0;
  let utilExplanation = '';

  if (opts.isPersonal && opts.volume <= 3000 && !opts.isEv) {
    if (opts.age === '0-3') {
      utilFeeRub = refData.utilization_fee_rubles.personal_use_under_3L_no_resale_12m.under_3_years;
      utilExplanation = 'Льготный утильсбор для личного пользования (до 3 лет, до 3.0L)';
    } else {
      utilFeeRub = refData.utilization_fee_rubles.personal_use_under_3L_no_resale_12m.over_3_years;
      utilExplanation = 'Льготный утильсбор для личного пользования (старше 3 лет, до 3.0L)';
    }
  } else {
    // Commercial scale
    const scale = refData.utilization_fee_rubles.commercial_or_resale_scale;
    let bracketKey = '1000cc_to_2000cc';
    if (opts.isEv) bracketKey = 'electric_ev';
    else if (opts.volume <= 1000) bracketKey = 'under_1000cc';
    else if (opts.volume <= 2000) bracketKey = '1000cc_to_2000cc';
    else if (opts.volume <= 3000) bracketKey = '2000cc_to_3000cc';
    else if (opts.volume <= 3500) bracketKey = '3000cc_to_3500cc';
    else bracketKey = 'over_3500cc';

    const ageKey = opts.age === '0-3' ? 'under_3_years' : 'over_3_years';
    utilFeeRub = scale[bracketKey][ageKey];
    utilExplanation = `Коммерческий утильсбор (${bracketKey}, ${opts.age})`;
  }

  // 3. Customs clearance fee (Таможенный сбор за оформление)
  let clearanceFeeRub = 8530; // standard median tier
  if (priceEur * eurRate > 5000000) clearanceFeeRub = 27000;
  else if (priceEur * eurRate > 2500000) clearanceFeeRub = 14600;

  const totalPaymentsRub = dutyRub + utilFeeRub + clearanceFeeRub;
  const carPriceRub = Math.round(priceEur * eurRate);
  const grandTotalRub = carPriceRub + totalPaymentsRub;

  return {
    opts,
    eurRate,
    priceEur,
    carPriceRub,
    dutyEur: Math.round(dutyEur),
    dutyRub,
    dutyExplanation,
    utilFeeRub,
    utilExplanation,
    clearanceFeeRub,
    totalPaymentsRub,
    grandTotalRub
  };
}

function main() {
  const opts = parseArgs();
  const res = calculateCustoms(opts);

  console.log(`\n======================================================`);
  console.log(`  🚗 РАСЧЕТ РАСТАМОЖКИ И УТИЛЬСБОРА РФ (2026 ГОД)`);
  console.log(`======================================================\n`);

  console.log(`Параметры автомобиля:`);
  console.log(`- Тип: ${opts.isEv ? 'Электромобиль (EV)' : `ДВС (${opts.volume} см³)`}`);
  console.log(`- Возраст: ${opts.age} лет | Назначение: ${opts.isPersonal ? 'Личное (без перепродажи 12 мес)' : 'Коммерческое / перепродажа'}`);
  console.log(`- Цена нетто: €${res.priceEur.toLocaleString('ru-RU')} (~${res.carPriceRub.toLocaleString('ru-RU')} ₽ при курсе € = ${res.eurRate} ₽)`);
  console.log('');

  console.log(`Платежи при ввозе:`);
  console.log(`1. Таможенная пошлина:   €${res.dutyEur.toLocaleString('ru-RU')} (~${res.dutyRub.toLocaleString('ru-RU')} ₽)`);
  console.log(`   Правило: ${res.dutyExplanation}`);
  console.log(`2. Утилизационный сбор:  ${res.utilFeeRub.toLocaleString('ru-RU')} ₽`);
  console.log(`   Правило: ${res.utilExplanation}`);
  console.log(`3. Сбор за оформление:   ${res.clearanceFeeRub.toLocaleString('ru-RU')} ₽`);
  console.log(`------------------------------------------------------`);
  console.log(`ИТОГО ВСЕХ ПОШЛИН В РФ:  ${res.totalPaymentsRub.toLocaleString('ru-RU')} ₽`);
  console.log(`ОРИЕНТИР С АВТО ПОД КЛЮЧ: ~${res.grandTotalRub.toLocaleString('ru-RU')} ₽`);
  console.log(`======================================================\n`);
}

main();
