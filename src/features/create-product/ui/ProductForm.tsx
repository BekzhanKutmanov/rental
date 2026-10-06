import { Button, CircularProgress, TextField } from '@mui/material';
import { useState } from 'react';
import { z } from 'zod';
import ImageUpload from '../../../shared/ui/ImageUpload ';
import Switch from '@mui/material/Switch';
import styles from './product.module.scss';
import KitForm from '../../unit-product/ui/KitForm';
import type { SetBox } from '../../../types/SetBoxType';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productPost } from '../../api/productManagerApi';
import AddIcon from '@mui/icons-material/Add';
import { useToast, toastMessages } from '../../../shared/lib';

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
  const toast = useToast();
  const [values, setValues] = useState<ProductFormFields>({
    title: '',
    price: '',
  });
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [box, setBox] = useState<SetBox | null>(null);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [unitChecked, setUnitChecked] = useState(false);
  const [createBtnSpinner, setCreateBtnSpinner] = useState(false);

  const errors = getValidationErrors(values);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      return await productPost({ title: values.title, price: values.price, image: image, desc: description, set: box });
    },
    onSuccess: (success) => {
      setCreateBtnSpinner(false);
      toast.success(toastMessages.created);
      console.log(success, ' success !!!');
      queryClient.invalidateQueries({
        queryKey: ['productList']
      })
    },
    onError: (error) => {
      setCreateBtnSpinner(false);
      const apiError = error as { date?: { message?: string } };
      if (apiError?.date?.message) {
        toast.error(apiError.date.message);
      }
      toast.error(toastMessages.error);
    }
  });

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

  const handleSubmit = () => {
    setTouched({
      title: true,
      price: true,
    });

    const validationErrors = getValidationErrors(values);

    if (Object.keys(validationErrors).length > 0) {
      toast.warning('Заполните все поля!');
      return;
    } else {
      setCreateBtnSpinner(true);
      mutation.mutate();
    }

    console.log('Product form values:', values);
  };

  const renderForm = () => {
    const showTitleError = Boolean(touched.title && errors.title);
    const showPriceError = Boolean(touched.price && errors.price);

    return (
      <form className={styles.form__element} noValidate onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}>
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
            <TextField
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              className={styles.form__textarea}
              placeholder="Необязательно"
            />
          </div>

          <div className={styles.left__unit}>
            <h4>Комплектация <small>(по желанию)</small></h4>
            <Switch
              checked={unitChecked}
              onChange={(e) => setUnitChecked(e.target.checked)}
              slotProps={{ input: { 'aria-label': 'controlled' } }}
            />
          </div>

          {unitChecked && (<div className={styles.kitFormAnimation}>
            <KitForm setBox={(box) => setBox(box)} />
          </div>)}
        </div>

        <div className={styles.line}></div>

        <div className={styles.right__wrap}>
          <ImageUpload imageSrc={(img: string | null) => setImage(img)} />

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

          <div className={styles.wrapBtn}>
            <Button
              variant='contained'
              type='submit'
              size='small'
              disabled={createBtnSpinner}
              endIcon={
                createBtnSpinner ? <CircularProgress size={'15px'} aria-label="Loading…" />
                  : <AddIcon />
              }
            >Создать
            </Button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <div className={styles.productForm}>
      {renderForm()}
    </div>
  );
}
