import { useState } from "react";
import styles from "./KitForm.module.scss";
import { TextField } from "@mui/material";

const KitForm = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState<string>('10');

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
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              size="small"
            />
            <span>шт.</span>
          </div>
        </label>

        <p className={styles.kit__description}>
          Это будет отдельный товар-комплект, состоящий из указанного
          количества единиц материала.
        </p>
      </div>

      <div className={styles.kit__info}>
        <span className={styles.kit__icon}>i</span>

        <p>
          Все товары в системе являются штучными.
          <br />
          Комплектация позволяет создать дополнительный товар,
          <br />
          состоящий из нескольких единиц этого материала.
        </p>
      </div>
    </div>
  );
};

export default KitForm;