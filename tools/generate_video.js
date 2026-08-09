#!/usr/bin/env node
// АвтоТема: генератор видео по статьям сайта.
// Вертикальные ролики 1080x1920 (Shorts/Reels/TikTok): озвучка (edge-tts) +
// слайды по предложениям + фон с Ken Burns + субтитры + заставка и CTA.
//
// Использование:
//   node generate_video.js            — интерактивный выбор статей
//   node generate_video.js 3 17 24    — конкретные статьи
//   node generate_video.js --all      — все статьи
//
// Зависимости: ffmpeg (brew install ffmpeg), python3 + edge-tts (pip install edge-tts)

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const readline = require('readline');

const ROOT = path.join(__dirname, '..');
const VOICE = process.env.TTS_VOICE || 'ru-RU-DmitryNeural';
const OUT_DIR = path.join(__dirname, 'videos');
const W = 1080, H = 1920, FPS = 25;
const BRAND = 'АвтоТема';
const CTA_TEXT = 'Подпишитесь: t.me/avtotema_news';
// Шрифт с кириллицей для субтитров — определяется автоматически (macOS / Ubuntu)
const FONT = process.env.SUBTITLE_FONT || [
    '/System/Library/Fonts/Supplemental/Arial.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
].find(function (p) { return fs.existsSync(p); });
if (!FONT) { console.error('Не найден шрифт с кириллицей. Укажите SUBTITLE_FONT=/path/to/font.ttf'); process.exit(1); }
// Homebrew ffmpeg-full нужен для drawtext (обычный ffmpeg без него)
const FFMPEG = fs.existsSync('/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg') ? '/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg' : 'ffmpeg';
const FFPROBE = fs.existsSync('/opt/homebrew/opt/ffmpeg-full/bin/ffprobe') ? '/opt/homebrew/opt/ffmpeg-full/bin/ffprobe' : 'ffprobe';

// ── Данные статей ────────────────────────────────────────────────
const { BODIES, IMAGES, SLUGS } = require(path.join(ROOT, 'article_content.js'));
const scriptSrc = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');
const mBank = scriptSrc.match(/const ARTICLE_BANK = (\[[\s\S]*?\]);/);
if (!mBank) { console.error('ARTICLE_BANK не найден в script.js'); process.exit(1); }
const ARTICLE_BANK = eval('(' + mBank[1] + ')');

// ── Утилиты ──────────────────────────────────────────────────────
function tmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'avtotema_video_'));
}

function tts(text, out) {
    if (!text.trim()) return;
    const r = spawnSync('python3', ['-m', 'edge_tts', '--voice', VOICE, '--text', text, '--write-media', out], { stdio: 'ignore' });
    if (r.status !== 0 || !fs.existsSync(out)) throw new Error('edge-tts не сработал для: ' + text.slice(0, 50));
}

function probeDuration(file) {
    const r = spawnSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], { encoding: 'utf8' });
    return parseFloat((r.stdout || '').trim()) || 1;
}

function wrap(text, width) {
    const words = text.split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
        if ((cur + ' ' + w).trim().length > width && cur) { lines.push(cur.trim()); cur = w; }
        else cur = (cur + ' ' + w).trim();
    }
    if (cur) lines.push(cur);
    return lines.join('\n');
}

function sentences(text) {
    const parts = text.split(/(?<=[.!?…])\s+/).map(s => s.trim()).filter(Boolean);
    const out = [];
    for (let p of parts) {
        while (p.length > 200) {
            const cut = p.lastIndexOf(', ', 200);
            const at = cut > 80 ? cut : 200;
            out.push(p.slice(0, at).trim());
            p = p.slice(at).replace(/^[, ]+/, '');
        }
        if (p) out.push(p);
    }
    return out;
}

