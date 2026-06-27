// =====================
// Constants
// =====================

// Все фоновые изображения из assets/images/new/ — добавьте новый файл в папку и укажите имя здесь
const TEMPLATE_IMAGES = [
  'assets/images/new/preset_image_1.webp',
  'assets/images/new/preset_image_2.webp',
  'assets/images/new/preset_image_3.webp',
  'assets/images/new/preset_image_4.webp',
  'assets/images/new/preset_image_5.webp',
  'assets/images/new/preset_image_6.webp',
  'assets/images/new/preset_image_7.webp',
  'assets/images/new/3_1920x1080_ЛЕТО_2025.webp',
  'assets/images/new/5_1920x1080_ЛЕТО_2025.webp',
  'assets/images/new/6_1920x1080_ЛЕТО_2025.webp',
];

const TEXT_PRESETS = [
  'Пусть сегодня всё складывается именно так, как хочется. Желаем хорошего настроения, приятных сюрпризов и людей рядом, которые делают праздник настоящим.',
  'Желаем вам всего, чего сами для себя желаете – и немного сверх того. Пусть всё задуманное воплощается в жизнь легче, чем ожидалось.',
  'Пусть этот праздник станет хорошим поводом остановиться и заметить всё то хорошее, что уже есть и что работает. Желаем вам людей рядом, которым важны именно вы, дел, которые приносят настоящее удовлетворение, и тех спокойных моментов, в которых сам себе говоришь: всё движется туда, куда нужно. Пусть впереди окажется много такого, о чём сегодня ещё даже не догадываетесь.',
  'Желаем энергии для всего важного, спокойствия для всего остального и поводов для настоящей радости – сегодня и не только.',
  'Пусть впереди будет столько же хорошего, сколько уже позади – а лучше больше. Желаем, чтобы всё задуманное обязательно случилось.',
  'Пусть этот день будет наполнен приятными мелочами, тёплыми разговорами и моментами, которые запоминаются надолго.',
  'Желаем вам в этот день только хорошего – в самом простом и точном смысле. Пусть всё идёт так, как нужно, и даже лучше.',
  'Пусть рядом всегда будут люди, которые поддерживают, дела, которые приносят удовлетворение, и время на то, что по-настоящему важно.',
  'Желаем, чтобы этот день запомнился: добрыми словами, хорошим настроением и моментами, которые остаются надолго.',
  'Пусть планы воплощаются в жизнь, а неожиданности будут только приятными. Желаем уверенности, хорошего окружения и всего, что делает жизнь насыщенной.',
];

const AI_STYLE_TEXT = {
  soulful: 'мягкий, личный, искренний, без шаблонов и канцелярита, текст должен звучать естественно и по-человечески, будто поздравление написано лично, добавь немного тепла и лёгкой эмоциональности, но без излишней сентиментальности, не используй избитые пожелания вроде «успехов во всех начинаниях» или «крепкого здоровья и счастья»',
  official: 'официально-деловой, сдержанный, статусный, текст должен звучать современно и профессионально, без излишнего пафоса, избегай панибратства и фамильярности, акцент сделай на уважении, профессиональных качествах, авторитете и пожеланиях стабильности и развития',
};

// =====================
// State
// =====================

const state = {
  stage: 1,
  templateIndex: 0,
  customImageSrc: null,
};

// =====================
// Init
// =====================

document.addEventListener('DOMContentLoaded', () => {
  renderTemplates();
  renderTextPresets();
  syncPreview();
});

// =====================
// Template Grid (Stage 1)
// =====================

function renderTemplates() {
  const grid = document.getElementById('templatesGrid');
  grid.innerHTML = '';

  TEMPLATE_IMAGES.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'tmpl-thumb' + (i === state.templateIndex ? ' selected' : '');
    div.onclick = () => selectTemplate(i);
    div.innerHTML = `
      <img src="${src}" alt="Шаблон ${i + 1}" loading="lazy">
      <div class="tmpl-mini-text">
        <div class="mini-h">С днём рождения!</div>
        <div class="mini-p">Шаблон ${i + 1}</div>
      </div>
      <div class="tmpl-check">✓</div>
    `;
    grid.appendChild(div);
  });

  // Upload slot
  const uploadDiv = document.createElement('div');
  uploadDiv.className = 'tmpl-upload' + (state.templateIndex === -1 ? ' selected' : '');
  uploadDiv.id = 'uploadSlot';
  uploadDiv.onclick = () => document.getElementById('fileInput').click();
  uploadDiv.innerHTML = `
    <input type="file" id="fileInput" accept="image/*" hidden>
    <div id="uploadContent">
      <div class="upload-icon">+</div>
      <span>Своё фото</span>
    </div>
    <img class="tmpl-upload-img hidden" id="uploadPreviewImg" alt="Загруженное фото">
    <div class="tmpl-check">✓</div>
  `;
  grid.appendChild(uploadDiv);

  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
}

