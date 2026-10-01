import styles from "./ActionButton.module.scss";
import EditIcon from '@mui/icons-material/Edit';

const EditButton = ({ onClick }) => {
  return (
    <button
      className={styles.action_button}
      type="button"
      onClick={onClick}
      aria-label="Редактировать"
    >
      <div className={styles.action_button__edit}>
        <EditIcon />  
      </div>
    </button>
  );
};

export default EditButton;