import React from 'react';
import styles from './ProductCard.module.scss';

export interface ProductType {
  id?: number;
  title: string;
  image: string | null;
  price: string;
  quantity?: {
    alls: number;
    rentals: number;
  };
}

interface ProductCardProps {
  product: ProductType;
  isSelected?: boolean;
  onSelect?: (id?: number) => void;
  onOpenDetails?: (id?: number) => void;
  onAddQuantity?: (id?: number, event?: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected = false,
  onSelect,
  onOpenDetails,
  onAddQuantity,
}) => {
  const { id, title, image, price, quantity } = product;

  // Расчет количества
  const total = quantity?.alls ?? 0;
  const rented = quantity?.rentals ?? 0;
  const available = Math.max(0, total - rented);

  // Расчет процента свободных товаров для progress-bar
  const availablePercent = total > 0 ? Math.min(100, Math.round((available / total) * 100)) : 0;

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(id);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(id);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем открытие модального окна карточки
    if (onAddQuantity) {
      onAddQuantity(id, e);
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Чекбокс массового выбора */}
      <label className={styles.checkboxWrapper} onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className={styles.checkboxInput}
        />
        <span className={styles.customCheckbox} />
        <span className={styles.checkboxLabel}>В аренду</span>
      </label>

      {/* Изображение */}
      <div className={styles.imageContainer}>
        {/* {image ? ( */}
          <img src={'/gemini.jfif'} alt={title} className={styles.image} />
        {/* ) : (
          <div className={styles.noImage}>Нет фото</div>
        )} */}
      </div>

      {/* Основная информация */}
      <div className={styles.content}>
        <h3 className={styles.title} title={title}>
          {title}
        </h3>
        
        <div className={styles.priceRow}>
          <span className={styles.price}>{price} сом</span>
          <span className={styles.priceUnit}>/ в день</span>
        </div>

        {/* Шкала наличия */}
        <div className={styles.availabilitySection}>
          <div className={styles.progressBarBg}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${availablePercent}%` }}
            />
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Всего:</span>
              <span className={styles.statValue}>{total} шт.</span>
            </div>

            <div className={styles.statStatus}>
              <span className={`${styles.badge} ${styles.available}`}>
                <span className={styles.dot}></span>
                Доступно: <strong>{available}</strong>
              </span>
              <span className={`${styles.badge} ${styles.rented}`}>
                <span className={styles.dot}></span>
                В аренде: <strong>{rented}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.detailsBtn}
            onClick={handleCardClick}
          >
            Подробнее
          </button>

          <button
            type="button"
            className={styles.addBtn}
            onClick={handleAddClick}
            title="Быстрое добавление количества"
          >
            <span className={styles.plusIcon}>+</span>
            <span className={styles.addBtnText}>Добавить товар</span>
          </button>
        </div>
      </div>
    </div>
  );
};