function selectTemplate(index) {
  state.templateIndex = index;
  state.customImageSrc = null;

  document.querySelectorAll('.tmpl-thumb').forEach((el, i) => {
    el.classList.toggle('selected', i === index);
  });

  const uploadSlot = document.getElementById('uploadSlot');
  if (uploadSlot) uploadSlot.classList.remove('selected');

  syncPreview();
}

function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    state.customImageSrc = ev.target.result;
    state.templateIndex = -1;

    document.querySelectorAll('.tmpl-thumb').forEach(el => el.classList.remove('selected'));

    const uploadSlot = document.getElementById('uploadSlot');
    uploadSlot.classList.add('selected', 'has-image');

    const uploadContent = document.getElementById('uploadContent');
    const uploadPreviewImg = document.getElementById('uploadPreviewImg');
    uploadContent.classList.add('hidden');
    uploadPreviewImg.src = ev.target.result;
    uploadPreviewImg.classList.remove('hidden');

    syncPreview();
    showToast('Фото загружено');
  };
  reader.readAsDataURL(file);
}

// =====================
// Stage Navigation
// =====================

function goToStage(step) {
  if (step === 3) renderFinalCard();

  document.querySelectorAll('.stage').forEach(el => el.classList.remove('active'));
  document.getElementById('stage' + step).classList.add('active');

  const navItems = document.querySelectorAll('.step-item');
  navItems.forEach((el, i) => {
    el.classList.remove('active', 'done');
    const num = i + 1;
    if (num < step) el.classList.add('done');
    else if (num === step) el.classList.add('active');
  });

  state.stage = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =====================
// Live Preview Sync (Stage 2)
// =====================

function syncPreview() {
  const bgSrc = state.customImageSrc || (state.templateIndex >= 0 ? TEMPLATE_IMAGES[state.templateIndex] : '');
  setCardBg('previewBgImg', bgSrc);

  const header = val('fieldHeader');
  const appeal = val('fieldAppeal');
  const description = val('fieldDescription');
  const footer = val('fieldFooter');

  setCardField('previewHeader', header);
  setCardField('previewAppeal', appeal);
  setCardField('previewDescription', description);
  setCardField('previewFooter', footer);

  const showLogo = document.querySelector('input[name="showLogo"]:checked')?.value === 'yes';
  document.querySelectorAll('.sber-logo').forEach(el => {
    el.style.display = showLogo ? '' : 'none';
  });
}

function renderFinalCard() {
  const bgSrc = state.customImageSrc || (state.templateIndex >= 0 ? TEMPLATE_IMAGES[state.templateIndex] : '');
  setCardBg('finalBgImg', bgSrc);

  setCardField('finalHeader', val('fieldHeader'));
  setCardField('finalAppeal', val('fieldAppeal'));
  setCardField('finalDescription', val('fieldDescription'));
  setCardField('finalFooter', val('fieldFooter'));

  const showLogo = document.querySelector('input[name="showLogo"]:checked')?.value === 'yes';
  document.querySelectorAll('.sber-logo').forEach(el => {
    el.style.display = showLogo ? '' : 'none';
  });
}

function setCardBg(imgId, src) {
  const img = document.getElementById(imgId);
  if (!img) return;
  img.src = src;
  img.style.display = src ? 'block' : 'none';
}

function setCardField(elId, text) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.style.display = text.trim() ? '' : 'none';
}

