import React from 'react';

const Bottle = ({ textToShow }) => {
  const height = 75; // высота «консоли»
  const width = 150; // ширина «консоли»
  const buffer = Array.from({ length: height }, () => Array(width).fill(' '));

  const textLength = Math.max(1, (textToShow || '').length);
  let textIndex = 0;

  // Нормализованные границы по Y ([-1, 1])
  const yTop = 0.95;
  const yBase = -0.95;

  // Полуширины
  const bodyHalfW = 0.4; // полу-ширина тела
  const neckHalfW = 0.12; // полу-ширина горлышка
  const lipHalfW = neckHalfW + 0.06; // кромка у горлышка (чуть шире)

  // Зоны по Y
  const capHeight = 0.05; // высота кромки (у самого верха)
  const yCapStart = yTop - capHeight;

  const yNeckBottom = 0.4; // низ горлышка (переход к плечам)
  const shoulderRy = 0.18; // вертикальный радиус плеч
  const shoulderYC = yNeckBottom - shoulderRy; // центр эллипса плеч
  const yShoulderBottom = yNeckBottom - shoulderRy;

  const baseRy = 0; // вертикальный радиус закругления у дна
  const baseYC = yBase + baseRy; // центр нижнего эллипса
  const yBaseRoundTop = yBase + baseRy;

  // Вспомогательная функция: безопасный корень
  const safeSqrt = (v) => (v > 0 ? Math.sqrt(v) : 0);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      // Нормализация координат: x,y ∈ [-1, 1], ось Y направлена вверх
      const x = (j / (width - 1)) * 2 - 1;
      const y = 1 - (i / (height - 1)) * 2;

      let inShape = false;

      // 1) Кромка (lip) у самого верха
      if (y > yCapStart && y <= yTop) {
        if (Math.abs(x) <= lipHalfW) inShape = true;
      }

      // 2) Горлышко
      if (y > yNeckBottom && y <= yCapStart) {
        if (Math.abs(x) <= neckHalfW) inShape = true;
      }

      // 3) Плечи — нижняя половина эллипса, плавный переход от горлышка к телу
      if (y > yShoulderBottom && y <= yNeckBottom) {
        // Эллипс: (x/bodyHalfW)^2 + ((y - shoulderYC)/shoulderRy)^2 <= 1
        const ny = (y - shoulderYC) / shoulderRy;
        const maxX = bodyHalfW * safeSqrt(1 - ny * ny);
        // Гарантируем, что плечи не уже горлышка:
        const allowance = Math.max(neckHalfW, maxX);
        if (Math.abs(x) <= allowance) inShape = true;
      }

      // 4) Тело бутылки (прямые стенки)
      if (y > yBaseRoundTop && y <= yShoulderBottom) {
        if (Math.abs(x) <= bodyHalfW) inShape = true;
      }

      // 5) Закругление дна — верхняя половина эллипса, обращённая вниз
      if (y >= yBase && y <= yBaseRoundTop) {
        // Эллипс: (x/bodyHalfW)^2 + ((y - baseYC)/baseRy)^2 <= 1
        const ny = (y - baseYC) / baseRy;
        const maxX = bodyHalfW * safeSqrt(1 - ny * ny);
        if (Math.abs(x) <= maxX) inShape = true;
      }

      if (inShape) {
        buffer[i][j] = textToShow[textIndex % textLength];
        textIndex = (textIndex + 1) % textLength;
      }
    }
  }

  const output = buffer.map((row) => row.join('')).join('\n');

  return (
    <pre
      style={{
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        wordBreak: 'normal',
        lineHeight: '1em',
      }}
    >
      {output}
    </pre>
  );
};

export default Bottle;