function escPath(p) { return String(p).replace(/[\\'\]:]/g, '\\$&'); }

// ── ffmpeg-сборка одного слайда ──────────────────────────────────
// img — картинка статьи, sub — текст субтитров (null = нет),
// audio — mp3 озвучки, dur — длительность, pad — пауза в конце,
// fg — показывать ли резкую картинку сверху, centerText — крупный текст по центру (заставка/CTA)
function buildSlide(dir, name, img, sub, audio, dur, opts) {
    opts = opts || {};
    const frames = Math.max(1, Math.round(dur * FPS));
    const z = opts.slow ? 0.0005 : 0.0009;
    const subPath = sub ? path.join(dir, name + '.sub') : null;
    if (subPath) fs.writeFileSync(subPath, sub, 'utf8');

    const parts = [];
    parts.push('[0:v]scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,');
    parts.push('zoompan=z=\'min(zoom+' + z + ',1.12)\':x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':d=' + frames + ':s=' + W + 'x' + H + ':fps=' + FPS + ',');
    parts.push('boxblur=22:2,colorchannelmixer=aa=0.72[bg];');

    if (opts.fg) {
        parts.push('[0:v]scale=2160:-2,crop=2160:1280:0:\'(ih-1280)/2\',scale=1080:-2,setsar=1[fg];');
        parts.push('[bg][fg]overlay=0:160[base];');
    } else {
        parts.push('[bg]null[base];');
    }

    if (!opts.centerText) {
        parts.push('[base]drawbox=y=' + (H - 700) + ':w=' + W + ':h=700:color=black@0.55:t=fill[bb];');
        if (subPath) {
            parts.push('[bb]drawtext=fontfile=' + FONT + ':textfile=' + escPath(subPath) + ':fontsize=40:fontcolor=white:line_spacing=12:x=(w-text_w)/2:y=' + (H - 650) + '[bs];');
        } else {
            parts.push('[bb]null[bs];');
        }
    } else {
        if (subPath) {
            parts.push('[base]drawtext=fontfile=' + FONT + ':textfile=' + escPath(subPath) + ':fontsize=' + (opts.big ? 54 : 48) + ':fontcolor=white:line_spacing=14:shadowcolor=black@0.7:shadowx=3:shadowy=3:x=(w-text_w)/2:y=' + (opts.big ? 620 : 700) + '[bs];');
        } else {
            parts.push('[base]null[bs];');
        }
    }

    parts.push('[bs]drawtext=fontfile=' + FONT + ':text=\'АвтоТема\':fontsize=30:fontcolor=white@0.9:x=40:y=36[vo];');

    let audioChain = '[1:a]aresample=48000,apad[ao]';
    parts.push(audioChain);
    if (!fs.existsSync(audio)) parts[parts.length - 1] = 'anullsrc=r=48000:cl=stereo,atrim=0:' + dur + '[ao]';

    const outFile = path.join(dir, name + '.mp4');
    const args = ['-y', '-i', img];
    if (fs.existsSync(audio)) args.push('-i', audio);
    args.push('-filter_complex', parts.join(''), '-map', '[vo]', '-map', '[ao]',
        '-t', dur.toFixed(3), '-r', String(FPS), '-c:v', 'libx264', '-preset', 'medium',
        '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', outFile);
    execFileSync(FFMPEG, args, { stdio: ['ignore', 'ignore', 'inherit'] });
    return outFile;
}

// ── Сборка ролика по статье ──────────────────────────────────────
async function buildArticle(n) {
    const a = ARTICLE_BANK[n - 1];
    if (!a) { console.error('Статья ' + n + ' не найдена'); return; }
    const body = (BODIES[n - 1] || []).join(' ');
    const img = path.join(ROOT, (IMAGES[n] || {}).url || 'images/art-01.jpg');
    const slug = SLUGS[n] || ('article-' + n);
    const dir = tmpDir();
    console.log('\n🎬 Статья ' + n + ': ' + a.title);
    console.log('   изображение: ' + path.basename(img));

    const clips = [];

    // 1. Заставка — заголовок
    const t1 = path.join(dir, 't1.mp3');
    tts(a.title, t1);
    const d1 = probeDuration(t1) + 0.9;
    clips.push(buildSlide(dir, 's_intro', img, wrap(a.title, 22), t1, d1, { fg: false, centerText: true, big: true, slow: true }));
    console.log('   ✓ заставка');

    // 2. Слайды по предложениям
    const sents = [];
    for (const p of body.split('\n')) sents.push(...sentences(p));
    for (let i = 0; i < sents.length; i++) {
        const s = sents[i];
        const tf = path.join(dir, 't_' + i + '.mp3');
        tts(s, tf);
        const d = probeDuration(tf) + 0.5;
        clips.push(buildSlide(dir, 's_' + i, img, wrap(s, 40), tf, d, { fg: true }));
        process.stdout.write('   ✓ слайд ' + (i + 1) + '/' + sents.length + '\r');
    }
    if (sents.length) console.log('\n   ✓ озвучка и слайды');

    // 3. Финальный CTA
    const tEnd = path.join(dir, 't_end.mp3');
    tts('Подписывайтесь на канал АвтоТема в Телеграме, чтобы не пропускать новости.', tEnd);
    const dEnd = probeDuration(tEnd) + 1.2;
    clips.push(buildSlide(dir, 's_end', img, CTA_TEXT, tEnd, dEnd, { fg: false, centerText: true, slow: true }));
    console.log('   ✓ финальная заставка');

    // Склейка
    const listPath = path.join(dir, 'list.txt');
    fs.writeFileSync(listPath, clips.map(c => 'file \'' + c + '\'').join('\n'));
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const out = path.join(OUT_DIR, 'out_' + n + '_' + slug + '.mp4');
    execFileSync(FFMPEG, ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', out], { stdio: ['ignore', 'ignore', 'inherit'] });
    const sec = probeDuration(out);
    const size = (fs.statSync(out).size / 1024 / 1024).toFixed(1);
    console.log('   ✅ ' + out + '  (' + Math.round(sec) + ' c, ' + size + ' МБ)');
    fs.rmSync(dir, { recursive: true, force: true });
}

// ── Выбор статей ─────────────────────────────────────────────────
function printList() {
    console.log('\nСписок статей:');
    ARTICLE_BANK.forEach((a, i) => {
        console.log('  ' + String(i + 1).padStart(2) + '. ' + a.title + '  [' + a.tag + ']');
    });
    console.log('');
}

function ask(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(res => rl.question(question, ans => { rl.close(); res(ans); }));
}

async function main() {
    const args = process.argv.slice(2);
    let nums;
    if (args.length === 0) {
        printList();
        const ans = (await ask('Какие статьи роликами делать? (номера через пробел или "all"): ')).trim();
        nums = ans.toLowerCase() === 'all' ? ARTICLE_BANK.map((_, i) => i + 1) : ans.split(/\s+/).map(Number).filter(Boolean);
    } else if (args.includes('--all')) {
        nums = ARTICLE_BANK.map((_, i) => i + 1);
    } else {
        nums = args.map(Number).filter(Boolean);
    }

    const valid = nums.filter(n => n >= 1 && n <= ARTICLE_BANK.length);
    if (!valid.length) { console.log('Не выбрано ни одной статьи.'); return; }
    console.log('Обработаю статьи: ' + valid.join(', '));
    for (const n of valid) {
        try {
            await buildArticle(n);
        } catch (e) {
            console.error('Статья ' + n + ' — ошибка:', e.stack || e.message);
        }
    }
    console.log('\n🎉 Готово! Ролики в папке ' + OUT_DIR);
}

main().catch(e => { console.error('Ошибка:', e.stack || e.message); process.exit(1); });