function val(id) {
  return (document.getElementById(id)?.value || '').trim();
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

async function pasteFromClipboard() {
  if (!navigator.clipboard?.readText) {
    showToast('Вставка из буфера недоступна — вставьте текст вручную');
    return;
  }
  try {
    const text = await navigator.clipboard.readText();
    if (!text.trim()) { showToast('Буфер обмена пуст'); return; }
    const field = document.getElementById('fieldDescription');
    field.value = text.trim();
    autoResize(field);
    syncPreview();
    updateCharCount();
    document.querySelectorAll('.tpl-item').forEach(el => el.classList.remove('active'));
    showToast('Текст вставлен');
  } catch {
    showToast('Не удалось прочитать буфер — вставьте текст вручную');
  }
}

function clearDescription() {
  const el = document.getElementById('fieldDescription');
  el.value = '';
  autoResize(el);
  syncPreview();
  updateCharCount();
}

function updateCharCount() {
  const el = document.getElementById('fieldDescription');
  const counter = document.getElementById('charDescription');
  if (!el || !counter) return;
  const len = el.value.length;
  const max = el.maxLength;
  counter.textContent = `${len} / ${max}`;
  counter.classList.toggle('warn', len >= max * 0.9);
}

// =====================
// Text Templates (Stage 2)
// =====================

function renderTextPresets() {
  const list = document.getElementById('textTemplatesList');
  if (!list) return;

  TEXT_PRESETS.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'tpl-item';
    btn.textContent = text;
    btn.onclick = () => applyTextPreset(text, i);
    list.appendChild(btn);
  });
}

function applyTextPreset(text, index) {
  const field = document.getElementById('fieldDescription');
  if (!field) return;
  field.value = text;
  autoResize(field);
  syncPreview();
  updateCharCount();

  document.querySelectorAll('.tpl-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });

  showToast('Шаблон применён');
}

// =====================
// Accordion Toggle
// =====================

function toggleAccordion(bodyId, arrowId) {
  const body = document.getElementById(bodyId);
  const arrow = document.getElementById(arrowId);
  if (!body) return;

  const isOpen = body.classList.toggle('open');
  if (arrow) arrow.style.transform = isOpen ? 'rotate(180deg)' : '';
}

// =====================
// AI Prompt
// =====================

function generatePrompt() {
  const gender = document.querySelector('input[name="aiGender"]:checked')?.value || 'male';
  const style = document.querySelector('input[name="aiStyle"]:checked')?.value || 'soulful';
  const position = document.getElementById('aiPosition')?.value.trim() || '';

  const genderText = gender === 'male' ? 'мужчина' : 'женщина';
  const styleText = AI_STYLE_TEXT[style];

  let prompt = `Напиши текст поздравления с днём рождения.\n\n`;
  prompt += `Получатель: ${genderText}`;
  if (position) prompt += `, должность: ${position}`;
  prompt += `.\n`;
  prompt += `Стиль: ${styleText}.\n`;
  prompt += `Объём: 2-4 предложения (не более 300 символов).\n`;
  prompt += `Формат: только основной текст без заголовка "С днём рождения!". Без эмодзи.`;

  const resultBlock = document.getElementById('aiResult');
  const promptTextarea = document.getElementById('aiPromptText');

  promptTextarea.value = prompt;
  resultBlock.classList.remove('hidden');
  showToast('Промт готов — скопируйте и вставьте в ИИ-сервис');
}

function togglePresets() {
  const list = document.getElementById('textTemplatesList');
  const arrow = document.getElementById('presetsArrow');
  const isHidden = list.classList.toggle('hidden');
  arrow.style.transform = isHidden ? '' : 'rotate(180deg)';
}

function copyPrompt() {
  const text = document.getElementById('aiPromptText')?.value;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btnCopy');
    if (btn) {
      btn.textContent = 'Скопировано!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Скопировать';
        btn.classList.remove('copied');
      }, 2000);
    }
    showToast('Промт скопирован');
  }).catch(() => {
    showToast('Не удалось скопировать — скопируйте вручную');
  });
}

// =====================
// Export: PNG & PDF
// =====================

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function loadImg(src) {
  // Загружаем через fetch → blob URL чтобы избежать canvas taint на iOS
  try {
    const blob = await fetch(src).then(r => r.blob());
    const objectUrl = URL.createObjectURL(blob);
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(objectUrl); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('img load failed')); };
      img.src = objectUrl;
    });
  } catch {
    // Fallback: прямая загрузка (для data URL из загруженного фото)
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}

