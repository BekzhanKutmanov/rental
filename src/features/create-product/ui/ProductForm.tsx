import { TextField } from "@mui/material";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';


export function ProductForm() {
    // Стилизуем скрытый инпут
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('Выбран файл:', file.name);
            // Ваша логика сохранения файла в стейт формы
        }
    };

    const renderForm = () => {
        return (
            <form>
                <div className="">
                    <div>
                        <div>
                            <h4>Название *</h4>
                            <TextField id="outlined-basic" label="Outlined" variant="outlined" size="small" />
                        </div>

                        <div>
                            <h4>Описание</h4>
                            <TextareaAutosize
                                aria-label="minimum height"
                                minRows={3}
                                placeholder="Minimum 3 rows"
                                style={{ width: 200 }}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Загрузить фото
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*" // Разрешаем только изображения
                                onChange={handleFileChange}
                            />
                        </Button>
                        <div>
                            <h4>Цена за единицу *</h4>
                            <TextField type="number" defaultValue={0} size="small" sx={{ fontSize: '13px' }} />
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    return (
        <div>
            {/* subtitle */}
            <div>
                <h2>Создать строительный материал</h2>
                <span>Заполните информацию о материале. Вы сможете отредактировать её позже.</span>
            </div>

            {renderForm()}

        </div>
    );
};