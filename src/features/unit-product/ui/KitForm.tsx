import { useState } from "react";
import styles from "./KitForm.module.scss";
import { Button, TextField } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';

const KitForm = ({setBox}: {setBox: (boxValue: {box: string, title: string})=> void}) => {
  const [name, setName] = useState("Комплект");
  const [boxValue, setBoxValue] = useState('');
  const [boxCreateState, setBoxCreateState] = useState(false);

  return (
    <div className={styles.kit}>
      <div className={styles.kit__form}>
        <label className={styles.kit__label}>
          Название комплекта
          <TextField
            className={styles.kit__input}
            type="text"
            placeholder="Например, Упаковка 10 шт."
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
          />
        </label>

        <label className={styles.kit__label}>
          Количество в комплекте

          <div className={styles.quantity__wrap}>
            <TextField
              className={styles.kit__input}
              type="number"
              value={boxValue}
              onChange={(e) => {
                setBoxValue(e.target.value);
              }}
              size="small"
            />
            <span>шт.</span>
          </div>
        </label>

        <p className={styles.kit__description}>
          Это будет отдельный товар-комплект, состоящий из указанного
          количества единиц материала.
        </p>
        <div className={styles.kit__wrapBtn}>

          <Button 
            variant="contained" 
            size="small" 
            endIcon={<>
              {boxCreateState ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
            </>} 
            disabled={name && boxValue ? false : true}
            onClick={()=> {
              setBox({box: boxValue, title: name});
              setBoxCreateState(true);
            }}>Создать комплект</Button>

        </div>
      </div>
    </div>
  );
};

export default KitForm;