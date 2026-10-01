import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import styles from "./ProductTable.module.scss";
import type { ProductType } from "../../../types/types";
import { EditProductModal } from "../../../features/edit-product";
import { useState } from "react";

type ProductTableProps = {
  products?: ProductType[];
  onEdit?: (product: ProductType) => void;
  onDelete?: (productId?: number) => void;
};

const ProductTable = ({ products = [], onEdit, onDelete }: ProductTableProps) => {
  const [editableProductId, setEditableProductId] = useState<number | null>(null);

  const handleEdit = (product: ProductType) => {
    if (!product.id) {
      return;
    }

    setEditableProductId(product.id);
    onEdit?.(product);
  };
    
  return (
    <div className={styles.product_table}>
      {/* Desktop */}
      <div className={styles.product_table__desktop}>
        <table>
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Цена</th>
              <th>Комплекты</th>
              <th>Действия</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.product_table__image}>
                    <img src={product.image || ''} alt={product.title} />
                  </div>
                </td>

                <td className={styles.product_table__name}>
                  {product.title}
                </td>

                <td className={styles.product_table__description}>
                  {product.desc || "—"}
                </td>

                <td className={styles.product_table__price}>
                  {product.price} ₽
                </td>

                <td>
                  {product.set ? (
                    <span className={styles.product_table__bundle}>
                      -
                      {product.set.title}
                      {product.set.box}
                    </span>
                  ) : (
                    <span className={styles.product_table__empty}>—</span>
                  )}
                </td>

                <td>
                  <div className={styles.product_table__actions}>
                    <EditButton onClick={() => handleEdit(product)} />

                    <DeleteButton
                      onClick={() => onDelete?.(product.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.product_table__footer}>
          Показано {products?.length} материалов
        </div>
      </div>

      {/* Mobile */}
      <div className={styles.product_table__mobile}>
        {products?.map((product) => (
          <article className={styles.product_card} key={product.id}>
            <div className={styles.product_card__header}>
              <div className={styles.product_card__image}>
                <img src={product.image || ''} alt={product.title} />
              </div>

              <div className={styles.product_card__main}>
                <h3>{product.title}</h3>

                <p>{product.desc || "Нет описания"}</p>
              </div>
            </div>

            <div className={styles.product_card__info}>
              <div className={styles.product_card__field}>
                <span>Цена</span>
                <strong>{product.price} ₽</strong>
              </div>

              <div className={styles.product_card__field}>
                <span>Комплект</span>

                {product.set ? (
                  <div className={styles.product_table__bundle}>
                    {product.set.title}
                    {product.set.box}
                  </div>
                ) : (
                  <strong>—</strong>
                )}
              </div>
            </div>

            <div className={styles.product_card__actions}>
              <EditButton onClick={() => handleEdit(product)} />

              <DeleteButton
                onClick={() => onDelete?.(product.id)}
              />
            </div>
          </article>
        ))}
      </div>

      <EditProductModal
        open={editableProductId !== null}
        productId={editableProductId}
        onClose={() => setEditableProductId(null)}
      />
    </div>
  );
};

export default ProductTable;
