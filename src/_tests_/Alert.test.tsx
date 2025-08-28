import React from 'react'; // Импортируем React
import { render, screen } from '@testing-library/react'; // Импортируем функции для рендеринга и поиска элементов
import Alert, { Variant } from './Alert'; // Импортируем компонент Alert и тип Variant
import '@testing-library/jest-dom'; // Импортируем дополнительные матчеры для Jest

describe('Alert Component', () => {
  // Группа тестов для компонента Alert

  // Тест 1: Проверка отображения компонента
  test('renders alert when isOpen is true', () => {
    // Рендерим компонент Alert с isOpen равным true и передаем текст сообщения
    render(
      <Alert isOpen={true} variant="neutral">
        Test message
      </Alert>
    );
    
    // Ищем элемент с ролью 'alert'
    const alertElement = screen.getByRole('alert');
    
    // Проверяем, что элемент отображается в документе
    expect(alertElement).toBeInTheDocument();
    // Проверяем, что текст сообщения присутствует в элементе
    expect(alertElement).toHaveTextContent('Test message');
  });

  // Тест 2: Проверка скрытия компонента
  test('does not render when isOpen is false', () => {
    // Рендерим компонент Alert с isOpen равным false
    const { container } = render(
      <Alert isOpen={false} variant="neutral">
        Test message
      </Alert>
    );
    
    // Проверяем, что контейнер первого дочернего элемента равен null, т.е. компонент не отображается
    expect(container.firstChild).toBeNull();
  });

  // Упрощенная проверка вариантов без использования styles
  test('renders different variants correctly', () => {
    // Массив возможных вариантов для компонента Alert
    const variants: Variant[]  = ['neutral', 'info', 'positive', 'notice', 'negative'];
    
    // Проходим по каждому варианту в массиве
    variants.forEach(variant => {
      // Рендерим компонент Alert с текущим вариантом
      const { unmount } = render(
        <Alert isOpen={true} variant={variant}>
          Test {variant} message
        </Alert>
      );
      
      // Ищем элемент с ролью 'alert'
      const alertElement = screen.getByRole('alert');
      
      // Проверяем, что элемент отображается в документе
      expect(alertElement).toBeInTheDocument();
      // Проверяем, что текст сообщения соответствует текущему варианту
      expect(alertElement).toHaveTextContent(`Test ${variant} message`);
      
      // Убираем компонент из DOM после проверки
      unmount();
    });
  });

  // Тест 4: Проверка содержимого children
  test('renders children content correctly', () => {
    // Создаем тестовое содержимое с HTML элементами
    const testContent = <div>Custom content with <strong>HTML</strong></div>;
    
    // Рендерим компонент Alert с содержимым
    render(
      <Alert isOpen={true} variant="info">
        {testContent}
      </Alert>
    );

    // Проверяем, что текст 'Custom content with' присутствует в документе
    expect(screen.getByText('Custom content with')).toBeInTheDocument();
    // Проверяем, что текст 'HTML' присутствует в документе
    expect(screen.getByText('HTML')).toBeInTheDocument();
  });

  // Тест 5: Проверка ARIA атрибутов
  test('has correct ARIA attributes', () => {
    // Рендерим компонент Alert
    render(
      <Alert isOpen={true} variant="neutral">
        Test message
      </Alert>
    );

    // Ищем элемент с ролью 'alert'
    const alertElement = screen.getByRole('alert');
    
    // Проверяем, что атрибут 'aria-live' установлен на 'assertive'
    expect(alertElement).toHaveAttribute('aria-live', 'assertive');
    // Проверяем, что атрибут 'aria-atomic' установлен на 'true'
    expect(alertElement).toHaveAttribute('aria-atomic', 'true');
  });
});
