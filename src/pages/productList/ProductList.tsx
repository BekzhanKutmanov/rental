import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { productPut } from "../../features/api/productManagerApi";
import { toastMessages, useToast } from "../../shared/lib";
import type { ProductType } from "../../types/types";
import { ProductCardsList } from "./ProductCardsList";
import styles from "./ProductList.module.scss";
import { ProductDetails } from "../../shared/ui/product-detail/ProductDetail";

// Интерфейс для независимой пары количество-цена
interface PriceQuantityRow {
    id: string | null;
    quantity: number;
    dinamycPrice: number;
}

// Вспомогательная функция для извлечения дефолтной цены из строки (например, "100 сомов" -> 100)
const parseDefaultPrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
};

export default function ProductList() {
    const toast = useToast();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [productDetailFl, setProductDetailFl] = useState(false);

    // Состояние массива строк (количество + цена)
    const [rows, setRows] = useState<PriceQuantityRow[]>([
        { id: "1", quantity: 1, dinamycPrice: 0 }
    ]);
    const activeDetailRef = useRef<number | null>(null);

    const quantityMutation = useMutation({
        mutationFn: () => {
            if (!selectedProduct?.id) {
                throw new Error("Product id is required");
            }

            const currentQuantity = selectedProduct.quantity ?? { alls: 0, rentals: 0 };

            // Если в бэкенд нужно отправлять последнюю или обновленную цену, 
            // либо массив цен — адаптируйте под ваш API. Здесь берем цену из первой строки или дефолтную.

            const newAllQuentityValues = selectedProduct?.quantity?.alls.concat(rows);

            return productPut(selectedProduct.id, {
                ...selectedProduct,
                quantity: {
                    alls: newAllQuentityValues,
                    rentals: currentQuantity.rentals,
                },
            });
        },
        onSuccess: () => {
            toast.success(toastMessages.updated ?? "Количество обновлено");
            queryClient.invalidateQueries({ queryKey: ["productList"] });
            handleCloseQuantityDialog();
        },
        onError: () => {
            toast.error(toastMessages.error);
        },
    });

    const handleOpenQuantityDialog = (product: ProductType) => {
        setSelectedProduct(product);

        const total = product?.quantity?.alls?.reduce((acc, item) => {
            return acc += item?.quantity;
        }, 0);

        if (total) setTotalQuantity(total);

        const defaultPrice = parseDefaultPrice(product.price);
        // Инициализируем одной строкой с дефолтной ценой товара
        setRows([
            { id: Math.random().toString(), quantity: 1, dinamycPrice: defaultPrice }
        ]);
    };

    const handleDetailDialog = (id: number) => {
        activeDetailRef.current = id;
        console.log(activeDetailRef.current);
        
        if (productDetailFl) {
            setProductDetailFl(false);
        } else {
            setProductDetailFl(true);
        }
        console.log(id);
    }

    const handleCloseQuantityDialog = () => {
        setSelectedProduct(null);
        setRows([{ id: "1", quantity: 1, dinamycPrice: 0 }]);
    };

    // Добавить новую строку для другой цены
    const handleAddRow = () => {
        const defaultPrice = selectedProduct ? parseDefaultPrice(selectedProduct.price) : 0;
        setRows([...rows, { id: Math.random().toString(), quantity: 0, dinamycPrice: defaultPrice }]);
    };

    // Удалить конкретную строку
    const handleDeleteRow = (id: string | null) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    // Изменение полей в строке
    const handleRowChange = (id: string | null, field: 'quantity' | 'dinamycPrice', value: string) => {
        setRows(
            rows.map(row => {
                if (row.id === id) {
                    return { ...row, [field]: value === '' ? '' : Number(value) };
                }
                return row;
            })
        );
    };

    const handleAddQuantity = () => {
        // Валидация строк
        for (const row of rows) {
            const qty = Number(row.quantity);
            if (!Number.isFinite(qty) || qty <= 0) {
                toast.warning("Введите корректное количество больше нуля");
                return;
            }
        }

        quantityMutation.mutate();
    };

    const sampleProduct = {
        id: "PL-9081",
        name: "Строительный генератор Honda 5 кВт",
        description: "Бензиновый генератор высокой мощности. Подходит для питания инструмента на объектах.",
        price: "1 500 ₽",
        imageUrl: "https://example.com/generator.jpg",
        quantity: {
            rentals: 2,
            alls: [
                { id: "1", quantity: 4, dinamycPrice: 1500 },
                { id: "2", quantity: 2, dinamycPrice: 1300 } // Скидка за опт
            ]
        },
        activeRentalsList: [
            {
                id: "rent-101",
                clientName: "ООО 'СтройТех'",
                rentedQuantity: 2,
                startDate: "01.10.2026",
                endDate: "05.10.2026",
                isOverdue: true // Просрочено (подсветится красным)
            },
            {
                id: "rent-102",
                clientName: "Иван Петров",
                rentedQuantity: 2,
                startDate: "06.10.2026",
                endDate: "10.10.2026",
                isOverdue: false // В сроке (зеленый статус)
            }
        ]
    };

    return (
        <main className={styles.page}>
            {productDetailFl && <ProductDetails productId={activeDetailRef.current} onClose={() => setProductDetailFl(false)} />}
            {productDetailFl + ' lorem'}
            <header className={styles.hero}>
                <div>
                    <span className={styles.eyebrow}>Каталог</span>
                    <h1 className={styles.title}>Список материалов</h1>
                    <p className={styles.subtitle}>
                        Быстрый просмотр материалов, цен и доступного количества. Найдите нужную
                        позицию по названию и пополните склад прямо из карточки.
                    </p>
                </div>

                <div className={styles.searchPanel}>
                    <label className={styles.searchLabel} htmlFor="product-search">
                        Поиск по названию
                    </label>
                    <TextField
                        className={styles.searchInput}
                        id="product-search"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Например: леса"
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: <SearchIcon fontSize="small" />,
                            },
                        }}
                    />
                </div>
            </header>

            <div className={styles.content}>
                <ProductCardsList
                    searchQuery={searchQuery}
                    onAddQuantity={handleOpenQuantityDialog}
                    onOpenDetails={handleDetailDialog}
                />
            </div>

            <Dialog
                open={selectedProduct !== null}
                onClose={handleCloseQuantityDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Добавить количество</DialogTitle>
                <DialogContent>
                    <div className={styles.quantityDialog}>
                        {selectedProduct && (
                            <div className={styles.quantityProduct}>
                                <img
                                    src={selectedProduct.image || "/favicon.svg"}
                                    alt={selectedProduct.title}
                                />
                                <div>
                                    <h3>{selectedProduct.title}</h3>
                                    <span>Сейчас: {totalQuantity || 0} шт.</span>
                                </div>
                            </div>
                        )}

                        {/* Контейнер динамических строк ввода */}
                        <div className={styles.rowsContainer}>
                            {rows.map((row, index) => (
                                <div key={row.id} className={styles.quantityPriceRow}>
                                    <TextField
                                        label={`Кол-во #${index + 1}`}
                                        value={row.quantity}
                                        onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        slotProps={{
                                            htmlInput: { min: 1 },
                                        }}
                                    />

                                    <TextField
                                        label="Цена за шт."
                                        value={row.dinamycPrice}
                                        onChange={(e) => handleRowChange(row?.id, 'dinamycPrice', e.target.value)}
                                        type="number"
                                        size="small"
                                        fullWidth
                                        slotProps={{
                                            htmlInput: { min: 0 },
                                        }}
                                    />

                                    {rows.length > 1 && (
                                        // <IconButton
                                        //     color="error"
                                        //     onClick={() => handleDeleteRow(row?.id)}
                                        //     size="small"
                                        //     title="Удалить строку"
                                        // >
                                        //     {/* <DeleteOutlineIcon /> */}
                                        // </IconButton>
                                        <div onClick={() => handleDeleteRow(row?.id)}>delete</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Кнопка с плюсом для добавления новой партии/цены */}
                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddRow}
                            className={styles.addRowButton}
                            fullWidth
                        >
                            Добавить еще цену / партию
                        </Button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        type="button"
                        onClick={handleCloseQuantityDialog}
                        disabled={quantityMutation.isPending}
                        startIcon={<CloseIcon />}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="button"
                        variant="contained"
                        onClick={handleAddQuantity}
                        disabled={quantityMutation.isPending}
                        startIcon={<AddIcon />}
                    >
                        Добавить
                    </Button>
                </DialogActions>
            </Dialog>
        </main>
    );
}