async function buildCardCanvas() {
  const SCALE = 3;
  const CARD_W = document.getElementById('finalCard').offsetWidth * SCALE;
  const IMG_H = Math.round(CARD_W * 3 / 4);
  const PAD_X = 16 * SCALE;
  const PAD_TOP = 14 * SCALE;
  const PAD_BOT = 18 * SCALE;
  const MAX_W = CARD_W - PAD_X * 2;
  const FONT = "'SB Sans Interface', -apple-system, BlinkMacSystemFont, sans-serif";

  const header = val('fieldHeader');
  const appeal = val('fieldAppeal');
  const description = val('fieldDescription');
  const footer = val('fieldFooter');
  const showLogo = document.querySelector('input[name="showLogo"]:checked')?.value === 'yes';

  await document.fonts.ready;

  // Wrap text into lines
  const tmpCtx = document.createElement('canvas').getContext('2d');
  function getLines(text, fontStr, maxW) {
    if (!text) return [];
    tmpCtx.font = fontStr;
    return text.split('\n').flatMap(para => {
      const lines = [];
      let line = '';
      for (const word of para.split(' ')) {
        const test = line ? line + ' ' + word : word;
        if (tmpCtx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
        else line = test;
      }
      if (line) lines.push(line);
      return lines;
    });
  }

  const FS_H = 19 * SCALE, LH_H = 1.2, MB_H = 8 * SCALE;
  const FS_A = 12 * SCALE, LH_A = 1.4, MB_A = 5 * SCALE;
  const FS_D = 11 * SCALE, LH_D = 1.55, MB_D = 8 * SCALE;
  const FS_F = 11 * SCALE, LH_F = 1.4;

  const hLines = getLines(header, `600 ${FS_H}px ${FONT}`, MAX_W);
  const aLines = getLines(appeal, `500 ${FS_A}px ${FONT}`, MAX_W);
  const dLines = getLines(description, `${FS_D}px ${FONT}`, MAX_W);
  const fLines = getLines(footer, `${FS_F}px ${FONT}`, MAX_W);

  let textH = PAD_TOP;
  if (hLines.length) textH += hLines.length * FS_H * LH_H + MB_H;
  if (aLines.length) textH += aLines.length * FS_A * LH_A + MB_A;
  if (dLines.length) textH += dLines.length * FS_D * LH_D + MB_D;
  if (fLines.length) textH += fLines.length * FS_F * LH_F;
  textH += PAD_BOT;

  const TOTAL_H = IMG_H + Math.round(textH);
  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = TOTAL_H;
  const ctx = canvas.getContext('2d');

  // Rounded corners
  const R = 16 * SCALE;
  ctx.beginPath();
  ctx.moveTo(R, 0); ctx.lineTo(CARD_W - R, 0);
  ctx.arcTo(CARD_W, 0, CARD_W, R, R); ctx.lineTo(CARD_W, TOTAL_H - R);
  ctx.arcTo(CARD_W, TOTAL_H, CARD_W - R, TOTAL_H, R); ctx.lineTo(R, TOTAL_H);
  ctx.arcTo(0, TOTAL_H, 0, TOTAL_H - R, R); ctx.lineTo(0, R);
  ctx.arcTo(0, 0, R, 0, R);
  ctx.closePath();
  ctx.clip();

  // Image block background
  ctx.fillStyle = '#0D9E92';
  ctx.fillRect(0, 0, CARD_W, IMG_H);

  const bgSrc = state.customImageSrc || (state.templateIndex >= 0 ? TEMPLATE_IMAGES[state.templateIndex] : null);
  if (bgSrc) {
    try {
      const bgImg = await loadImg(bgSrc);
      const scale = Math.max(CARD_W / bgImg.naturalWidth, IMG_H / bgImg.naturalHeight);
      const dw = bgImg.naturalWidth * scale, dh = bgImg.naturalHeight * scale;
      ctx.drawImage(bgImg, (CARD_W - dw) / 2, (IMG_H - dh) / 2, dw, dh);
    } catch (e) { console.warn('bg image error', e); }
  }

  // Gradient overlay on image
  const g1 = ctx.createLinearGradient(0, IMG_H * 0.45, 0, IMG_H);
  g1.addColorStop(0, 'rgba(13,158,146,0)');
  g1.addColorStop(1, 'rgba(13,158,146,1)');
  ctx.fillStyle = g1;
  ctx.fillRect(0, IMG_H * 0.45, CARD_W, IMG_H * 0.55);

  // Logo
  if (showLogo) {
    try {
      const logo = await loadImg('assets/logo/sber-logo.png');
      const lw = 72 * SCALE;
      ctx.drawImage(logo, 12 * SCALE, 12 * SCALE, lw, Math.round(lw * logo.naturalHeight / logo.naturalWidth));
    } catch {}
  }

  // Text block
  const g2 = ctx.createLinearGradient(0, IMG_H, 0, TOTAL_H);
  g2.addColorStop(0, '#0D9E92');
  g2.addColorStop(1, '#006B60');
  ctx.fillStyle = g2;
  ctx.fillRect(0, IMG_H, CARD_W, textH);

  ctx.textBaseline = 'top';
  let y = IMG_H + PAD_TOP;

  function drawLines(lines, fs, lh, fontStr, alpha) {
    if (!lines.length) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'white';
    ctx.font = fontStr;
    for (const line of lines) { ctx.fillText(line, PAD_X, y); y += fs * lh; }
    ctx.restore();
  }

  drawLines(hLines, FS_H, LH_H, `600 ${FS_H}px ${FONT}`, 1.0);   if (hLines.length) y += MB_H;
  drawLines(aLines, FS_A, LH_A, `500 ${FS_A}px ${FONT}`, 0.9);   if (aLines.length) y += MB_A;
  drawLines(dLines, FS_D, LH_D, `${FS_D}px ${FONT}`, 0.85);      if (dLines.length) y += MB_D;
  drawLines(fLines, FS_F, LH_F, `${FS_F}px ${FONT}`, 0.75);

  return canvas;
}

async function downloadPNG() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('hidden');
  try {
    const canvas = await buildCardCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const blob = await fetch(dataUrl).then(r => r.blob());
    const file = new File([blob], 'открытка.png', { type: 'image/png' });
    overlay.classList.add('hidden');
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
    } else {
      const a = document.createElement('a');
      a.download = 'открытка.png';
      a.href = dataUrl;
      a.click();
      showToast('PNG сохранён');
    }
  } catch (err) {
    console.error(err);
    overlay.classList.add('hidden');
    showToast('Ошибка при создании PNG');
  }
}

