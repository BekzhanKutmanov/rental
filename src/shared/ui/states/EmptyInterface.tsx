import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import styles from './EmptyInterface.module.scss';

export default function EmptyInterface() {
    return <div className={styles.emptyContainer}>
        <div className={styles.emptyState}>
            <div className={styles.iconBox}>
                <Inventory2OutlinedIcon />
            </div>
            <div className={styles.content}>
                <h3>Пусто</h3>
                <p>Данных пока нет</p>
            </div>
        </div>
    </div>
}
