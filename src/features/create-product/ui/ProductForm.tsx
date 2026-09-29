import { TextField } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { useState } from 'react';
import { z } from 'zod';
import ImageUpload from '../../../shared/ui/ImageUpload ';
import styles from './product.module.scss';

const productSchema = z.object({
  title: z.string().trim().min(1, 'Название обязательно'),
  price: z.string().trim().min(1, 'Цена за единицу обязательна'),
});

type ProductFormFields = z.infer<typeof productSchema>;
type ProductFormErrors = Partial<Record<keyof ProductFormFields, string>>;
type TouchedFields = Partial<Record<keyof ProductFormFields, boolean>>;

const getValidationErrors = (values: ProductFormFields) => {
  const result = productSchema.safeParse(values);

  if (result.success) {
    return {};
  }

  return result.error.issues.reduce<ProductFormErrors>((errors, issue) => {
    const field = issue.path[0] as keyof ProductFormFields | undefined;

    if (field && !errors[field]) {
      errors[field] = issue.message;
    }

    return errors;
  }, {});
};

export function ProductForm() {
  const [values, setValues] = useState<ProductFormFields>({
    title: '',
    price: '',
  });
  const [touched, setTouched] = useState<TouchedFields>({});

  const errors = getValidationErrors(values);

  const handleChange = (field: keyof ProductFormFields, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleBlur = (field: keyof ProductFormFields) => {
    setTouched((currentTouched) => ({
      ...currentTouched,
      [field]: true,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      title: true,
      price: true,
    });

    const validationErrors = getValidationErrors(values);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    console.log('Product form values:', values);
  };

  const renderForm = () => {
    const showTitleError = Boolean(touched.title && errors.title);
    const showPriceError = Boolean(touched.price && errors.price);

    return (
      <form className={styles.form__element} noValidate onSubmit={handleSubmit}>
        <div className={styles.left__wrap}>
          <div className={styles.left__wrap}>
            <h4>
              Название <span className="red-color">*</span>
            </h4>
            <TextField
              className={styles.form__input}
              error={showTitleError}
              helperText={showTitleError ? errors.title : ''}
              id="product-title"
              onBlur={() => handleBlur('title')}
              onChange={(event) => handleChange('title', event.target.value)}
              placeholder="Леса"
              size="small"
              value={values.title}
              variant="outlined"
            />
          </div>

          <div className={styles.left__wrap}>
            <h4>Описание</h4>
            <TextareaAutosize
              aria-label="minimum height"
              className={styles.form__textarea}
              minRows={3}
              placeholder="Необязательно"
            />
          </div>
        </div>

        <div className={styles.line}></div>

        <div className={styles.right__wrap}>
          <ImageUpload imageSrc={(img: string | null) => console.log(img)} />

          <div className={styles.default__flex}>
            <div className={styles.left__wrap}>
              <h4>
                Цена за единицу <span className="red-color">*</span>
              </h4>
              <TextField
                className={styles.form__input}
                error={showPriceError}
                helperText={showPriceError ? errors.price : ''}
                onBlur={() => handleBlur('price')}
                onChange={(event) => handleChange('price', event.target.value)}
                size="small"
                type="number"
                value={values.price}
              />
            </div>
            <div className={styles.product__unit}>Ед. (шт)</div>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div>
      <div>
        <h2>Создать строительный материал</h2>
        <span>
          Заполните информацию о материале. Вы сможете отредактировать её позже.
        </span>
      </div>

      {renderForm()}
    </div>
  );
}
