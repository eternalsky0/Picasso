// =====================
// Constants
// =====================

// Все фоновые изображения из assets/images/new/ — добавьте новый файл в папку и укажите имя здесь
const TEMPLATE_IMAGES = [
  'assets/images/new/preset_image_1.png',
  'assets/images/new/preset_image_2.png',
  'assets/images/new/preset_image_3.png',
  'assets/images/new/preset_image_4.png',
  'assets/images/new/preset_image_5.png',
  'assets/images/new/preset_image_6.png',
  'assets/images/new/preset_image_7.png',
  'assets/images/new/3_1920x1080_ЛЕТО_2025.jpg',
  'assets/images/new/5_1920x1080_ЛЕТО_2025.jpg',
  'assets/images/new/6_1920x1080_ЛЕТО_2025.jpg',
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

const FOOTER_PRESETS = [
  'С уважением, \nАрхангельское отделение ПАО Сбербанк',
  'С уважением, Управляющий \nАрхангельским отделением ПАО Сбербанк\nДмитрий Гордеев',
  'С уважением, Заместитель управляющего\nАрхангельского отделения ПАО Сбербанк\nРуслан Атанаев',
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
  renderFooterPresets();
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
  if (step === 3) {
    renderFinalCard();
    document.getElementById('finalRenderedImg').classList.add('hidden');
    document.getElementById('finalRenderedImg').src = '';
    document.getElementById('finalCard').classList.remove('hidden');
    document.getElementById('iosSaveHint').classList.add('hidden');
    document.getElementById('downloadRow').classList.remove('hidden');
    document.getElementById('desktopHint').classList.remove('hidden');
  }

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
  prompt += `Формат: только основной текст без упоминания "С днём рождения!". Без эмодзи.`;

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

function renderFooterPresets() {
  const list = document.getElementById('footerTemplatesList');
  if (!list) return;

  FOOTER_PRESETS.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'tpl-item footer-tpl-item';
    btn.textContent = text;
    btn.onclick = () => applyFooterPreset(text, i);
    list.appendChild(btn);
  });
}

function applyFooterPreset(text, index) {
  const field = document.getElementById('fieldFooter');
  if (!field) return;
  field.value = text;
  autoResize(field);
  syncPreview();

  document.querySelectorAll('.footer-tpl-item').forEach((el, i) => {
    el.classList.toggle('active', i === index);
  });

  showToast('Подпись применена');
}

function toggleFooterPresets() {
  const list = document.getElementById('footerTemplatesList');
  const arrow = document.getElementById('footerPresetsArrow');
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
// Export: Canvas-based PNG & PDF
// =====================

const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Загружаем изображение через обычный Image() — без XHR, без CORS проблем
function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  for (const para of text.split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        line = word;
      } else {
        line = test;
      }
    }
    if (line) { ctx.fillText(line, x, y); y += lineHeight; }
  }
  return y;
}

function measureWrappedHeight(ctx, text, maxWidth, lineHeight) {
  let h = 0;
  for (const para of text.split('\n')) {
    const words = para.split(' ');
    let line = '';
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && line) { h += lineHeight; line = word; }
      else line = test;
    }
    h += lineHeight;
  }
  return h || lineHeight;
}

