import { useState } from "react";
import { ProductForm } from "../../features/create-product";
import styles from './ProductManager.module.scss';
import { Button, Switch } from "@mui/material";
import { ProductTable } from "../../shared/ui/product-table";
import { useQuery } from "@tanstack/react-query";
import { productFetch } from "../../features/api/productManagerApi";

export default function ProductManager() {
    const [formView, setFormView] = useState(false);

    const { data } = useQuery({
        queryKey: ['productList'],
        queryFn: productFetch,
    });

    return <>
        <div className={styles.productForm__header}>
            <h2>Все материалы</h2>
            <Button
                className={styles.switch}
                type="button"
                variant="contained"
                onClick={() => setFormView((prev) => !prev)}
                aria-pressed={formView}
                size="small"
            >
                <span>Создать материал</span>
                <Switch
                    className={styles.switchControl}
                    checked={formView}
                    size="small"
                    slotProps={{ input: { 'aria-hidden': true, tabIndex: -1, readOnly: true } }}
                />
            </Button>
        </div>

        {/* Заполнение формы */}

        <div className={`${styles.formWrapper} ${formView ? styles.open : ''}`}>
            <div className={styles.formContent}>
                <ProductForm />
            </div>
        </div>

        {/* Список продуктов */}

        <ProductTable
            products={data}
            onEdit={() => { }}
            onDelete={() => { }}
        />
    </>
}
