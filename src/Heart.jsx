import React from 'react';

const Heart = ({ textToShow }) => {
  const height = 75; // высота консоли
  const width = 190; // ширина консоли
  const buffer = Array.from({ length: height }, () => Array(width).fill(' '));
  const textLength = textToShow.length;
  let textIndex = 0; // Индекс текущего символа в текстовой строке

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const x = (j / width) * 4 - 2; // нормализуем x в диапазон [-2, 2]
      const y = -1 * ((i / height) * 4 - 2); // нормализуем y в диапазон [-2, 2]

      // Проверяем уравнение сердца
      if (x ** 2 + (y - Math.sqrt(Math.abs(x))) ** 2 - 1 <= 0) {
        // Метод заполнения строки
        buffer[i][j] = textToShow[textIndex]; // Помещаем текущий символ в сердце
        textIndex = (textIndex + 1) % textLength; // Переходим к следующему символу
      }
    }
  }

  // Преобразуем массив в строку для отображения
  const output = buffer.map((row) => row.join('')).join('\n');

  return (
    <pre style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>{output}</pre>
  );
};

export default Heart;