async function buildCardDataUrl() {
  const S = 3;

  // Гарантируем что layout готов перед чтением offsetWidth
  await new Promise(r => requestAnimationFrame(r));

  const cardEl = document.getElementById('finalCard');
  const W = Math.max((cardEl ? cardEl.offsetWidth : 0) || 280, 1) * S;
  const IMG_H = Math.round(W * 3 / 4);   // соотношение 4:3 из CSS
  const PAD_X = 16 * S;
  const PAD_TOP = 14 * S;
  const PAD_BOT = 18 * S;
  const FONT = '"SB Sans Interface", Arial, sans-serif';
  const TEXT_W = W - PAD_X * 2;

  const bgSrc = state.customImageSrc || (state.templateIndex >= 0 ? TEMPLATE_IMAGES[state.templateIndex] : null);
  const showLogo = document.querySelector('input[name="showLogo"]:checked')?.value === 'yes';

  const [bgImg, logoImg] = await Promise.all([
    bgSrc ? loadImg(bgSrc).catch(() => null) : Promise.resolve(null),
    showLogo ? loadImg('assets/logo/sber-logo.png').catch(() => null) : Promise.resolve(null),
  ]);

  // Таймаут 3с — защита от iOS Safari бага где document.fonts.ready зависает
  await Promise.race([
    document.fonts.ready,
    new Promise(r => setTimeout(r, 3000)),
  ]);

  const header      = val('fieldHeader');
  const appeal      = val('fieldAppeal');
  const description = val('fieldDescription');
  const footer      = val('fieldFooter');

  // Измеряем высоту текстового блока
  const mc = document.createElement('canvas');
  mc.width = W; mc.height = 1;
  const mCtx = mc.getContext('2d');
  let textH = PAD_TOP;
  if (header)      { mCtx.font = `600 ${19*S}px ${FONT}`;  textH += measureWrappedHeight(mCtx, header,      TEXT_W, Math.round(19*S*1.2))  + 8*S; }
  if (appeal)      {                                          textH += 12*S + 5*S; }
  if (description) { mCtx.font = `${11*S}px ${FONT}`;       textH += measureWrappedHeight(mCtx, description, TEXT_W, Math.round(11*S*1.55)) + 8*S; }
  if (footer)      { mCtx.font = `${11*S}px ${FONT}`;        textH += measureWrappedHeight(mCtx, footer, TEXT_W, Math.round(11*S*1.4)); }
  textH += PAD_BOT;

  const TOTAL_H = IMG_H + Math.max(textH, 60*S);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = TOTAL_H;
  const ctx = canvas.getContext('2d');

  // 1. Фон блока изображения
  ctx.fillStyle = '#0D9E92';
  ctx.fillRect(0, 0, W, IMG_H);

  // 2. Фоновое изображение (object-fit: cover)
  if (bgImg) {
    const iA = bgImg.width / bgImg.height, cA = W / IMG_H;
    let dW, dH, dX, dY;
    if (iA > cA) { dH = IMG_H; dW = dH * iA; dX = (W-dW)/2; dY = 0; }
    else          { dW = W;    dH = dW / iA;  dX = 0;        dY = (IMG_H-dH)/2; }
    ctx.drawImage(bgImg, dX, dY, dW, dH);
  }

  // 3. Градиентный оверлей (нижние 55%)
  const gY = IMG_H * 0.45;
  const g = ctx.createLinearGradient(0, gY, 0, IMG_H);
  g.addColorStop(0, 'rgba(13,158,146,0)');
  g.addColorStop(1, 'rgba(13,158,146,1)');
  ctx.fillStyle = g;
  ctx.fillRect(0, gY, W, IMG_H - gY);

  // 4. Логотип
  if (logoImg) {
    const lW = 72*S, lH = lW * logoImg.height / logoImg.width;
    ctx.drawImage(logoImg, 12*S, 12*S, lW, lH);
  }

  // 5. Текстовый блок
  const tg = ctx.createLinearGradient(0, IMG_H, 0, TOTAL_H);
  tg.addColorStop(0, '#0D9E92');
  tg.addColorStop(1, '#006B60');
  ctx.fillStyle = tg;
  ctx.fillRect(0, IMG_H, W, TOTAL_H - IMG_H);

  // 6. Текст
  ctx.textBaseline = 'top';
  let y = IMG_H + PAD_TOP;

  if (header) {
    ctx.font = `600 ${19*S}px ${FONT}`;
    ctx.fillStyle = '#ffffff';
    y = wrapText(ctx, header, PAD_X, y, TEXT_W, Math.round(19*S*1.2));
    y += 8*S;
  }
  if (appeal) {
    ctx.font = `500 ${12*S}px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(appeal, PAD_X, y);
    y += 12*S + 5*S;
  }
  if (description) {
    ctx.font = `${11*S}px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    y = wrapText(ctx, description, PAD_X, y, TEXT_W, Math.round(11*S*1.55));
    y += 8*S;
  }
  if (footer) {
    ctx.font = `${11*S}px ${FONT}`;
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    wrapText(ctx, footer, PAD_X, y, TEXT_W, Math.round(11*S*1.4));
  }

  return canvas.toDataURL('image/png');
}

function dataUrlToBlob(dataUrl) {
  const [header, data] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

async function downloadPNG() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('hidden');
  try {
    const dataUrl = await buildCardDataUrl();

    if (isIOS) {
      const blob = dataUrlToBlob(dataUrl);
      const file = new File([blob], 'открытка.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        // Нативное меню iOS — "Сохранить фото", AirDrop и т.д.
        overlay.classList.add('hidden');
        await navigator.share({ files: [file] });
      } else {
        // Fallback для старых iOS — показываем изображение, зажать → сохранить
        document.getElementById('finalRenderedImg').src = dataUrl;
        document.getElementById('finalRenderedImg').classList.remove('hidden');
        document.getElementById('finalCard').classList.add('hidden');
        document.getElementById('iosSaveHint').classList.remove('hidden');
        document.getElementById('desktopHint').classList.add('hidden');
      }
    } else {
      const link = document.createElement('a');
      link.download = 'открытка.png';
      link.href = dataUrl;
      link.click();
      showToast('PNG сохранён');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      showToast('Ошибка при создании PNG');
    }
  } finally {
    overlay.classList.add('hidden');
  }
}

async function downloadPDF() {
  const overlay = document.getElementById('loadingOverlay');
  overlay.classList.remove('hidden');
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');
    const dataUrl = await buildCardDataUrl();
    const img = await loadImg(dataUrl);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: img.width > img.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [img.width, img.height],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);

    if (isIOS) {
      const blob = pdf.output('blob');
      const file = new File([blob], 'открытка.pdf', { type: 'application/pdf' });
      overlay.classList.add('hidden');
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        window.open(URL.createObjectURL(blob), '_blank');
      }
    } else {
      pdf.save('открытка.pdf');
      showToast('PDF сохранён');
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      showToast('Ошибка при создании PDF');
    }
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
  document.querySelectorAll('.footer-tpl-item').forEach(el => el.classList.remove('active'));
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
