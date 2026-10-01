import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from '@mui/icons-material/Close';
import styles from './ImageUpload.module.scss';

const ImageUpload = ({ imageSrc }: { imageSrc: (img: string | null) => void }) => {
    const [preview, setPreview] = useState<null | string>(null);

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];

        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        imageSrc(file);
    };

    const clearFile = ()=> {
        setPreview(null);
        imageSrc(null);
    }

    return (
        <div className={styles.photo}>
            <h4 className={styles.photo__title}>Фото <span className="red-color">*</span></h4>

            { preview && <span className={styles.close__btn} onClick={clearFile}>
                <CloseIcon />
            </span> }

            <label className={styles.photo__upload}>

                {preview ? (
                    <img
                        className={styles.photo__preview}
                        src={preview}
                        alt="Выбранное фото"
                    />
                ) : (
                    <div className={styles.photo__placeholder}>
                        <CloudUploadIcon />

                        <span>
                            Нажмите для выбора
                            <br />
                            изображения
                        </span>
                    </div>
                )}

                <input
                    className={styles.photo__input}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </label>

            <p className={styles.photo__info}>
                Поддерживаются форматы: JPG, PNG, WEBP. Макс. размер: 5 МБ.
            </p>
        </div>
    );
};

export default ImageUpload;