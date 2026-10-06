import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Button, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import { productFetch } from "../../features/api/productManagerApi";
import { ProductCard } from "../../shared/ui/product-card";
import type { ProductType } from "../../types/types";
import styles from "./ProductList.module.scss";

type ProductCardsListProps = {
  searchQuery: string;
  onAddQuantity: (product: ProductType) => void;
  onOpenDetails?: (product: ProductType) => void;
};

export function ProductCardsList({
  searchQuery,
  onAddQuantity,
  onOpenDetails,
}: ProductCardsListProps) {
  const productQuery = useQuery({
    queryKey: ["productList"],
    queryFn: productFetch,
  });

  const products = productQuery.data ?? [];
  const normalizedSearch = searchQuery.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!normalizedSearch) {
      return products;
    }

    return products.filter((product) =>
      product.title.toLowerCase().includes(normalizedSearch),
    );
  }, [normalizedSearch, products]);

  if (productQuery.isLoading) {
    return (
      <div className={styles.listState}>
        <CircularProgress size={30} />
        <span>Загружаем материалы...</span>
      </div>
    );
  }

  if (productQuery.isError) {
    return (
      <Alert
        className={styles.alert}
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => productQuery.refetch()}
          >
            Повторить
          </Button>
        }
      >
        Не удалось загрузить список материалов.
      </Alert>
    );
  }

  if (!products.length) {
    return (
      <div className={styles.emptyState}>
        <Inventory2OutlinedIcon />
        <h3>Материалов пока нет</h3>
        <p>Создайте первый материал в менеджере, и он появится в этом списке.</p>
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div className={styles.emptyState}>
        <SearchOffIcon />
        <h3>Ничего не найдено</h3>
        <p>Попробуйте изменить название в поиске.</p>
      </div>
    );
  }

  return (
    <section className={styles.catalogSection} aria-label="Список материалов">
      <div className={styles.listMeta}>
        <span>
          Показано {filteredProducts.length} из {products.length}
        </span>
        {productQuery.isFetching && <CircularProgress size={16} />}
      </div>

      <div className={styles.cardsGrid}>
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id ?? product.title}
            product={product}
            onOpenDetails={() => onOpenDetails?.(product)}
            onAddQuantity={() => onAddQuantity(product)}
          />
        ))}
      </div>
    </section>
  );
}