async function downloadPDF() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('hidden');
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
    const canvas = await buildCardCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('открытка.pdf');
    showToast('PDF сохранён');
  } catch (err) {
    console.error(err);
    showToast('Ошибка при создании PDF');
  } finally {
    overlay.classList.add('hidden');
  }
}

// =====================
// Reset
// =====================

function resetApp() {
  state.stage = 1;
  state.templateIndex = 0;
  state.customImageSrc = null;

  // Сброс полей
  document.getElementById('fieldHeader').value = 'С днём рождения!';
  document.getElementById('fieldAppeal').value = '';
  document.getElementById('fieldDescription').value = '';
  document.getElementById('fieldFooter').value = '';
  document.getElementById('aiPosition').value = '';
  document.getElementById('aiResult').classList.add('hidden');
  document.getElementById('aiPromptText').value = '';
  document.querySelectorAll('.tpl-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('input[name="aiGender"]')[0].checked = true;
  document.querySelectorAll('input[name="aiStyle"]')[0].checked = true;

  // Сброс загруженного фото
  const uploadSlot = document.getElementById('uploadSlot');
  if (uploadSlot) {
    uploadSlot.classList.remove('selected');
    document.getElementById('uploadContent')?.classList.remove('hidden');
    const uploadImg = document.getElementById('uploadPreviewImg');
    if (uploadImg) {
      uploadImg.classList.add('hidden');
      uploadImg.src = '';
    }
    const fileInput = document.getElementById('fileInput');
    if (fileInput) fileInput.value = '';
  }

  // Сброс выделения шаблонов
  renderTemplates();
  updateCharCount();
  goToStage(1);
}

// =====================
// Toast
// =====================

let toastTimer = null;

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}
