import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import styles from "./ProductTable.module.scss";
import type { ProductType } from "../../../types/types";
import { EditProductModal } from "../../../features/edit-product";
import { DeleteProductModal } from "../../../features/delete-product";
import { useState } from "react";
import { CircularProgress, Skeleton } from "@mui/material";
import MySkeleton from "../MySkeleton";

type ProductTableProps = {
  products?: ProductType[];
  mounted: boolean;
  loading: boolean;
};

const ProductTable = ({ products = [], mounted, loading }: ProductTableProps) => {
  const [editableProductId, setEditableProductId] = useState<number | null>(null);
  const [deletableProduct, setDeletableProduct] = useState<ProductType | null>(null);

  const handleEdit = (product: ProductType) => {
    if (!product.id) {
      return;
    }

    setEditableProductId(product.id);
  };

  const handleDelete = (product: ProductType) => {
    setDeletableProduct(product);
  };

  const desctopSkeleton = () => {
    return <div className={styles.product_table__skeleton_desctop}>
      <MySkeleton count={1} length={'1000px'} height={'70px'} />
      <MySkeleton count={3} length={'1000px'} height={'100px'} />
    </div>
  }

  const mobileSkeleton = () => {
    return <div className={styles.product_table__skeleton_mobile}>
      <MySkeleton count={3} length={'350px'} height={'200px'} />
    </div>
  }

  return (
    <div className={styles.product_table}>

      {/* Desktop */}
      {
        mounted ? desctopSkeleton() :
          <div className={styles.product_table__desktop}>
            <table className={loading ? `${styles.table__opacity}` : ''}>
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
                        {product?.image ? <img src={product.image} alt={product.title} />
                          : <img src={'/favicon.svg'} alt={product.title} />}
                      </div>
                    </td>

                    <td className={styles.product_table__name}>
                      {product.title}
                    </td>

                    <td className={styles.product_table__description}>
                      {product.desc || "—"}
                    </td>

                    <td className={styles.product_table__price}>
                      {product.price} сом
                    </td>

                    <td>
                      {product.set ? (
                        <span className={styles.product_table__bundle}>
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
                          onClick={() => handleDelete(product)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && <div className={styles.table__progress}><CircularProgress aria-label="Loading…" /></div>}

            <div className={styles.product_table__footer}>
              Показано {products?.length} материалов
            </div>
          </div>
      }

      {/* Mobile */}
      
      {
        mounted ? mobileSkeleton() : <div className={styles.product_table__mobile}>
          {products?.map((product) => (
            <article
              className={`${styles.product_card} ${loading ? styles.table__opacity : ""
                }`}
              key={product.id}
            >
              <div className={styles.product_card__top}>
                <div className={styles.product_card__image}>
                  <img
                    src={product?.image || "/favicon.svg"}
                    alt={product.title}
                  />
                </div>

                <div className={styles.product_card__main}>
                  <h3>{product.title}</h3>

                  <p>{product.desc || "Нет описания"}</p>
                </div>

                <div className={styles.product_card__actions}>
                  <EditButton onClick={() => handleEdit(product)} />

                  <DeleteButton onClick={() => handleDelete(product)} />
                </div>
              </div>

              <div className={styles.product_card__bottom}>
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
                    <strong className={styles.product_card__empty}>—</strong>
                  )}
                </div>
              </div>
            </article>
          ))}

          {loading && (
            <div className={styles.table__progress}>
              <CircularProgress aria-label="Loading…" />
            </div>
          )}
        </div>
      }

      <EditProductModal
        open={editableProductId !== null}
        productId={editableProductId}
        onClose={() => setEditableProductId(null)}
      />

      <DeleteProductModal
        open={deletableProduct !== null}
        product={deletableProduct}
        onClose={() => setDeletableProduct(null)}
      />
    </div>
  );
};

export default ProductTable;
