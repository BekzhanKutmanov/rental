import styles from './ProductDetails.module.scss';
import { useQuery } from '@tanstack/react-query';
import { productFetchById } from '../../../features/api/productManagerApi';
import { CircularProgress } from '@mui/material';

// Структуры типов
export interface AllItem {
    id: string | null;
    quantity: number;
    dinamycPrice: number;
}

export interface RentalItem {
    id: string;
    clientName: string;
    rentedQuantity: number;
    startDate: string;
    endDate: string;
    isOverdue: boolean; // Окончено ли время аренды (просрочка)
}

export interface ProductDetailsProps {
    productId: number;
    onClose: () => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onClose }) => {
    const { data, isFetching, isLoading } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => productFetchById(productId),
        refetchOnMount: "always",
    });

    //   1. Подсчет общего 
    // количества из массива alls + дефолтных rentals
    const totalFromAlls = data?.quantity?.alls?.reduce((acc, item) => acc + item.quantity, 0) || 0;
    const defaultRentals = data?.quantity?.rentals || 0;
    const totalQuantity = totalFromAlls + defaultRentals;

    // 2. Подсчет текущего количества товаров в аренде
    //   const currentlyRented = data?.quantity?.rentals.reduce((acc, r) => acc + r.rentedQuantity, 0);
    const currentlyRented = data?.quantity?.rentals;

    // 3. Подсчет свободных товаров
    const freeQuantity = Math.max(0, totalQuantity - currentlyRented);

    // Проценты для прогресс-бара
    const freePercent = totalQuantity > 0 ? (freeQuantity / totalQuantity) * 100 : 0;
    const rentedPercent = totalQuantity > 0 ? (currentlyRented / totalQuantity) * 100 : 0;

    console.log(data);

    const detailRender = () => (
        <>
            {/* Шапка модального меню */}
            <div className={styles.header}>
                <div>
                    <span className={styles.subtitle}>Подробнее о товаре</span>
                    <h2 className={styles.title}>ID: #{data?.id}</h2>
                </div>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
                    ✕
                </button>
            </div>

            {/* Основной контент */}
            <div className={styles.content}>

                {/* 1. Карточка товара (Фото, название, описание) */}
                <div className={styles.productHero}>
                    <img
                        src={data?.image || '/placeholder.jpg'}
                        alt={data?.title}
                        className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                        <h3 className={styles.productName}>{data?.title}</h3>
                        {data?.desc && (
                            <p className={styles.productDescription}>{data.desc}</p>
                        )}
                        <span className={styles.badge}>
                            Дефолтная цена: {data?.price} / день
                        </span>
                    </div>
                </div>

                {/* 2. Наличие и соотношение аренд (Индикатор 8 всего / 4 арендовано) */}
                <div className={styles.availabilityBox}>
                    <div className={styles.availabilityHeader}>
                        <span className={styles.sectionTitle}>Наличие на складе</span>
                        <span className={styles.totalCount}>Всего: {totalQuantity} шт.</span>
                    </div>

                    {/* Прогресс-бар полосы */}
                    <div className={styles.progressBar}>
                        <div
                            className={styles.barFree}
                            style={{ width: `${freePercent}%` }}
                            title={`Свободно: ${freeQuantity}`}
                        />
                        <div
                            className={styles.barRented}
                            style={{ width: `${rentedPercent}%` }}
                            title={`Арендовано: ${currentlyRented}`}
                        />
                    </div>

                    {/* Сводка в цифрах */}
                    <div className={styles.statsGrid}>
                        <div className={`${styles.statCard} ${styles.total}`}>
                            <span className={styles.statLabel}>Общее кол-во</span>
                            <span className={styles.statValue}>{totalQuantity} шт.</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.free}`}>
                            <span className={styles.statLabel}>Свободно</span>
                            <span className={styles.statValue}>{freeQuantity} шт.</span>
                        </div>
                        <div className={`${styles.statCard} ${styles.rented}`}>
                            <span className={styles.statLabel}>Арендовано</span>
                            <span className={styles.statValue}>{currentlyRented} шт.</span>
                        </div>
                    </div>
                </div>

                {/* 3. Динамические цены (Отображение массива alls) */}
                {data?.quantity?.alls && data.quantity.alls.length > 0 && (
                    <div>
                        <h4 className={styles.sectionHeading}>Категории партий и цен (alls)</h4>
                        <div className={styles.allsGrid}>
                            {data.quantity.alls.map((item, idx) => (
                                <div key={item.id || idx} className={styles.allCard}>
                                    <div>
                                        <span className={styles.partyLabel}>Партия #{idx + 1}</span>
                                        <span className={styles.partyQuantity}>{item.quantity} шт.</span>
                                    </div>
                                    <div>
                                        <span className={styles.priceLabel}>Цена/день</span>
                                        <span className={styles.partyPrice}>{item.dinamycPrice} сом</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. ТЕКУЩИЕ АРЕНДЫ (В самом низу) */}
                <div>
                    <h4 className={styles.sectionHeading}>
                        Текущие аренды ({data.quantity?.rentals})
                    </h4>

                    <div className={styles.rentalsList}>
                        {data?.quantity?.rentals === 0 ? (
                            <div className={styles.emptyState}>Активные аренды отсутствуют</div>
                        ) : (
                            data.quantity?.alls?.map((rental) => (
                                <div
                                    key={rental.id}
                                    className={`${styles.rentalCard} ${rental.isOverdue ? styles.overdue : styles.active
                                        }`}
                                >
                                    <div className={styles.rentalTop}>
                                        <div>
                                            {/* <span className={styles.clientName}>{rental.clientName}</span> */}
                                            <span className={styles.rentedCount}>
                                                {/* Взято: <strong>{rental.quantity} шт.</strong> */}
                                            </span>
                                        </div>

                                        {/* Различие статусов */}
                                        {/* {rental.isOverdue ? (
                                                <span className={styles.statusBadge}>
                                                    ⚠️ Время вышло (не вернули)
                                                </span>
                                            ) : (
                                                <span className={styles.statusBadge}>
                                                    <span className={styles.dot}></span>
                                                    Активна
                                                </span>
                                            )} */}
                                    </div>

                                    <div className={styles.rentalBottom}>
                                        <span>Срок аренды:</span>
                                        <span className={styles.dateValue}>
                                            {/* {rental.startDate} — {rental.endDate} */}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Футер */}
            <div className={styles.footer}>
                <button className={styles.closeFooterBtn} onClick={onClose}>
                    Закрыть
                </button>
            </div>
        </>
    )

    if (!data) return null;

    if (data)
        return (
            <div className={`${styles.overlay} ${isFetching ? 'spinner__opacityBg' : ''}` }>
                <div className={styles.drawer}>
                    {isFetching ? <div className={'spinner__blurBg'}><CircularProgress aria-label="Loading…" /></div>
                     : detailRender()
                    }
                </div>
            </div>

        );
};