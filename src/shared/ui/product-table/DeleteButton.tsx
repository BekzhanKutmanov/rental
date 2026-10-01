import styles from "./ActionButton.module.scss";
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteButton = ({ onClick }) => {
  return (  
    <button
      className={styles.action_button}
      type="button"
      onClick={onClick}
      aria-label="Удалить"
    >
      <div className={styles.action_button__delete}><DeleteIcon /></div>
    </button>
  );
};

export default DeleteButton;